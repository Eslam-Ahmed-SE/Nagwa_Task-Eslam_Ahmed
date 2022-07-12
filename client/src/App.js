//this is the main app module
import { useState } from "react";
import Question from "./components/Question";
import SplashScreen from "./components/SplashScreen";


function App() {
  //the main splash screen state
  const [isSplashShown, setIsSplashShow] = useState(true);


  //arrow button clicked indicates next to go on with the app
  function btnClick() {
    //change the splash screen shown state to hide the splash screen and show the question module
    setIsSplashShow(false);
  }

  
  
  return (
    //main containers
    <div className="mainApp">
      <div className="content">
        {/* if the splash screen state is shown SplashScreen.js is called else Question.js is called */}
        {isSplashShown ? <SplashScreen /> : <Question />}
      </div>
      {/* button to change the state of the SplashScreen */}
      {isSplashShown ? <button className="exitSplash" onClick={btnClick}>{'>'}</button> : null}

    </div>
  );
  
}

export default App;
