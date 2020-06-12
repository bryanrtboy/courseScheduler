import React from "react";
import ToggleSwitch from "../Toggle/";
import "./subjecttoggles.css";

class SubjectToggles extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { toggles: [] };
  }

  componentDidMount() {
    let toggles = this.makeToggles();
    this.setState({
      toggles: toggles
    });
  }

  handleCheck(val) {
    let exists = this.props.appRef.state.currentToggles.some(
      item => val.key === item.key
    );
    return exists;
  }

  handleChange(e) {
    if (typeof this.props.onChange === "function") this.props.onChange(e);
  }

  makeToggles() {
    //console.log("making toggles " + new Date());
    let toggles = [];
    const eventSources = this.props.eventSources;
    for (let i = 0; i < eventSources.length; i++) {
      const toggle = (
        <ToggleSwitch
          id={eventSources[i].id}
          key={eventSources[i].id}
          Text={[eventSources[i].id, eventSources[i].id]}
          Name={eventSources[i].id}
          onChange={this.handleChange}
          defaultChecked={
            this.props.currentToggles.find(
              ({ key }) => key === eventSources[i].id
            )
              ? this.props.currentToggles.find(
                  ({ key }) => key === eventSources[i].id
                ).checked
              : true
          }
          Small={false}
          disabled={false}
        />
      );
      toggles.push(toggle);
    }
    toggles.sort(function(a, b) {
      if (a.props.id < b.props.id) {
        return -1;
      }
      if (a.props.id > b.props.id) {
        return 1;
      }
      return 0;
    });

    return toggles;
  }
  render() {
    return <div id="current-toggle-switches">{this.state.toggles}</div>;
  }
}

export default SubjectToggles;
