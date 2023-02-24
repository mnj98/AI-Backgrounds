from flask import Flask,render_template
import os
print(os.system("pwd"))
app = Flask(__name__, static_folder=os.getcwd() + '/dist/ai-backgrounds/', static_url_path='')
print(app.static_folder)

@app.route('/', methods=['GET'])
def root():
    return render_template('index.html')


if __name__=="__main__":
    print(os.system("ls ./dist/ai-backgrounds"))
    app.run()
