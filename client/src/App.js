import React from "react";
import "./App.css";
import { Routes } from "./components/Routes";
import Header from "./components/Header";

function App() {
  return (
    <React.Fragment>
      <Header />
      <Routes />
    </React.Fragment>
  );
}

export default App;
