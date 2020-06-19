import React from "react";

import "./skeleton.css";

class Skeleton extends React.Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <table id="skeleton">
          <tbody>
            <tr>
              <td>
                <h2>Requesting data...</h2>
              </td>
            </tr>
            <tr>
              <td>
                <div className="loader"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Skeleton;
