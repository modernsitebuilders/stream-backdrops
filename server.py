from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

# Debug endpoints
@app.route('/health')
def health():
    return "OK", 200

@app.route('/debug')
def debug():
    return {
        "python_version": os.sys.version,
        "files": {
            "root": os.listdir('.'),
            "templates": os.listdir('templates'),
            "static": os.listdir('static')
        }
    }

# Main app routes
@app.route('/')
def home():
    try:
        return render_template('index.html')
    except Exception as e:
        return f"Template error: {str(e)}", 500

@app.route('/static/<path:path>')
def static_files(path):
    try:
        return send_from_directory('static', path)
    except Exception as e:
        return f"Static error: {str(e)}", 404

# Vercel handler
def vercel_handler(request):
    with app.app_context():
        try:
            return app.full_dispatch_request(request)
        except Exception as e:
            return f"Handler error: {str(e)}", 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
else:
    vercel = app
