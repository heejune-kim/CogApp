# -*- mode: python ; coding: utf-8 -*-
import sys
import os
from pathlib import Path

# Python 사이트 패키지 경로 찾기
site_packages = next(Path(p) for p in sys.path if 'site-packages' in p and Path(p).exists())

# OpenVINO 관련 라이브러리 경로
openvino_path = site_packages / 'openvino'
openvino_libs = site_packages / 'openvino' / 'libs'

# OpenVINO tokenizer 관련 라이브러리 경로
openvino_tokenizers_path = site_packages / 'openvino_tokenizers'
openvino_tokenizers_libs = site_packages / 'openvino_tokenizers' / 'libs'

# 바이너리 파일 수집
binaries_list = []

# openvino 확장 DLL 찾기
if openvino_libs.exists():
    for dll_file in openvino_libs.rglob('*.dll'):
        binaries_list.append((str(dll_file), 'openvino/libs'))

# openvino_tokenizers 확장 DLL 찾기
if openvino_tokenizers_libs.exists():
    for dll_file in openvino_tokenizers_libs.rglob('*.dll'):
        binaries_list.append((str(dll_file), 'openvino_tokenizers/libs'))

# openvino_genai 관련 파일 찾기
openvino_genai_path = site_packages / 'openvino_genai'
if openvino_genai_path.exists():
    for dll_file in openvino_genai_path.rglob('*.dll'):
        binaries_list.append((str(dll_file), 'openvino_genai'))
    for pyd_file in openvino_genai_path.rglob('*.pyd'):
        binaries_list.append((str(pyd_file), 'openvino_genai'))

# OpenVINO 플러그인 찾기
if openvino_path.exists():
    for plugin_file in openvino_path.rglob('openvino_*.dll'):
        binaries_list.append((str(plugin_file), 'openvino'))

# OpenVINO 플러그인 찾기
if openvino_tokenizers_path.exists():
    for plugin_file in openvino_tokenizers_path.rglob('openvino_*.dll'):
        binaries_list.append((str(plugin_file), 'openvino_tokenizers'))

# 데이터 파일 수집
datas_list = []

# openvino 설정 파일
if openvino_path.exists():
    for xml_file in openvino_path.rglob('plugins.xml'):
        datas_list.append((str(xml_file), 'openvino'))

# openvino_genai 설정 파일
if openvino_genai_path.exists():
    for json_file in openvino_genai_path.rglob('*.json'):
        datas_list.append((str(json_file), 'openvino_genai'))

a = Analysis(
    ['src\\python\\server.py'],
    pathex=[],
    binaries=binaries_list,
    datas=datas_list,
    hiddenimports=[
        'openvino',
        'openvino.runtime',
        'openvino.frontend',
        'openvino_genai',
        'openvino_tokenizers',
        'sklearn.utils._weight_vector',
        'sklearn.neighbors.typedefs',
        'sklearn.neighbors.quad_tree',
        'sklearn.tree._utils',
        'uvicorn.logging',
        'uvicorn.loops',
        'uvicorn.loops.auto',
        'uvicorn.protocols',
        'uvicorn.protocols.http',
        'uvicorn.protocols.http.auto',
        'uvicorn.protocols.websockets',
        'uvicorn.protocols.websockets.auto',
        'uvicorn.lifespan',
        'uvicorn.lifespan.on',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        'torch',
        'torchvision',
        'torchaudio',
        'matplotlib',
        'pandas',
        'IPython',
        'jupyter',
        'notebook',
        'tkinter',
        'PyQt5',
        'PySide2',
        'gtk',
        'wx',
        'tensorboard',
        'tensorflow',
        'keras',
    ],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='server',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
