from flask import Flask,render_template
import os
app = Flask(__name__, static_folder=os.getcwd() + '/dist/ai-backgrounds/', static_url_path='')


@app.route('/', methods=['GET'])
def root():
    return render_template('index.html')


if __name__=="__main__":
    app.run()
