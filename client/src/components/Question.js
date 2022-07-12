import { useState, useEffect } from "react";

import Loading from "./Loading";
import Modal from "./Modal";
import ModalBG from "./ModalBG";
import QuestionItem from "./QuestionItem";

//Main component that contains all the questions and functionality
function Question() {
    const [words, setWords] = useState([]);
    //modal text to show when user click check answers
    const [modalTxt, setModalTxt] = useState("Please finish all questions");

    //empty array with the number of questions (10) that indicates the answered questions and if they are answered correctly or not
    var answeredQuestions = new Array(10).fill(null);
    //number of correct answers
    var correctAnswers = 0;
    //number of finished quesetions
    var finishedQuestions = 0;
    //pointer for the currrent question
    var currentQuestion = 0;

    function refreshProgress() {
        //refresh the progress bar value
        finishedQuestions = 0; //reset finished question
        for (const i in answeredQuestions) { //counting finished questions
            if (answeredQuestions[i] !== null) {
                finishedQuestions++;
            }
        }
        document.getElementById('userProgress').value = finishedQuestions;
    }

    //starting function to hide initial splash screen and showing the first question and nnavigation buttons and progress
    function startQuestions() {
        document.getElementById('questionsSplashScreen').style.display = "none";
        document.getElementById('question' + currentQuestion).style.display = "flex";
        document.getElementById('nextBtn').style.display = "initial";
        document.getElementById('userProgress').style.display = "initial";
    }


    function prevQuestion() { //previous button click handler
        // hide current question and show previous one
        document.getElementById('question' + currentQuestion).style.display = "none";
        currentQuestion--;
        if (currentQuestion !== 9) { // if this is not the last question show next button that was hidden and hide check answers button
            document.getElementById('nextBtn').style.display = "block";
            document.getElementById('checkBtn').style.display = "none";
        }
        if (currentQuestion === 0) //if this is the first question hide the previous button 
            document.getElementById('prevBtn').style.display = "none";
        document.getElementById('question' + currentQuestion).style.display = "block";

        refreshProgress();
    }

    function nextQuestion() { // next button click handler
        //hide current question and show the next one
        document.getElementById('question' + currentQuestion).style.display = "none";
        currentQuestion++;
        if (currentQuestion !== 0) //if this is not the first question show the previous button that was hidden
            document.getElementById('prevBtn').style.display = "block";
        if (currentQuestion === 9) { // if this the last question hide next button and show check answers button
            document.getElementById('checkBtn').style.display = "block";
            document.getElementById('nextBtn').style.display = "none";
        }
        document.getElementById('question' + currentQuestion).style.display = "flex";

        refreshProgress();
    }

    function checkAnswer() { //check answers button click handler
        //a flag to initially consider the user is done
        var finished = true;
        for (const i in answeredQuestions) { //check if there is a question that is not answered and change the flag to false
            console.log("i = " + answeredQuestions[i]);
            if (answeredQuestions[i] === null) {
                finished = false;
            }
        }

        //if the flag didnt change, the user has finished 
        if (finished === true) {
            // counter thatt considers thee correct answers = 0
            correctAnswers = 0;
            for (const i in answeredQuestions) { //looping the answered questions to count the correct ones
                if (answeredQuestions[i] === true) {
                    correctAnswers++;
                }
            }
            // set the score and update the modal text state
            setModalTxt(((correctAnswers / 10) * 100));
            document.getElementById('prevBtn').style.display = "none";
            document.getElementById('nextBtn').style.display = "none";
        }

        showModal();
        refreshProgress();
    }

    function exitModal() {//exit/hide the modal
        document.getElementById("modalBackground").style.display = 'none';
        document.getElementById("modalCard").style.display = 'none';

    }

    function showModal() {//show the modal
        document.getElementById("modalBackground").style.display = 'initial';
        document.getElementById("modalCard").style.display = 'flex';

    }

    // button click handler for all the choices to all the questions
    function btnClick(i, correctPos, pos, id) {
        //determine if the answer is correct and set answered question value (to the current question index) to true if correct and false if not
        answeredQuestions[i] = (correctPos.trim().valueOf() === pos.trim().valueOf());

        if (answeredQuestions[currentQuestion] !== null) {
            if (answeredQuestions[currentQuestion] === true)//coloring thee button green if the answer is correct
                document.getElementById(id).style.backgroundColor = "var(--b-right-green)";
            if (answeredQuestions[currentQuestion] === false)//coloring thee button red if the answer is incorrect
                document.getElementById(id).style.backgroundColor = "var(--b-wrong-red)";
            document.querySelectorAll('#question' + currentQuestion + " button").forEach(item => { item.disabled = true }); //disabling all the buttons to this questions (no answer edit allowed)
        }
        else { // if the answer is null, the user didnt click an answer, return the buttons to its initial state and color
            document.getElementById(id).style.backgroundColor = "transparent";
            document.querySelectorAll('#question' + currentQuestion + " button").forEach(item => { item.disabled = false });
        }
        refreshProgress();
    }

    function resetChoices() { //reset choices for all questions, used when clicking try again
        document.querySelectorAll(".questionItem button").forEach(item => { item.style.backgroundColor = "transparent" });
        document.querySelectorAll(".questionItem button").forEach(item => { item.disabled = false });
        document.querySelectorAll(".questionItem button").forEach(item => { item.style.cursor = "pointer" });
    }

    useEffect(() => { //get a word list from the server once
        fetch('http://localhost:8080/words')
            .then((Response) => {
                return Response.json();
            })
            .then((data) => {
                setWords(data);

            });
    }, []);

    function resetApp() { //reset click handleer that resets the app
        document.querySelectorAll(".questionItem").forEach(item => { item.style.display = "none" }); //hide all questions
        document.getElementById('question' + 0).style.display = "flex"; //show the first one only
        answeredQuestions = new Array(10).fill(null); //clear user answers
        correctAnswers = 0; //reset correct questions
        finishedQuestions = 0; //reset number of finished queestions
        currentQuestion = 0; // reset current question pointer

        document.getElementById('prevBtn').style.display = "none"; // hide previous button
        document.getElementById('checkBtn').style.display = "none"; // hide check button

        refreshProgress(); //refresh progres bar to reset it
        startQuestions(); //start new questions
        exitModal(); //hide the modal if shown
        resetChoices(); // reset questions choices

        setModalTxt("Please finish all questions"); //reset modal aleert


        fetch('http://localhost:8080/words') // get a new random word list from theee serever
            .then((Response) => {
                return Response.json();
            })
            .then((data) => {
                setWords(data);

            });



    }


    return (
        //Main component containerrs
        <div className="questionMainContainer">
            <div id="questionsSplashScreen">
                <Loading />
                <button onClick={startQuestions}>Start</button>
            </div>
            <div className="QuestionsItemContaier">
                {words.map((word, i) => { //maping the questions to the components
                    return (
                        <QuestionItem key={i} index={i} wordItem={word} onClick={btnClick} />
                    );
                })}
                {/* navigation buttons */}
                <div className="navBtns">
                    <button id="prevBtn" onClick={prevQuestion}>previose</button>
                    <button className="checkBtn" id="checkBtn" onClick={checkAnswer}>check</button>
                    <button id="nextBtn" onClick={nextQuestion}>next</button>
                </div>
                <br />
                <progress id="userProgress" value="0" max="10" />
            </div>
            {/* modal with background */}
            <ModalBG msg="hi" exit={exitModal} />
            <Modal msg={modalTxt} score={modalTxt} reset={resetApp} exit={exitModal} />
        </div>
    );

}

export default Question;