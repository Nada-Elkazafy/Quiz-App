// بنجيب العناصر من الصفحة (DOM Elements)
let countSpan = document.querySelector(".count span"); 
let bulletsSpanContier = document.querySelector(".bullets .spans"); 
let quizArea = document.querySelector(".quiz-area"); 
let answerArea = document.querySelector(".answer-area"); 
let submitButton = document.querySelector(".submit"); 
let bullets = document.querySelector(".bullets"); 
let resultContainer = document.querySelector(".results"); 
let countdownSpan = document.querySelector(".countdown"); 


let currentIndex = 0; 
let RightAnswer = 0; 
let countdownInterval; 


// الفانكشن اللي بتجيب الأسئلة من ملف json
function getQuestions() {
  let myRequest = new XMLHttpRequest(); // بنعمل request
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse(this.responseText); // بنحول الداتا من JSON ل object
      let questionCount = questionObject.length; // عدد الأسئلة اللي جت
    
      // بنرسم الدواير اللي فوق على حسب عدد الأسئلة
      creatBullets(questionCount);

      // بنعرض أول سؤال
      addQuestionData(questionObject[currentIndex], questionCount);
      quizArea.style.animation = "fadeIn 0.5s ease-in-out";
      answerArea.style.animation = "fadeIn 0.5s ease-in-out";

      // بنبدأ العداد التنازلي
      countdown(5, questionCount);

      // أول ما يدوس على Submit
      submitButton.onclick = () => {
        // بنجيب الإجابة الصح
        let theRightAnswer = questionObject[currentIndex].right_answer;

        // بنزوّد رقم السؤال
        currentIndex++;

        // بنشوف المستخدم اختار صح ولا لأ
        checkAnswer(theRightAnswer, questionCount);

        // بنفضي السؤال والإجابات عشان نحط سؤال جديد
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";

        // بنعرض السؤال اللي بعده
        addQuestionData(questionObject[currentIndex], questionCount);
        quizArea.style.animation = "fadeIn 0.5s ease-in-out";
        answerArea.style.animation = "fadeIn 0.5s ease-in-out";

        // بنغيّر شكل الدواير لما نعدي على كل سؤال
        handleBullets();

        // بنوقف العد القديم ونبدأ واحد جديد
        clearInterval(countdownInterval);
        countdown(5, questionCount);

        // بنعرض النتيجة لو خلصنا كل الأسئلة
        showResults(questionCount);
      };
    }
  };

  myRequest.open("GET", "html_questions.json", true); // بنفتح الاتصال بالملف
  myRequest.send(); // بنبعت الريكوست
}
document.getElementById("start-btn").onclick = function () {
  getQuestions(); // يبدأ الكويز لما ندوس Start
};




// دي الفانكشن اللي بتعمل الدواير على حسب عدد الأسئلة
function creatBullets(num) {
  countSpan.innerHTML = num; // بنحط العدد
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span"); // بنعمل سبان لكل دايرة
    if (i === 0) {
      theBullet.className = "on"; // أول دايرة بتكون مفعّلة
    }
    bulletsSpanContier.appendChild(theBullet);
  }
}

// دي الفانكشن اللي بتحط السؤال والإجابات في الـ DOM
function addQuestionData(Obj, count) {
  if (currentIndex < count) {
    // بنعمل عنوان السؤال
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(Obj.title);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);

    // بنعمل 4 اختيارات
    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      // input radio
      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = Obj[`answer_${i}`]; 
      if (i === 1) {
        radioInput.checked = true; // أول واحدة بتكون selected
      }

      // label
      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let theLabelText = document.createTextNode(Obj[`answer_${i}`]);
      theLabel.appendChild(theLabelText);

      // بنركب ال input وال label جوه الديف
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // وبعدين نضيفه للصفحة
      answerArea.appendChild(mainDiv);
    }
  }
}


    // بنشوف المستخدم اختار إجابة صح ولا غلط
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let thechoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      thechoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === thechoosenAnswer) {
    RightAnswer++;
    console.log("Good Answer");
  }
}

// دي بتغيّر شكل الدايرة اللي احنا واقفين عليها
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

// دي بتعرض النتيجة في الآخر
function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answerArea.remove();
    submitButton.remove();
    bullets.remove();

    if (RightAnswer > count / 2 && RightAnswer < count) {
      theResults = `<span class ="Good">Good</span>, ${RightAnswer} From ${count}`;
    } else if (RightAnswer === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answer Is Good`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${RightAnswer} From ${count}.`;
    }

    // بنعرض النتيجة بتنسيق حلو
    resultContainer.innerHTML = theResults;
    resultContainer.style.padding = "10px";
    resultContainer.style.backgroundColor = "#fff";
    resultContainer.style.marginTop = "20px";
    resultContainer.style.borderRadius = "8px";
    resultContainer.style.boxShadow = "0 0 10px rgba(0,0,0,0.05)";
  }
}

// دي مسؤولة عن العداد التنازلي
function countdown(duration, count) {
  if (currentIndex < count) {
    let mintes, seconds;
    countdownInterval = setInterval(function () {
      mintes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      // تنسيق الأرقام
      mintes = mintes < 10 ? `0${mintes}` : mintes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      // بنعرض العداد
      countdownSpan.innerHTML = `${mintes}:${seconds}`;

      // لو الوقت خلص نعمل submit تلقائي
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
document.getElementById("start-btn").onclick = function () {
  document.querySelector(".start-container").style.display = "none";
  document.querySelector(".quiz-app").style.display = "block";
  getQuestions(); // يبدأ الكويز
};



