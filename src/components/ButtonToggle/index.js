import React, { useState } from "react";
import "./buttontoggle.css";

//useState only works in a function for me...
function ButtonToggle(props) {
  const [Text] = useState(props.Text);
  const isShowAll = useState(props.isShowAll);

  function handleClick(e) {
    //console.log(e);
    if (props.onToggleClick) props.onToggleClick(e);
  }

  return (
    <button
      className="button-toggle fc-button fc-button-primary"
      onClick={handleClick}
      id={props.id}
    >
      {props.isShowAll ? Text[0] : Text[1]}
    </button>
  );
}
export default ButtonToggle;
