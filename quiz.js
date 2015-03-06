/**
 * quiz.js
 * Author: Oliver Farrell
 */

var Quiz = (function () {

  // settings
  var settings = {
    json: '/questions.json',
    numberOfQuestions: 10,
    questionsTemplate: '/question.html',
    resultsTemplate: '/results.html',
    container: 'quiz',
    questionIds: []
  }

  var questions, score;

  // template helper
  var _getFileContents = function(template, callback) {

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        callback(request.responseText);
      }
    }
    request.open('GET', template, true);
    request.send();

  };


  // parse the questions
  var _parseQuestions = function (file, callback) {

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 400) {
          callback(this.responseText);
        } else {
          console.log('Error parsing JSON file.');
        }
      }
    };
    request.open('GET', file, true);
    request.send();
    request = null;

  };


  // build quiz
  var _buildQuiz = function () {

    // grab the template file
    _getFileContents(settings.questionsTemplate, function (response) {
      document.getElementById(settings.container).innerHTML += response;

      // add click events to next and reset buttons
      var next = document.getElementById('next');
      next.addEventListener("click", function() {
        _getQuestion();
      });
    });

    // parse the questions
    _parseQuestions(settings.json, function (response) {
      questions = JSON.parse(response);

      for (var key in questions) {
        if (questions.hasOwnProperty(key)) {
          settings.questionIds.push(questions[key]._id);
        }
      }

      console.log('Questions: ' + settings.questionIds);

      _getQuestion();
    });

    score = 0;

  };


  // get question
  var _getQuestion = function () {

    // grab a question
    var question = questions[Math.floor(Math.random() * settings.questionIds.length)];

    // remove the current question from the questions array
    var i = settings.questionIds.indexOf(question._id);
    settings.questionIds.splice(i, 1);

    console.log('Remaining questions: ' + settings.questionIds);

    // build up the question
    var quiz = document.getElementById('quiz'),
        list = document.getElementById('answers'),
        title = quiz.getElementsByTagName('h2'),
        answers = question['answers'];

    list.innerHTML = "";

    // add the answers
    for(var i = 0; i < title.length; i++) {
      title[i].innerHTML = question.question;
    }

    for(var i = 0; i < answers.length; i++) {
      var el = document.createElement('li'),
          text = document.createTextNode(answers[i].answer);

      el.appendChild(text);
      list.appendChild(el);

      el.onclick = _chooseAnswer;
    }
    
  };


  var _chooseAnswer = function () {
    var answers = document.querySelectorAll('#answers li');
    for(var i = 0; i < answers.length; i++) {
      answers[i].dataset.state = '';
    }

    this.dataset.state = 'active';
  };


  // increment score
  var _incrementScore = function () {
    score++;
    console.log('Score: ' + score);
  };


  // kick it all off
  var init = function() {
    _buildQuiz();
    _getQuestion();
  }

  return {
    init: init
  };

})();
