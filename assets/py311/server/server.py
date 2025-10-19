
##import early_init
from contextlib import asynccontextmanager
import logging
import os
import signal, sys
from fastapi import FastAPI, Request
import configparser
import uvicorn
import asyncio
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from rag import (
    load_model,
    set_file_path,
    one_time_rag,
    translate,
    set_data_path,
    set_model_info,
)
from rag_utils import (
    get_logger,
    enable_file_logging,
)
from rag_core import (
    set_prompts,
    set_rag_params,
    set_prompt_path,
    read_rag_prompt_from_file,
    read_translation_prompt_from_file,
)


RAG_PATH = None
CHUNKS, VECTORIZER, X, PIPE = (None, None, None, None)
CHUNKS_MANUAL, VECTORIZER_MANUAL, X_MANUAL = (None, None, None)
PORT = 8000

INSTALLED_PATH = None

def initialize():
    global INSTALLED_PATH

    if "python.exe" in sys.executable.lower() or "pythonw.exe" in sys.executable.lower():
        # Python 인터프리터로 실행되는 경우: assets/py311/server/server.py -> assets
        # __file__: C:\...\assets\py311\server\server.py
        # dirname: C:\...\assets\py311\server
        # dirname: C:\...\assets\py311
        # dirname: C:\...\assets
        INSTALLED_PATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    else:
        # PyInstaller 실행 파일인 경우
        INSTALLED_PATH = os.path.dirname(os.path.dirname(os.path.abspath(sys.executable)))

    # 개발 환경인 경우 assets 경로 추가
    if "mywork" in INSTALLED_PATH and not INSTALLED_PATH.endswith("assets"):
        INSTALLED_PATH = os.path.join(INSTALLED_PATH, "assets")


class RagPathIn(BaseModel):
    rag_path: str


class ChatMessage(BaseModel):
    question: str
    answer: str = None


def handle_signal(signum, frame):
    logger = get_logger()
    logger.debug("Received signal: %s", signum)
    sys.exit(0)

signal.signal(signal.SIGTERM, handle_signal)
signal.signal(signal.SIGINT, handle_signal)

#@app.on_event("startup")
def startup_event():
    global CHUNKS_MANUAL, VECTORIZER_MANUAL, X_MANUAL, PIPE
    global INSTALLED_PATH
 
    initialize()
    logger = get_logger()

    # Perform any startup tasks here
    try:
        # load cache_dir information from configuration file.
        with open(os.path.join(INSTALLED_PATH, "config.ini"), "r", encoding="utf-8") as f:
            config = configparser.ConfigParser()
            config.read_file(f)
            model_base = config.get("DEFAULT", "model_base", fallback=None)
            manual_path = config.get("DEFAULT", "manual_path", fallback=None)
            manual_path = os.path.join(INSTALLED_PATH, manual_path)

            run_mode = config.get("SERVER", "run_mode", fallback="RELEASE")
            if run_mode.upper() == "DEBUG":
                enable_file_logging(log_file_path=os.path.join(model_base, "logs/cogapp.log"), log_level=logging.DEBUG)
            set_data_path(model_base)

            logger.debug(f"model_path from config.ini: {model_base}")
            logger.debug(f"manual_path from config.ini: {manual_path}")
            model_id, model_path, device = (
                config.get("MODEL", "model_id", fallback="OpenVINO/Mistral-7B-Instruct-v0.3-int4-ov"),
                config.get("MODEL", "model_path", fallback="Mistral-7B-Instruct-v0.3-int4-ov"),
                config.get("MODEL", "device", fallback="GPU")
            )
            logger.debug(f"model_id from config.ini: {model_id}")
            logger.debug(f"model_path from config.ini: {model_path}")
            logger.debug(f"device from config.ini: {device}")

            set_model_info(
                model_id=model_id,
                model_path=model_path,
                device=device
            )
            chunk_size = config.getint("RAG", "chunk_size", fallback=900)
            chunk_overlap = config.getint("RAG", "chunk_overlap", fallback=150)
            max_length = config.getint("RAG", "max_length", fallback=200)
            top_k = config.getint("RAG", "top_k", fallback=5)

            logger.debug(f"RAG parameters from config.ini: chunk_size={chunk_size}, chunk_overlap={chunk_overlap}, max_length={max_length}, top_k={top_k}")

            set_rag_params(chunk_size, chunk_overlap, top_k, max_length)

            ## Load prompts from files if prompt files exist
            rag_prompt_path = config.get("RAG", "rag_prompt_path", fallback=None)
            translation_prompt_path = config.get("RAG", "translation_prompt_path", fallback=None)
            logger.debug(f"RAG prompt path from config.ini: {rag_prompt_path}")
            logger.debug(f"Translation prompt path from config.ini: {translation_prompt_path}")
            if rag_prompt_path:
                rag_prompt_path = rag_prompt_path.replace("/", os.sep).replace("\\", os.sep)
                #logger.debug(f"Processed RAG prompt path: {rag_prompt_path}")
                rag_prompt_full_path = os.path.join(model_base, rag_prompt_path)
                set_prompt_path(rag_prompt_path=rag_prompt_full_path)
                read_rag_prompt_from_file()
            if translation_prompt_path:
                translation_prompt_path = translation_prompt_path.replace("/", os.sep).replace("\\", os.sep)
                #logger.debug(f"Processed Translation prompt path: {translation_prompt_path}")
                translation_prompt_full_path = os.path.join(model_base, translation_prompt_path)
                set_prompt_path(translation_prompt_path=translation_prompt_full_path)
                read_translation_prompt_from_file()

    except Exception as e:
        logger.error(f"Error reading config.ini: {e}")
        model_path = None
        sys.exit()
    PIPE = load_model(model_base_path=model_base)
    CHUNKS_MANUAL, VECTORIZER_MANUAL, X_MANUAL = set_file_path(manual_path)

    logger.info("Startup complete.")


