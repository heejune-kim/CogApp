
import huggingface_hub as hf_hub
import openvino_genai as ov_genai
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import torch, sys, os, textwrap, time
import time
import sys
import os

DATA_PATH = "data.txt"
CHUNK_SIZE = 900          # 문자 기준 조각 크기
CHUNK_OVERLAP = 150       # 겹침
TOP_K = 5                 # 상위 몇 개 조각을 넣을지


model_id = "OpenVINO/Mistral-7B-Instruct-v0.3-int4-ov"
model_path = "Mistral-7B-Instruct-v0.3-int4-ov"

device = "GPU"
max_length = 200

begin_time = 0

def print_elapsed_time_and_update(tag: str):
    global begin_time
    assert begin_time > 0, "begin_time이 초기화되지 않았습니다."

    print(f"Time for {tag}: {time.time() - begin_time:.2f} seconds")
    begin_time = time.time()

# ===== 유틸: 파일 로드 & 청크 =====
def read_text(path):
    if not os.path.exists(path):
        raise FileNotFoundError(f"지식 파일을 찾을 수 없습니다: {path}")
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()

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


def main():
    global begin_time
    global model_id, model_path, device, max_length, begin_time
    begin_time = time.time()

    hf_hub.snapshot_download(model_id, local_dir=model_path)

    pipe = ov_genai.LLMPipeline(model_path, device)

    print("RAG 대화를 시작합니다. 같은 폴더의 data.txt를 지식으로 사용합니다.")
    print("종료하려면 /exit 또는 /quit 을 입력하세요.\n")

    # 지식 로드 & 인덱스
    try:
        corpus = read_text(DATA_PATH)
    except Exception as e:
        print(f"지식 로드 오류: {e}", file=sys.stderr)
        sys.exit(1)

    chunks = chunk_text(corpus, CHUNK_SIZE, CHUNK_OVERLAP)
    if not chunks:
        print("data.txt가 비어 있거나 너무 짧습니다.", file=sys.stderr)
        exit(1)

    vectorizer, X = build_vector_store(chunks)


    while True:
        input_str = input("Enter your question (or type 'exit' to quit): ")
        input_str = input_str.strip()
        if not input_str or input_str == '':
            continue
        if input_str.lower() == 'exit':
            break

        if "max_length" in input_str:
            max_length = int(input_str.split("max_length")[-1].strip())
            print(f"Using max_length: {max_length}")
            continue

        begin_time = time.time()

        # 검색
        print("🔍 지식 검색 중...")
        retrieved = retrieve(input_str, vectorizer, X, chunks, TOP_K)

        # 프롬프트 구성
        print("📄 검색된 컨텍스트:")
        message = build_messages(input_str, retrieved)
        print(message)

        print("🤖 AI 응답 생성 중...")
        outputs = pipe.generate(message, max_length=max_length)
        print_elapsed_time_and_update("generation")
        print(outputs)

if __name__ == "__main__":
    main()
