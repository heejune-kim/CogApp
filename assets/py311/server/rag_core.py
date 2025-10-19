import huggingface_hub as hf_hub
import openvino_genai as ov_genai
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import textwrap
import os
import time
import glob
from rag_utils import (
    get_logger,
    is_debug_mode,
)

CHUNK_SIZE = 900
CHUNK_OVERLAP = 150
TOP_K = 5
MAX_LENGTH = 200

# 모델 준비

RAG_PROMPT = (
    "지식 컨텍스트:\n[CONTEXT_BLOCK]\n\n"
    "질문: [USER_QUESTION]\n\n"
    "규칙:\n"
    "0) 각 답변의 마지막에 반드시 '<끝>'이라고 적어 종료하세요.\n"
    "1) 컨텍스트에 있는 정보만 사용.\n"
    "2) 없으면 '모르겠습니다.<끝>'라고 답변.\n"
    "3) 3문장 이내로 간결히.\n"
)

TRANSLATION_PROMPT = (
    "다음 문장을 영어로 번역해 주세요:\"[USER_QUESTION]\"\n\n"
    "규칙:\n"
    "0) 각 답변의 마지막에 반드시 '<끝>'이라고 적어 종료하세요.\n"
    "1) 정확하고 자연스럽게 번역할 것.\n"
    "2) 문화적 맥락을 고려할 것.\n"
    "3) 문법적으로 올바르게 작성할 것.\n"
    "4) 대답에 한글은 절대로 들어가면 안됨.\n"
)

REQUIRED_PATTERNS = ["*.xml", "*.bin", "*.json", "tokenizer.*", "*.txt", "*.model", "*.vocab", "*.merges", "*.sentencepiece*"]

RAG_PROMPT_PATH = None
TRANSLATION_PROMPT_PATH = None


def read_rag_prompt_from_file(prompt_path: str = None) -> str:
    global RAG_PROMPT

    logger = get_logger()
    if prompt_path is None:
        prompt_path = RAG_PROMPT_PATH
    if prompt_path and os.path.isfile(prompt_path):
        with open(prompt_path, "r", encoding="utf-8") as pf:
            prompt = pf.read()

            logger.debug(f"RAG prompt read from file: {prompt_path}")
            logger.debug(f"RAG prompt content: {prompt[:100]}...")  # 처음 100자만 로그에 출력

            RAG_PROMPT = prompt
        return prompt
    return None


def read_translation_prompt_from_file(prompt_path: str = None) -> str:
    global TRANSLATION_PROMPT

    if prompt_path is None:
        prompt_path = TRANSLATION_PROMPT_PATH

    if prompt_path and os.path.isfile(prompt_path):
        with open(prompt_path, "r", encoding="utf-8") as pf:
            prompt = pf.read()

            logger = get_logger()
            logger.debug(f"Translation prompt read from file: {prompt_path}")
            logger.debug(f"Translation prompt content: {prompt[:100]}...")  # 처음 100자만 로그에 출력

            TRANSLATION_PROMPT = prompt
        return prompt
    return None


def set_prompt_path(rag_prompt_path: str = None, translation_prompt_path: str = None):
    global RAG_PROMPT_PATH, TRANSLATION_PROMPT_PATH
    logger = get_logger()

    if rag_prompt_path and os.path.isfile(rag_prompt_path):
        RAG_PROMPT_PATH = rag_prompt_path
        logger.debug(f"RAG prompt path set to: {RAG_PROMPT_PATH}")

    if translation_prompt_path and os.path.isfile(translation_prompt_path):
        TRANSLATION_PROMPT_PATH = translation_prompt_path
        logger.debug(f"Translation prompt path set to: {TRANSLATION_PROMPT_PATH}")


def set_prompts(rag_prompt: str = None, translation_prompt: str = None):
    global RAG_PROMPT, TRANSLATION_PROMPT

    if rag_prompt:
        RAG_PROMPT = rag_prompt
    if translation_prompt:
        TRANSLATION_PROMPT = translation_prompt


def set_rag_params(chunk_size: int, chunk_overlap: int, top_k: int, max_length: int):
    global CHUNK_SIZE, CHUNK_OVERLAP, TOP_K, MAX_LENGTH

    CHUNK_SIZE = chunk_size
    CHUNK_OVERLAP = chunk_overlap
    TOP_K = top_k
    MAX_LENGTH = max_length