#@app.on_event("shutdown")
def shutdown_event():
    logger = get_logger()
    logger.info("Shutting down...")
    # Perform any cleanup tasks here
    logger.info("Shutdown complete.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    startup_event()
    yield
    shutdown_event()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_root(request: Request):
    logger = get_logger()
    logger.debug(f"GET / from {request.client.host}")
    return {"Hello": "World"}


@app.get("/status/")
async def read_status(request: Request):
    logger = get_logger()
    logger.debug(f"GET /status/ from {request.client.host}")
    return {"status": "OK"}


@app.put("/set-rag-path/")
async def set_rag_path(payload: RagPathIn, request: Request):
    global CHUNKS, VECTORIZER, X
    global RAG_PATH

    logger = get_logger()
    logger.debug(f"PUT /set-rag-path/ from {request.client.host} with {payload}")
    RAG_PATH = payload.rag_path
    CHUNKS, VECTORIZER, X = set_file_path(RAG_PATH)
    logger.info(f"RAG_PATH set to: {RAG_PATH}")
    return {"status": f"RAG_PATH set to {RAG_PATH}"}

@app.get("/get-rag-path/")
async def get_rag_path(request: Request):
    global RAG_PATH
    logger = get_logger()
    logger.debug(f"GET /get-rag-path/ from {request.client.host}")
    return {"RAG_PATH": RAG_PATH}

async def _long_job(name: str):
    print(f"Starting long job for {name}")
    await asyncio.sleep(10)
    print(f"Shutdown complete.{name}")

@app.get("/long-job/{name}")
async def long_job(name: str, request: Request):
    logger = get_logger()
    logger.debug(f"GET /long-job/{name} from {request.client.host}")
    asyncio.create_task(_long_job(name))
    return {"status": "Job started"}

@app.post("/chat-msg/")
async def chat_msg(message: ChatMessage, request: Request):
    global CHUNKS, VECTORIZER, X, PIPE
    logger = get_logger()
    logger.debug(f"POST /chat-msg/ from {request.client.host} with question: {message.question}")
    message.answer = one_time_rag(input_str=message.question, vectorizer=VECTORIZER, X=X, chunks=CHUNKS, pipe=PIPE)
    #message.answer = ttt
    return {"status": f"{message.answer}"}

@app.post("/chat-msg-manual/")
async def chat_msg_manual(message: ChatMessage, request: Request):
    global CHUNKS_MANUAL, VECTORIZER_MANUAL, X_MANUAL, PIPE
    logger = get_logger()
    logger.debug(f"POST /chat-msg-manual/ from {request.client.host} with question: {message.question}")
    message.answer = one_time_rag(input_str=message.question, vectorizer=VECTORIZER_MANUAL, X=X_MANUAL, chunks=CHUNKS_MANUAL, pipe=PIPE)
    return {"status": f"{message.answer}"}

@app.post("/chat-msg-translate/")
async def chat_msg_translate(message: ChatMessage, request: Request):
    global PIPE
    logger = get_logger()
    logger.debug(f"POST /chat-msg-translate/ from {request.client.host} with question: {message.question}")
    message.answer = translate(input_str=message.question, pipe=PIPE)
    return {"status": f"{message.answer}"}


"""
class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"Hello from Python!")
"""


if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=PORT)

    """
    server = HTTPServer(('localhost', 5000), SimpleHandler)
    print("Python server running on http://localhost:5000")
    server.serve_forever()
    """
