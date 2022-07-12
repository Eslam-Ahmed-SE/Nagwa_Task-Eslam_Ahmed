//Creating the app with express module
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = 8080;

//Telling the app (express module) to use json
app.use(express.json());

// File System module to read TestData.json file given
const fs = require('fs');

//reading file and parsing data
let rawdata = fs.readFileSync('TestData.json');
let data = JSON.parse(rawdata);

// Getting word list from json data
let wordList = data["wordList"];


var criteriaAdverb = false;
var criteriaVerb = false;
var criteriaNoun = false;
var criteriaAdjective = false;

var randomWordIndexes = [];

// This function fills the wordListIndex with 10 random numbers ranging from 0 to 14
function fillWordIndexList(){
    //clearing the array
    randomWordIndexes = []

    //filling the array
    while (randomWordIndexes.length<10) {
        const randomNum = Math.floor(Math.random() * 14);
        if (randomWordIndexes.indexOf(randomNum) == -1) 
            randomWordIndexes.push(randomNum);
    }

    //sorting the array by number edit: removed, unsorted makes it seam more random (words having random positions)
    // randomWordIndexes.sort(function(a, b) {
    //     return a - b;
    //   });

    //checking the words types 
    for (i of randomWordIndexes){
        if (wordList[i].pos == "adverb")
            criteriaAdverb=true;
        if (wordList[i].pos == "verb")
            criteriaVerb=true;
        if (wordList[i].pos == "noun")
            criteriaNoun=true;
        if (wordList[i].pos == "adjective")
            criteriaAdjective=true;
    }

    
}






//words endpoint that returns 10 randomly selected words
app.get(
    '/words',
    (req, res) => {
        //Creating 10 random indexes from 0 to 14 (15 available indexes in wordlist)
        fillWordIndexList();

        // Chcecking for 1 adjective, 1 adverb, 1 noun, and 1 verb and creating new array if not
        while(!(criteriaAdverb && criteriaVerb && criteriaNoun && criteriaAdjective)){
            fillWordIndexList();
        }

        let selectedWords = [];
        for (i of randomWordIndexes) {
            selectedWords.push(wordList[i]);
        }

        res.status(200).send(selectedWords); 
    }
);

// Getting scores list from json data
let scoresList = data["scoresList"];

//rank endpoint that takes final score and responds with rank
app.post(
    '/rank',
    (req, res) => {
        const {finalScore} = req.body;
        if (!finalScore) res.status(406).send({message: 'final score not found' + finalScore + " - " + req.body + ' : ' + req });

        else {
            let count = 0;
            for (score of scoresList){
                if (score < finalScore){
                    count++;
                }
            }

            //calculating rank
            let rank = (count/scoresList.length)*100;

            res.send({rank: Math.round(rank*100)/100 });
        }
    }
)

// Starting the app
app.listen(
    8080,
    () => console.log(`app started at http://localhost:${PORT}` )
);
