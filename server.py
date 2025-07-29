@app.route('/debug')
def debug():
    import os
    debug_info = {
        "Project Root": PROJECT_ROOT,
        "Templates": os.listdir(app.template_folder),
        "Static Files": {
            "css": os.listdir(os.path.join(app.static_folder, 'css')),
            "backgrounds": os.listdir(os.path.join(app.static_folder, 'backgrounds'))
        }
    }
    return debug_info  # Returns as JSON
