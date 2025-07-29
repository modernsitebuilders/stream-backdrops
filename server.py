from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, static_folder='static')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

# Vercel requires this handler
def vercel_handler(request):
    with app.app_context():
        return app.full_dispatch_request(request)

# Required for both local and Vercel deployment
if __name__ == '__main__':
    app.run()
else:
    vercel = app  # Vercel looks for this variable
