# early_init.py (앱 시작 가장 초기에 import되도록)
import sys
import os
import pathlib
import warnings

# OpenVINO tokenizers 버전 체크 무시 (PyInstaller 번들에서 발생하는 버전 불일치 경고 억제)
os.environ['OV_TOKENIZERS_DISABLE_VERSION_CHECK'] = '1'

# OpenVINO 버전 불일치 경고를 무시하고 강제로 로드하도록 패치
def _patch_openvino_version_check():
    """OpenVINO의 버전 체크를 우회하여 강제로 로드"""
    try:
        # 경고 메시지 억제
        warnings.filterwarnings('ignore', message='.*OpenVINO.*version.*')
        warnings.filterwarnings('ignore', message='.*binary compatible.*')

        # openvino_tokenizers 모듈의 버전 체크를 무력화
        try:
            import openvino_tokenizers
            # 버전 체크 관련 속성이 있으면 무력화
            if hasattr(openvino_tokenizers, '_check_version'):
                openvino_tokenizers._check_version = lambda: True
                print("[early_init] Patched OpenVINO Tokenizers version check")
        except ImportError:
            # openvino_tokenizers가 없어도 계속 진행
            pass

    except Exception as e:
        print(f"[early_init] Warning: Could not patch version check: {e}")

def _add_ov_tokenizer_dir():
    """PyInstaller 번들 환경에서 OpenVINO DLL 경로를 추가"""
    # PyInstaller로 번들된 경우 _MEIPASS 사용
    if hasattr(sys, '_MEIPASS'):
        base = pathlib.Path(sys._MEIPASS).resolve()
    else:
        base = pathlib.Path(__file__).parent.resolve()

    print(f"[early_init] Base path: {base}")

    # OpenVINO 관련 DLL 디렉토리 찾기
    dll_dirs_to_add = set()

    # 1. openvino_tokenizers.dll 찾기
    tokenizer_dlls = list(base.rglob("openvino_tokenizers.dll"))
    if not tokenizer_dlls:
        # 상위 디렉토리에서도 검색
        tokenizer_dlls = list((base / "..").resolve().rglob("openvino_tokenizers.dll"))

    for dll in tokenizer_dlls:
        dll_dirs_to_add.add(dll.parent)
        print(f"[early_init] Found openvino_tokenizers.dll at: {dll}")

    # 2. openvino/libs 디렉토리 찾기
    openvino_libs = base / "openvino" / "libs"
    if openvino_libs.exists():
        dll_dirs_to_add.add(openvino_libs)
        print(f"[early_init] Found openvino/libs at: {openvino_libs}")

    # 2. openvino/libs 디렉토리 찾기
    openvino_tokenizers_libs = base / "openvino_tokenizers" / "libs"
    if openvino_tokenizers_libs.exists():
        dll_dirs_to_add.add(openvino_tokenizers_libs)
        print(f"[early_init] Found openvino_tokenizers/libs at: {openvino_tokenizers_libs}")

    # 3. openvino_genai 디렉토리 찾기
    openvino_genai = base / "openvino_genai"
    if openvino_genai.exists():
        dll_dirs_to_add.add(openvino_genai)
        print(f"[early_init] Found openvino_genai at: {openvino_genai}")

    # 4. 모든 openvino 관련 DLL이 있는 디렉토리 추가
    for pattern in ["openvino*.dll", "*_plugin.dll"]:
        for dll_file in base.rglob(pattern):
            dll_dirs_to_add.add(dll_file.parent)

    # Windows DLL 검색 경로에 추가
    if hasattr(os, "add_dll_directory"):
        for dll_dir in dll_dirs_to_add:
            try:
                os.add_dll_directory(str(dll_dir))
                print(f"[early_init] Added DLL directory: {dll_dir}")
            except Exception as e:
                print(f"[early_init] Warning adding DLL directory {dll_dir}: {e}")

    # PATH 환경변수에도 추가 (fallback)
    if dll_dirs_to_add:
        new_path_entries = [str(d) for d in dll_dirs_to_add]
        current_path = os.environ.get('PATH', '')
        os.environ['PATH'] = os.pathsep.join(new_path_entries + [current_path])
        print(f"[early_init] Updated PATH with {len(new_path_entries)} directories")

    # OpenVINO Core에 extension 등록은 나중에 실제 사용 시점에 하도록 함
    # (early_init에서 Core를 생성하면 버전 체크 문제가 발생할 수 있음)
    if tokenizer_dlls:
        print(f"[early_init] Found tokenizer DLL (will be loaded on demand): {tokenizer_dlls[0]}")

# 모듈 import 시 자동 실행
#_patch_openvino_version_check()
_add_ov_tokenizer_dir()
