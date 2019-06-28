function cloneExample() {
	let input = document.getElementById('form_sentence');
	let textContainter = document.querySelector('.example-link');

	let text = textContainter.innerText;

	input.value = text;
}

let resultContainer = document.querySelector('.cover-result');

function setResult(text, color) {
	resultContainer.innerText = text;
	resultContainer.style.color = color;
	resultContainer.style.borderColor = color;

	resultContainer.classList.add('enabled');
}

function clearResult() {
	resultContainer.classList.remove('enabled');
}

let colors = {
	green: 	'green',
	orange: 'orange',
	red: 	'red'
};

function httpGet(url, callback) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status < 300) {
                callback(null, xmlHttp.responseText);
            }
            else {
                callback(`Произошла ошибка ${xmlHttp.status}`);
            }
        }
    };
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}

function setAnalyzeResults(isPositive, probability) {
	let confident = probability > 0.65;

	let color = confident ? (isPositive ? colors.green : colors.red) : colors.orange;

	let text;
	if (confident) {
		text = isPositive ? 'Текст очень позитивный!' : 'Текст очень негативный';
	}
	else {
		text = isPositive ? 'Текст позитивный. Возможно' : 'Текст негативный. Возможно';	
	}

	setResult(text, color);
}

function startAnalyze() {
	clearResult();
	
	let input = document.getElementById('form_sentence');

	let text = input.value;
	if (!text) {
		setResult('Пожалуйста, введите текст!', colors.orange);
		return;
	}

	let uri = '/classify_text?text=' + encodeURIComponent(text);
	httpGet(uri, function (error, result) {
		if (error) {
			setResult('Произошла ошибка', colors.red);
			return;
		}

		let data = JSON.parse(result);
		if (!data || !data.success) {
			setResult('Сервер вернул ошибку', colors.red);
			return;
		}

		let isPositive = data.result.label == 1;
		let probability = data.result.probability;

		setAnalyzeResults(isPositive, probability);
	});
}

document.querySelector('.example-link').addEventListener('click', cloneExample);
document.getElementById('form_submit').addEventListener('click', startAnalyze);
document.getElementById('form_sentence').addEventListener('keypress', function (e) {
    if (!e) e = window.event;

    let keyCode = e.keyCode || e.which;
    if (keyCode == 13) {
        startAnalyze();
    }
});