import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./modal.css";
//const modalRoot = document.getElementById("modal-root");

// Let's create a Modal component that is an abstraction around
// the portal API.
class Modal extends React.Component {
  constructor(props) {
    super(props);
    // Create a div that we'll render the modal into. Because each
    // Modal component has its own element, we can render multiple
    // modal components into the modal container.
    this.el = document.createElement("div");
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    // Append the element into the DOM on mount. We'll render
    // into the modal container element (see the HTML tab).
    this.props.modalRoot.appendChild(this.el);
    let closeDiv = document.createElement("div");
    closeDiv.id = "modal-close";
    closeDiv.addEventListener("click", this.handleClick);
    let mdiv = document.createElement("div");
    mdiv.className = "mdiv";
    closeDiv.appendChild(mdiv);
    let md = document.createElement("div");
    md.className = "md";
    mdiv.appendChild(md);
    let content = this.props.modalRoot.querySelector(".modal-main");
    content.appendChild(closeDiv);
    let c = content.querySelector("div");
    c.className = "inner-modal-content";
    //console.log(content.querySelector("div"));
  }

  componentWillUnmount() {
    // Remove the element from the DOM when we unmount
    this.props.modalRoot.removeChild(this.el);
  }
  handleClick(e) {
    //console.log(e);
    if (this.props.onClose) this.props.onClose(e);
  }

  render() {
    // Use a portal to render the children into the element
    return ReactDOM.createPortal(
      // Any valid React child: JSX, strings, arrays, etc.
      this.props.children,
      // A DOM element
      this.el
    );
  }
}
export default Modal;

Modal.propTypes = {
  onClose: PropTypes.func.isRequired
};
