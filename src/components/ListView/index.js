import React from "react";
import RoomList from "../RoomList/";
import CourseList from "../CourseList/";
import InstructorList from "../InstructorList/";
import "./listview.css";

class ListView extends React.Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }

  switchView() {
    let view = "";
    switch (this.props.resourceType) {
      case "buildings":
        view = (
          <RoomList
            events={this.props.events}
            resourceType={this.props.resourceType}
            onClick={this.props.onClick}
          />
        );
        break;
      case "courses":
        view = (
          <CourseList
            events={this.props.events}
            resourceType={this.props.resourceType}
            onClick={this.props.onClick}
          />
        );
        break;
      case "instructors":
        view = (
          <InstructorList
            events={this.props.events}
            resourceType={this.props.resourceType}
            onClick={this.props.onClick}
          />
        );
        break;
      default:
    }
    return view;
  }

  componentDidMount() {}
  render() {
    return (
      <div className="view-title">
        <h1> {this.props.semester}</h1>
        {this.switchView()}
      </div>
    );
  }
}

export default ListView;
