
# 예시: 간단한 HTTP 서버
from http.server import BaseHTTPRequestHandler, HTTPServer

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"Hello from Python!")

if __name__ == '__main__':
    server = HTTPServer(('localhost', 5000), SimpleHandler)
    print("Python server running on http://localhost:5000")
    server.serve_forever()
