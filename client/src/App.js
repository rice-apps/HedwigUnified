
import React from "react";
import "./App.css";
import { RoutesComponent } from "./components/Routes";
import Header from "./components/Header";
import { faWindowRestore } from "@fortawesome/free-solid-svg-icons";




function App() {
  return (
    <React.Fragment>
      {/* <Header /> */}
      <RoutesComponent />
    </React.Fragment>
  )
}

export default App
