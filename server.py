from flask import Flask, render_template, send_from_directory
import os

# Absolute path solution
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__,
            template_folder=os.path.join(PROJECT_ROOT, 'templates'),
            static_folder=os.path.join(PROJECT_ROOT, 'static'))

@app.route('/')
def home():
    print("Looking for index.html at:", os.path.join(app.template_folder, 'index.html'))
    return render_template('index.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == '__main__':
    print("PROJECT ROOT:", PROJECT_ROOT)
    print("Templates exist:", os.path.exists(os.path.join(app.template_folder, 'index.html')))
    print("Static folder exists:", os.path.exists(app.static_folder))
    app.run(host='0.0.0.0', port=8000, debug=True)
