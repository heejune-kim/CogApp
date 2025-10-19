
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
    write_text_to_file,
    get_logger,
)


DATA_PATH = "data.txt"

def set_data_path(path: str):
    global DATA_PATH
    DATA_PATH = os.path.join(path, "data.txt")

MODEL_ID = "OpenVINO/Mistral-7B-Instruct-v0.3-int4-ov"
MODEL_PATH = "Mistral-7B-Instruct-v0.3-int4-ov"
DEVICE = "GPU"

def set_model_info(model_id: str, model_path: str, device: str):
    global MODEL_ID, MODEL_PATH, DEVICE
    MODEL_ID = model_id
    MODEL_PATH = model_path
    DEVICE = device


def load_model(model_base_path: str = None):
    global MODEL_ID, MODEL_PATH, DEVICE

    logger = get_logger()
    model_path = os.path.join(model_base_path, MODEL_PATH)
    logger.info(f"model_path: {model_path}")
    pipe = prepare_model(model_id=MODEL_ID, model_path=model_path, device=DEVICE, offline=False)
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
    logger = get_logger()
    retrieved = retrieve(input_str, vectorizer, X, chunks, top_k)
    logger.debug("📄 검색된 컨텍스트:")
    prompt = build_prompt(input_str, retrieved)
    logger.debug(prompt)
    logger.debug("🤖 AI 응답 생성 중...")
    outputs = generate_answer(pipe, prompt, max_length=max_length)
    return outputs

def translate(input_str, pipe, max_length=MAX_LENGTH, top_k=TOP_K) -> str:
    logger = get_logger()
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
    logger = get_logger()
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