CHUNK_SIZE = 900
CHUNK_OVERLAP = 150
TOP_K = 5
MAX_LENGTH = 200
def _has_openvino_snapshot(local_dir: str) -> bool:
    """IR(xml/bin)와 토크나이저 파일이 있는지 간단히 점검."""
    if not os.path.isdir(local_dir):
        return False
    has_xml = len(glob.glob(os.path.join(local_dir, "*.xml"))) > 0
    has_bin = len(glob.glob(os.path.join(local_dir, "*.bin"))) > 0
    # 토크나이저 관련 파일은 모델마다 달라서 느슨하게 체크
    has_tok = any(glob.glob(os.path.join(local_dir, pat)) for pat in ["tokenizer.json", "tokenizer.model", "vocab.json", "vocab.txt"])
    return has_xml and has_bin and has_tok

def _download_if_needed(
    repo_id: str,
    local_dir: str,
    *,
    cache_dir: str | None = None,
    revision: str | None = None,
    token: str | None = None,
    allow_patterns: list[str] | None = None,
    force: bool = False,
    offline: bool = False,
) -> str:
    """
    필요한 파일이 없으면 snapshot_download로 내려받고,
    이미 있으면 그대로 경로만 반환.
    """
    if allow_patterns is None:
        allow_patterns = REQUIRED_PATTERNS

    # 이미 완비되어 있고 강제 재다운로드가 아니면 통과
    if not force and _has_openvino_snapshot(local_dir):
        return local_dir

    # 오프라인 강제 시, 없으면 에러
    if offline:
        # 오프라인이면 로컬에 있는 것만 허용
        if _has_openvino_snapshot(local_dir):
            return local_dir
        raise FileNotFoundError(f"offline=True 이고, '{local_dir}'에 필요한 파일이 없습니다.")

    # 온라인 모드: 필요한 것만 받아서 local_dir에 '실파일 복사' (symlink X)
    return hf_hub.snapshot_download(
        repo_id=repo_id,
        revision=revision,
        repo_type="model",
        cache_dir=cache_dir,
        local_dir=local_dir,
        local_dir_use_symlinks=False,   # 윈도우/이동식 경로 안전
        allow_patterns=allow_patterns,
        token=token,
        resume_download=True,
        force_download=force,
        local_files_only=False
    )

def prepare_model(
    model_id: str,
    model_path: str,
    device: str,
    *,
    cache_dir: str | None = None,
    revision: str | None = None,
    token: str | None = None,
    force_download: bool = False,
    offline: bool = False
):
    """
    - model_path에 모델이 완비되어 있으면 그대로 사용
    - 없으면 필요한 파일들만 받아서 배치
    - offline=True면 네트워크 없이 로컬만 사용
    """
    logger = get_logger()
    logger.debug(f"prepare_model called with model_id={model_id}, model_path={model_path}, device={device}, offline={offline}")

    t0 = time.time()
    resolved_dir = _download_if_needed(
        repo_id=model_id,
        local_dir=model_path,
        cache_dir=cache_dir,
        revision=revision,
        token=token,
        force=force_download,
        offline=offline
    )
    logger.debug(f"Model files are ready at: {resolved_dir}")

    # 버전 체크 경고를 무시하고 모델 로드 시도
    import warnings
    import io
    import sys

    # stderr를 캡처하여 버전 경고 메시지 억제
    original_stderr = sys.stderr
    try:
        # 경고 필터 설정
        warnings.filterwarnings('ignore', category=RuntimeWarning)

        # stderr를 임시로 리다이렉트 (버전 불일치 메시지는 C++ 레벨에서 stderr로 출력됨)
        captured_stderr = io.StringIO()
        sys.stderr = captured_stderr

        pipe = ov_genai.LLMPipeline(resolved_dir, device)

    except RuntimeError as e:
        # 버전 불일치 오류인 경우 무시하고 재시도
        error_msg = str(e)
        if "binary compatible" in error_msg.lower() or "version" in error_msg.lower():
            logger.warning(f"Version mismatch warning ignored: {error_msg}")
            logger.info("Attempting to load model despite version mismatch...")
            # 강제로 다시 시도 (이미 DLL이 로드되어 있으면 성공할 수 있음)
            pipe = ov_genai.LLMPipeline(resolved_dir, device)
        else:
            raise
    finally:
        # stderr 복원
        sys.stderr = original_stderr
        stderr_output = captured_stderr.getvalue()
        # 버전 관련 메시지가 아닌 경우에만 로그 출력
        if stderr_output and "binary compatible" not in stderr_output.lower():
            logger.debug(f"Model loading messages: {stderr_output}")

    # 선택: 로드 시간 로그
    logger.debug(f"[prepare_model] ready in {time.time() - t0:.2f}s at: {resolved_dir}")
    return pipe


