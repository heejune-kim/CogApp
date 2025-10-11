from http.server import BaseHTTPRequestHandler, HTTPServer
import signal, sys
from fastapi import FastAPI, Request
import configparser
import uvicorn
import asyncio
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import logging
from rag import (
    load_model,
    set_file_path,
    one_time_rag,
)


CHUNKS, VECTORIZER, X, PIPE = (None, None, None, None)
CHUNKS_MANUAL, VECTORIZER_MANUAL, X_MANUAL = (None, None, None)

# Logger setup
logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.DEBUG)

app = FastAPI()

RAG_PATH = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root(request: Request):
    logger.debug(f"GET / from {request.client.host}")
    return {"Hello": "World"}

@app.get("/status/")
async def read_status(request: Request):
    logger.debug(f"GET /status/ from {request.client.host}")
    return {"status": "OK"}

def handle_signal(signum, frame):
    logger.debug("Received signal: %s", signum)
    sys.exit(0)

signal.signal(signal.SIGTERM, handle_signal)
signal.signal(signal.SIGINT, handle_signal)

@app.on_event("startup")
async def startup_event():
    global CHUNKS_MANUAL, VECTORIZER_MANUAL, X_MANUAL, PIPE
 
    print("Starting up...")
    # Perform any startup tasks here
    try:
        # load cache_dir information from configuration file.
        with open("config.ini", "r", encoding="utf-8") as f:
            config = configparser.ConfigParser()
            config.read_file(f)
            model_path = config.get("DEFAULT", "model_base", fallback=None)
            manual_path = config.get("DEFAULT", "manual_path", fallback=None)
            print(f"model_path from config.ini: {model_path}")
            print(f"manual_path from config.ini: {manual_path}")
    except Exception as e:
        logger.error(f"Error reading config.ini: {e}")
        model_path = None
        exit()
    PIPE = load_model(model_path=model_path)
    CHUNKS_MANUAL, VECTORIZER_MANUAL, X_MANUAL = set_file_path(manual_path)

    print("Startup complete.")

@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down...")
    # Perform any cleanup tasks here
    await asyncio.sleep(1)
    print("Shutdown complete.")

class RagPathIn(BaseModel):
    rag_path: str

class ChatMessage(BaseModel):
    question: str
    answer: str = None

@app.put("/set-rag-path/")
async def set_rag_path(payload: RagPathIn, request: Request):
    global CHUNKS, VECTORIZER, X
    global RAG_PATH

    logger.debug(f"PUT /set-rag-path/ from {request.client.host} with {payload}")
    RAG_PATH = payload.rag_path
    CHUNKS, VECTORIZER, X = set_file_path(RAG_PATH)
    print(f"RAG_PATH set to: {RAG_PATH}")
    return {"status": f"RAG_PATH set to {RAG_PATH}"}

@app.get("/get-rag-path/")
async def get_rag_path(request: Request):
    global RAG_PATH
    logger.debug(f"GET /get-rag-path/ from {request.client.host}")
    return {"RAG_PATH": RAG_PATH}

async def _long_job(name: str):
    print(f"Starting long job for {name}")
    await asyncio.sleep(10)
    print(f"Shutdown complete.{name}")

@app.get("/long-job/{name}")
async def long_job(name: str, request: Request):
    logger.debug(f"GET /long-job/{name} from {request.client.host}")
    asyncio.create_task(_long_job(name))
    return {"status": "Job started"}

ttt= """
Ways to find local events
Check local government websites: Municipal and provincial government websites for Gyeonggi-do and Seongnam-si often post a calendar of community and cultural events, many of which are free. The best source is likely the official Seongnam-si website.
Search Facebook groups: Facebook groups for Korea and for specific cities often have posts about local events shared by residents. A search for "Korea events" yielded a public group where people post about upcoming events.
Use local apps or websites: Apps like AllEvents and Meetup can be used to search for events by location. While they may not have information on every local community event, they can highlight activities posted by local groups, including free ones.
Visit local community centers and parks: Many community centers and libraries offer free classes, workshops, or exhibitions. Local parks may also host free public events, especially in the fall.
Look at university campuses: Universities in and around Seongnam often have free public events like lectures, concerts, or exhibitions, especially if they have an arts program.\n""" * 10

@app.post("/chat-msg/")
async def chat_msg(message: ChatMessage, request: Request):
    global CHUNKS, VECTORIZER, X, PIPE
    logger.debug(f"POST /chat-msg/ from {request.client.host} with question: {message.question}")
    message.answer = one_time_rag(input_str=message.question, vectorizer=VECTORIZER, X=X, chunks=CHUNKS, pipe=PIPE)
    #message.answer = ttt
    return {"status": f"{message.answer}"}

@app.post("/chat-msg-manual/")
async def chat_msg_manual(message: ChatMessage, request: Request):
    global CHUNKS_MANUAL, VECTORIZER_MANUAL, X_MANUAL, PIPE
    logger.debug(f"POST /chat-msg-manual/ from {request.client.host} with question: {message.question}")
    #message.answer = one_time_rag(input_str=message.question, vectorizer=VECTORIZER_MANUAL, X=X_MANUAL, chunks=CHUNKS_MANUAL, pipe=PIPE)
    message.answer = ttt
    return {"status": f"{message.answer}"}

"""
class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"Hello from Python!")
"""

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)

    """
    server = HTTPServer(('localhost', 5000), SimpleHandler)
    print("Python server running on http://localhost:5000")
    server.serve_forever()
    """
