from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, 
            template_folder='templates',
            static_folder='static')

@app.route('/')
def home():
    return render_template('index.html')  # Looks in templates/ folder

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    print("Template folder:", app.template_folder)
    print("Static folder:", app.static_folder)
    app.run(host='0.0.0.0', port=8000, debug=True)
