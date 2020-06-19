import React from "react";
//import ReactDOM from "react-dom";
import { render } from "react-dom";
import "./index.css";
import App from "./App";
//import * as serviceWorker from "./serviceWorker";

document.addEventListener("DOMContentLoaded", function() {
  render(<App />, document.body.appendChild(document.createElement("div")));
});

//The commented-out code is from create-react app, builds do not currently work
//using creeate-react, probably due to a jest error that I can't figure out...
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
