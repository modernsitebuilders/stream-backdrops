from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

# Required for Vercel
@app.route('/')
def home():
    try:
        return render_template('index.html')
    except Exception as e:
        return f"Error loading template: {str(e)}", 500

@app.route('/static/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

# Vercel requires this handler
def vercel_handler(request):
    with app.app_context():
        return app.full_dispatch_request(request)

# Required for Vercel serverless
if __name__ == '__main__':
    app.run()
else:
    # This makes it work in Vercel's environment
    vercel = app