"""
def prepare_model(model_id, model_path, device, cache_dir=None):
    hf_hub.snapshot_download(model_id, local_dir=model_path, cache_dir=cache_dir)
    pipe = ov_genai.LLMPipeline(model_path, device)
    return pipe
"""

# 데이터 로드 및 벡터스토어 준비

def prepare_knowledge(data_path, chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP):
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"지식 파일을 찾을 수 없습니다: {data_path}")
    with open(data_path, "r", encoding="utf-8", errors="ignore") as f:
        corpus = f.read()
    chunks = chunk_text(corpus, chunk_size, chunk_overlap)
    if not chunks:
        raise ValueError("지식 파일이 비어 있거나 너무 짧습니다.")
    vectorizer, X = build_vector_store(chunks)
    return chunks, vectorizer, X

# 텍스트 청크

def chunk_text(s, size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    s = s.strip()
    if not s:
        return []
    chunks = []
    start = 0
    n = len(s)
    while start < n:
        end = min(start + size, n)
        chunk = s[start:end]
        chunks.append(chunk)
        if end == n:
            break
        start = end - overlap
        if start < 0:
            start = 0
    return chunks

# 벡터스토어 구축

def build_vector_store(chunks):
    vectorizer = TfidfVectorizer(analyzer="char", ngram_range=(3, 5))
    X = vectorizer.fit_transform(chunks)
    return vectorizer, X

# 검색

def retrieve(query, vectorizer, X, chunks, top_k=TOP_K):
    qv = vectorizer.transform([query])
    sims = cosine_similarity(qv, X)[0]
    idxs = sims.argsort()[::-1][:top_k]
    results = [(i, float(sims[i]), chunks[i]) for i in idxs]
    return results

# 프롬프트 생성

def build_prompt(user_question, retrieved, prompt_template=RAG_PROMPT):
    src_lines = []
    for rank, (idx, score, text) in enumerate(retrieved, start=1):
        clipped = textwrap.shorten(text.replace("\n", " "), width=800, placeholder=" …")
        src_lines.append(f"[S{rank}] {clipped}")
    context_block = "\n".join(src_lines) if src_lines else "(컨텍스트 없음)"
    if is_debug_mode():
        prompt_template = read_rag_prompt_from_file()
        print("🔍 검색된 컨텍스트 블록:\n", context_block)
        print("🔍 사용자 질문:\n", user_question)
        print("🔍 RAG 프롬프트:\n", RAG_PROMPT)
    user_prompt = prompt_template.replace("[CONTEXT_BLOCK]", context_block).replace("[USER_QUESTION]", user_question)
    return user_prompt


def build_prompt_for_translation(user_question, prompt_template=TRANSLATION_PROMPT):
    if is_debug_mode():
        prompt_template = read_translation_prompt_from_file()
        print("🔍 사용자 질문(번역용):\n", user_question)
        print("🔍 번역 프롬프트:\n", prompt_template)
    user_prompt = prompt_template.replace("[USER_QUESTION]", user_question)
    return user_prompt

# 답변 생성

def generate_answer(pipe, prompt, max_length=MAX_LENGTH):
    answer = pipe.generate(prompt, max_length=max_length)
    if "<끝>" in answer:
        answer = answer.split("<끝>")[0].strip()
    if "(끝)" in answer:
        answer = answer.split("(끝)")[0].strip()
    return answer

if __name__ == "__main__":
    pass  # 테스트용 엔트리포인트는 없음
