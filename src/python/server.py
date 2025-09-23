from http.server import BaseHTTPRequestHandler, HTTPServer
import signal, sys
from fastapi import FastAPI
import uvicorn
import asyncio
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

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
async def read_root():
    return {"Hello": "World"}

@app.get("/status/")
async def read_status():
    return {"status": "OK"}

def handle_signal(signum, frame):
    print("Received signal:", signum)
    print(f"Received signal: {signum}")
    print(f"Exiting...{frame}")
    sys.exit(0)

signal.signal(signal.SIGTERM, handle_signal)
signal.signal(signal.SIGINT, handle_signal)

@app.on_event("startup")
async def startup_event():
    print("Starting up...")
    # Perform any startup tasks here
    await asyncio.sleep(1)
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
async def set_rag_path(payload: RagPathIn):
    global RAG_PATH
    RAG_PATH = payload.rag_path
    print(f"RAG_PATH set to: {RAG_PATH}")
    return {"status": f"RAG_PATH set to {RAG_PATH}"}

@app.get("/get-rag-path/")
async def get_rag_path():
    return {"RAG_PATH": RAG_PATH}

async def _long_job(name: str):
    print(f"Starting long job for {name}")
    await asyncio.sleep(10)
    print(f"Shutdown complete.{name}")

@app.get("/long-job/{name}")
async def long_job(name: str):
    asyncio.create_task(_long_job(name))
    return {"status": "Job started"}

@app.post("/chat-msg/")
async def chat_msg(message: ChatMessage):
    print(f"Received chat message: {message.question}")
    message.answer = f"Message received: [{message.question}]"
    return {"status": f"Message received: [{message.question}]"}

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
