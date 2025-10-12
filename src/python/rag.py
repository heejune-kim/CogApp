
import sys, os, time
import logging
import configparser
#from sklearn.feature_extraction.text import TfidfVectorizer
#from sklearn.metrics.pairwise import cosine_similarity
from rag_core import (
    prepare_model,
    prepare_knowledge,
    retrieve,
    build_prompt,
    build_prompt_for_translation,
    generate_answer,
    TOP_K,
    MAX_LENGTH
)
from rag_utils import (
    print_elapsed_time_and_update,
    read_file,
    write_text_to_file
)


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

DATA_PATH = "data.txt"


MODEL_ID = "OpenVINO/Mistral-7B-Instruct-v0.3-int4-ov"
MODEL_PATH = "Mistral-7B-Instruct-v0.3-int4-ov"
DEVICE = "GPU"


"""
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

# ===== 인덱스 구축 (문자 n-gram으로 한글 검색 품질 개선) =====
def build_vector_store(chunks):
    # analyzer='char'로 3~5gram: 한글/영문 혼용 텍스트에 강함
    vectorizer = TfidfVectorizer(analyzer="char", ngram_range=(3, 5))
    X = vectorizer.fit_transform(chunks)
    return vectorizer, X

# ===== 검색 =====
def retrieve(query, vectorizer, X, chunks, top_k=TOP_K):
    qv = vectorizer.transform([query])
    sims = cosine_similarity(qv, X)[0]
    idxs = sims.argsort()[::-1][:top_k]
    results = [(i, float(sims[i]), chunks[i]) for i in idxs]
    print("🔍 검색 결과:", results)
    return results


# ===== 프롬프트 구성 =====
def build_messages(user_question, retrieved):
    # 지식 컨텍스트를 S1, S2...로 붙임
    src_lines = []
    for rank, (idx, score, text) in enumerate(retrieved, start=1):
        # 너무 긴 조각은 살짝 접기
        clipped = textwrap.shorten(text.replace("\n", " "), width=800, placeholder=" …")
        src_lines.append(f"[S{rank}] {clipped}")

    context_block = "\n".join(src_lines) if src_lines else "(컨텍스트 없음)"
    user_prompt = (
        f"지식 컨텍스트:\n{context_block}\n\n"
        f"질문: {user_question}\n\n"
        "규칙:\n"
        "0) 각 답변의 마지막에 반드시 '<끝>'이라고 적어 종료하세요.\n"
        "1) 컨텍스트에 있는 정보만 사용.\n"
        "2) 없으면 '모르겠습니다.<끝>'라고 답변.\n"
        "4) 3문장 이내로 간결히.\n"
    )

    return user_prompt
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_prompt}
    ]

    return messages
"""


def load_model(model_path: str):
    global MODEL_ID, MODEL_PATH, DEVICE

    model_path = os.path.join(model_path, MODEL_PATH)
    logger.info(f"model_path: {model_path}")
    pipe = prepare_model(model_id=MODEL_ID, model_path=model_path, device=DEVICE, offline=True)
    print_elapsed_time_and_update("모델 로드 완료")

    return pipe


def unload_model(pipe):
    del pipe
    import gc
    gc.collect()
    print_elapsed_time_and_update("모델 언로드 완료")


def set_file_path(file_path):
    global DATA_PATH

    contents = read_file(file_path)
    write_text_to_file(DATA_PATH, contents)
    chunks, vectorizer, X = prepare_knowledge(DATA_PATH)

    return chunks, vectorizer, X

def one_time_rag(input_str, vectorizer, X, chunks, pipe, max_length=MAX_LENGTH, top_k=TOP_K) -> str:
    retrieved = retrieve(input_str, vectorizer, X, chunks, top_k)
    logger.debug("📄 검색된 컨텍스트:")
    prompt = build_prompt(input_str, retrieved)
    logger.debug(prompt)
    logger.debug("🤖 AI 응답 생성 중...")
    outputs = generate_answer(pipe, prompt, max_length=max_length)
    return outputs

def translate(input_str, pipe, max_length=MAX_LENGTH, top_k=TOP_K) -> str:
    prompt = build_prompt_for_translation(input_str)
    logger.debug(prompt)
    logger.debug("🤖 AI 응답 생성 중...")
    outputs = generate_answer(pipe, prompt, max_length=max_length)
    return outputs


def interactive_rag(
    data_path=DATA_PATH,
    model_id=MODEL_ID,
    model_path=MODEL_PATH,
    device=DEVICE,
    max_length=MAX_LENGTH,
    top_k=TOP_K
):
    pipe, chunks, vectorizer, X = load_model()
    logger.debug("RAG 대화를 시작합니다. 같은 폴더의 data.txt를 지식으로 사용합니다.")
    logger.debug("종료하려면 /exit 또는 /quit 을 입력하세요.\n")
    while True:
        input_str = input("Enter your question (or type 'exit' to quit): ").strip()
        if not input_str:
            continue
        if input_str.lower() == 'exit':
            break
        if "max_length" in input_str:
            max_length = int(input_str.split("max_length")[-1].strip())
            logger.debug(f"Using max_length: {max_length}")
            continue
        begin_time = time.time()
    logger.debug("🔍 지식 검색 중...")
    retrieved = retrieve(input_str, vectorizer, X, chunks, top_k)
    logger.debug("📄 검색된 컨텍스트:")
    prompt = build_prompt(input_str, retrieved)
    logger.debug(prompt)
    logger.debug("🤖 AI 응답 생성 중...")
    outputs = generate_answer(pipe, prompt, max_length=max_length)
    logger.debug(outputs)

if __name__ == "__main__":
    #interactive_rag()
    load_model()
