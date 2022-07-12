import { useState, useEffect } from "react";

//modal component shown when usere clicks check answers
function Modal(params) {

    const [rank, setRank] = useState(0);

    //request the rank baseed on the score
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finalScore: params.score }) //user score
    };
    fetch('http://localhost:8080/rank', requestOptions)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }

            //set rank state
            setRank(data.rank);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });

    return ( //showing the modal data
        <div className="modalCard" id="modalCard">
            {/* if the rank is 0, the modal didnt receive score yet dont show h1 */}
            <h1>{(rank === 0) ? "" : "Your Score is"}</h1>
            {/* if the rank is 0, the modal didnt receive score yet show an alert, else the score is sent show the rank */}
            <h2 className="modalTxt">{(rank === 0) ? "Please finish all questions" : rank}</h2>
            <div className="ModalNav">
                <button className="finishBtn" onClick={() => params.exit()}>Finish</button>
                <button className="resetBtn" onClick={() => params.reset()}>Try again</button>
            </div>
        </div>

    );
}

export default Modal;