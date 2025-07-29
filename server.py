from flask import Flask, render_template, send_from_directory
import os

# Initialize Flask with explicit paths
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__,
            template_folder=os.path.join(PROJECT_ROOT, 'templates'),
            static_folder=os.path.join(PROJECT_ROOT, 'static'))

# Main route
@app.route('/')
def home():
    return render_template('index.html')

# Static files route
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

# Debug route (NEW)
@app.route('/debug')
def debug():
    return {
        "project_root": PROJECT_ROOT,
        "templates": os.listdir(app.template_folder),
        "static_files": {
            "css": os.listdir(os.path.join(app.static_folder, 'css')),
            "backgrounds": os.listdir(os.path.join(app.static_folder, 'backgrounds'))
        }
    }

# Test route (NEW)
@app.route('/simple-test')
def simple_test():
    return "Hello! This basic route works!"

if __name__ == '__main__':
    print(f"PROJECT ROOT: {PROJECT_ROOT}")
    print(f"Templates exist: {os.path.exists(os.path.join(app.template_folder, 'index.html'))}")
    print(f"Static folder exists: {os.path.exists(app.static_folder)}")
    app.run(host='0.0.0.0', port=8000, debug=True)
