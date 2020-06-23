import React from "react";

import "./filter.css";

class Filter extends React.Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="list-filter">
        <label htmlFor="search">{this.props.label + ": "} </label>
        <input
          type="text"
          value={this.props.value}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

export default Filter;
