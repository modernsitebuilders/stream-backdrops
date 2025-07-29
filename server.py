from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/static/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

@app.route('/backgrounds/<path:filename>')
def backgrounds(filename):
    return send_from_directory(os.path.join('static', 'backgrounds'), filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
