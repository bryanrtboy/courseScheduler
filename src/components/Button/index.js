import React from "react";
import "./button.css";

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    //console.log(e);
    if (this.props.onClick) this.props.onClick(e);
  }
  render() {
    return (
      <button
        className={this.props.className + " button"}
        onClick={this.handleClick}
      >
        {this.props.name}
      </button>
    );
  }
}

export default Button;
