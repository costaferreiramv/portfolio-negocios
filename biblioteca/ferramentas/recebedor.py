#!/usr/bin/env python3
"""Servidor local: serve /bridge.html e recebe dumps via POST /<nome>."""
import http.server, socketserver, os, sys, re

DEST = sys.argv[1]
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8899
os.makedirs(DEST, exist_ok=True)

BRIDGE = b"""<!doctype html><meta charset="utf-8"><title>ponte</title>
<body style="font:14px system-ui;padding:2rem">
<h1 id="s">ponte pronta</h1>
<script>
window.addEventListener('message', async function(e){
  var d = e.data || {};
  if (!d || d.tipo !== 'dump') return;
  var h = {'Content-Type':'text/plain'};
  if (d.append) h['X-Append'] = '1';
  var r = await fetch('/' + d.nome, {method:'POST', headers:h, body: d.corpo});
  document.getElementById('s').textContent = 'recebido ' + d.nome + ' (' + d.corpo.length + ') status ' + r.status;
  if (e.source) e.source.postMessage({tipo:'ok', nome:d.nome, status:r.status}, '*');
});
if (window.opener) window.opener.postMessage({tipo:'pronto'}, '*');
</script>
"""


class H(http.server.BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")

    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()

    def do_GET(self):
        self.send_response(200); self._cors()
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(BRIDGE)))
        self.end_headers()
        self.wfile.write(BRIDGE)

    def do_POST(self):
        name = re.sub(r"[^A-Za-z0-9._-]", "", self.path.lstrip("/")) or "dump.json"
        n = int(self.headers.get("Content-Length", 0))
        data = self.rfile.read(n)
        mode = "ab" if self.headers.get("X-Append") == "1" else "wb"
        with open(os.path.join(DEST, name), mode) as f:
            f.write(data)
        self.send_response(200); self._cors()
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"ok")

    def log_message(self, *a):
        pass


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", PORT), H) as httpd:
    print(f"ouvindo em {PORT} -> {DEST}", flush=True)
    httpd.serve_forever()
