import React from "react";
import "./components.css";


function ErrorPage(props) {  
  {
    return (
      <div className="errorPage">
        <h1>ERROR 404.</h1>
        {/* <p>Page not found. Try a different URL!</p> */}
        <p>{props.errMessage} Try a different URL!</p>
      </div>
    );
  }
}
  


export default ErrorPage;

