import React from "react";

class CourseTitle extends React.Component {
// eslint-disable-next-line
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="course-title">
        <h2>{this.props.title} </h2>
        <p>
          <strong>{this.props.meetingpattern}</strong> {this.props.subhead}
        </p>
      </div>
    );
  }
}

export default CourseTitle;
