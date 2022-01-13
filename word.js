const NUM_ROWS = 5;
const NUM_LETTERS = 5;
const ROW_CLASS = 'wordrow';
const LETTER_CLASS = 'letter';
const GREEN_LETTER = 'correctPosLetter';
const YELLOW_LETTER = 'wrongPosCorrectLetter';
const GREY_LETTER = 'incorrectLetter';

const alphaRegex = new RegExp('^[a-z]$');

let rows = [];
var currentRowIdx;
var currentLetterIdx;

var finalWord = '';
var finalWordLetterCounts = {};

let gameEnd = false;

window.onload = init;
function init() {
	for (var i = 0; i < NUM_ROWS; i++) {
		var cols = [];
		var row = document.createElement("div");
		row.classList.add(ROW_CLASS);

		for (var j = 0; j < NUM_LETTERS; j++) {
			var letter = document.createElement("div");
			letter.classList.add(LETTER_CLASS);
			row.appendChild(letter)
			cols.push(letter);
		}

		rows.push(cols)
		document.getElementById('wordtable').appendChild(row);
	}

	currentRowIdx = 0;
	currentLetterIdx = 0;
	finalWord = Word_List.getRandomWord(5);
	for (var i = 0; i < NUM_LETTERS; i++) {
		let letter = finalWord[i];
		if(Object.keys(finalWordLetterCounts).includes(letter)) {
			finalWordLetterCounts[letter] += 1;
		}	
		else {
			finalWordLetterCounts[letter] = 1;
		}
	}
}

function cursorAt() {
	return rows[currentRowIdx][currentLetterIdx];
}

function advanceLetter() {
	if (currentLetterIdx != NUM_LETTERS - 1) 
		currentLetterIdx += 1; 
}

function eraseLetter() {
	if (currentLetterIdx != 0 && (currentLetterIdx != NUM_LETTERS - 1 || cursorAt().textContent == ''))
		currentLetterIdx -= 1; 
	cursorAt().textContent = '';
}

function advanceRow() {
	if (currentRowIdx != NUM_ROWS - 1) {
		currentRowIdx += 1;
		currentLetterIdx = 0;
	}
}

function getCurrentWord() {
	var guessWord = '';
	for (var i = 0; i < NUM_LETTERS; i++) {
		letterElement = rows[currentRowIdx][i];
		let letter = letterElement.textContent;
		guessWord += letter;
	}
	return guessWord;
}

// side effects of adding colors to previous word
function isWordCorrect() {
	var guessWord = '';
	var guessedLetters = {};
	for (var i = 0; i < NUM_LETTERS; i++) {
		letterElement = rows[currentRowIdx][i];
		let letter = letterElement.textContent;
		guessWord += letter;
		if (finalWord.charAt(i) == letter) {
			letterElement.classList.add(GREEN_LETTER);
			if (Object.keys(guessedLetters).includes(letter)) {
				if (guessedLetters[letter].classList.contains(YELLOW_LETTER)) {
					guessedLetters[letter].classList.remove(YELLOW_LETTER);
					guessedLetters[letter].classList.add(GREY_LETTER);
				}	
			}
			guessedLetters[letter] = letterElement;
		}
		else if (finalWord.includes(letter) && !Object.keys(guessedLetters).includes(letter)) {
			letterElement.classList.add(YELLOW_LETTER);
			guessedLetters[letter] = letterElement;
		}
		else {
			letterElement.classList.add(GREY_LETTER);
			if (!Object.keys(guessedLetters).includes(letter)) {
				guessedLetters[letter] = letterElement;
			}	
		}
	}

	Object.keys(finalWordLetterCounts).forEach(key => {
	if (finalWordLetterCounts[key] > 1 && Object.keys(guessedLetters).includes(key)) {
			element = guessedLetters[key];
			exponent = document.createElement('div');
			exponent.textContent = finalWordLetterCounts[key];
			element.appendChild(exponent);
		}
	});

	return guessWord == finalWord
}

document.addEventListener('keydown', function(event) {
	if (gameEnd) return;
	let key = event.key;
	key = key.toLowerCase();
	if (key == "backspace") {
		eraseLetter();
	}
	if (key == "enter") {
		if (currentLetterIdx == NUM_LETTERS - 1 && cursorAt().textContent != '') {
			if (!Word_List.isInList(getCurrentWord())) {
				alert('not a word');
				return;
			}
			if (isWordCorrect()) {
				gameEnd = true;
				alert('correct!');
			}
			else if (currentRowIdx == NUM_ROWS - 1) {
				gameEnd = true;
				alert('game over');
			}
			else {
				advanceRow();
			}	
		}
	}
	if (alphaRegex.test(key)) {
		cursorAt().textContent = key;
		advanceLetter();
	}
});


