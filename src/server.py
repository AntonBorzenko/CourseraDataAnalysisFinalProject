from flask import Flask, request, jsonify, send_from_directory
from sentiment_classifier import SentimentClassifier

app = Flask(__name__)
clf = SentimentClassifier()

@app.route('/')
def index_page():
	return app.send_static_file('index.html')


@app.route('/static/<path:path>')
def send_static_file(path):
	return send_from_directory('static', path)


@app.route('/classify_text')
def classify_text():
	text = request.args.get('text')
	if text is None:
		return jsonify({ 'success' : False })

	label, prob = clf.predict_text(text)

	return jsonify({
		'success' : True,
		'result'  : {
			'label' : label,
			'probability' : prob
		}
	})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=False)