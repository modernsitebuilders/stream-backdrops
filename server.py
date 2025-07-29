from flask import Flask, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Serve index.html
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

# Serve background images
@app.route('/backgrounds/<path:filename>')
def serve_bg(filename):
    return send_from_directory('backgrounds', filename)

# Add CORS headers
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

if __name__ == '__main__':
    app.run(debug=True, port=8000)  # Debug mode + port