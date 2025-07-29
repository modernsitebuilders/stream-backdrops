from flask import Flask, render_template
import os

# Get absolute path to templates
template_dir = os.path.abspath('templates')
static_dir = os.path.abspath('static')

app = Flask(__name__, 
            template_folder=template_dir,
            static_folder=static_dir)

@app.route('/')
def home():
    print(f"Looking for template at: {os.path.join(template_dir, 'index.html')}")
    return render_template('index.html')

if __name__ == '__main__':
    print("Templates folder exists:", os.path.exists(template_dir))
    print("Static folder exists:", os.path.exists(static_dir))
    app.run(host='0.0.0.0', port=8000, debug=True)
