from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/')
def home():
    print("Trying to load:", os.path.abspath('templates/index.html'))
    return render_template('index.html')

if __name__ == '__main__':
    print("Current working directory:", os.getcwd())
    print("Templates path:", os.path.abspath('templates'))
    app.run(host='0.0.0.0', port=8000, debug=True)
