
//basic question item componeen that gets repeated
function QuestionItem(params) {
    return (
        <div className="questionItem" id={'question'+params.index}>
            <h2>What part of speach is this word?</h2>
            <h3>{params.wordItem.word}</h3>
            <div>
                <button id={"question"+params.index+"option1"} onClick={()=>params.onClick(params.index, params.wordItem.pos, "noun", "question"+params.index+"option1")}>Noun</button>
                <button id={"question"+params.index+"option2"} onClick={()=>params.onClick(params.index, params.wordItem.pos, "verb", "question"+params.index+"option2")}>Verb</button>
                <button id={"question"+params.index+"option3"} onClick={()=>params.onClick(params.index, params.wordItem.pos, "adverb", "question"+params.index+"option3")}>Adverb</button>
                <button id={"question"+params.index+"option4"} onClick={()=>params.onClick(params.index, params.wordItem.pos, "adjective", "question"+params.index+"option4")}>Adjective</button>
            </div>
        </div>
    );
}

export default QuestionItem;