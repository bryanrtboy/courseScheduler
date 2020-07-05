import React from "react";
import _ from "lodash";
import Filter from "../Filter/";
import { formatAMPM } from "../FormattingUtilities.js";
import "./instructorlist.css";

class InstructorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "", grouped: [], events: [] };
    this.handleChange = this.handleChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentDidMount() {
    this.updateAllEvents();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.events !== this.props.events ||
      prevState.value !== this.state.value
    ) {
      this.updateAllEvents();
    }
  }

  updateAllEvents() {
    let grouped = this.getAllEvents();

    this.setState({
      grouped: grouped,
      events: this.props.events
    });
  }

  handleFilterChange = event => {
    this.setState({
      value: event.target.value
    });
  };

  handleChange = event => e => {
    if (typeof this.props.onClick === "function") this.props.onClick(event);
  };

  getAllEvents() {
    let allEvents = [];
    for (let i = 0; i < this.props.events.length; i++) {
      for (let j = 0; j < this.props.events[i].events.length; j++) {
        allEvents.push(this.props.events[i].events[j]);
      }
    }

    allEvents.sort(function(a, b) {
      let x = a.extendedProps.instructor_name,
        y = b.extendedProps.instructor_name;
      return x === y ? 0 : x < y ? -1 : 1;
    });

    let groupedBuildings = _.groupBy(allEvents, function(o) {
      return o.extendedProps.instructor_name;
    });
    //console.log(groups);
    for (let key in groupedBuildings)
      groupedBuildings[key].sort(function(a, b) {
        var x = a.extendedProps.standard_meeting_pattern + a.startTime;
        var y = b.extendedProps.standard_meeting_pattern + b.startTime;
        return x === y ? 0 : x < y ? -1 : 1;
      });

    _.forEach(groupedBuildings, function(value, key) {
      groupedBuildings[key] = _.groupBy(groupedBuildings[key], function(item) {
        return item.extendedProps.instructor_name;
      });
    });

    //console.log(groupedBuildings);
    let grouped = [];
    let courseKeys = Object.keys(groupedBuildings);
    for (let i = 0; i < courseKeys.length; i++) {
      let sectionKeys = Object.keys(groupedBuildings[courseKeys[i]]);
      //console.log("Room keys: " + roomKeys);
      for (let j = 0; j < sectionKeys.length; j++) {
        let r = groupedBuildings[courseKeys[i]][sectionKeys[j]];
        //console.log(r);
        let displayName = r[0].extendedProps.instructor_name;
        let count = " (" + r.length + ")";
        //console.log(r);

        let include = true;
        if (
          this.state.value.length > 0 &&
          !r[0].extendedProps.last_name
            .toLowerCase()
            .includes(this.state.value.toLowerCase())
        ) {
          include = false;
        }
        if (include) {
          grouped.push({
            id: courseKeys[i],
            displayName: displayName,
            count: count,
            rooms: r
          });
        }
      }
    }

    //console.log(grouped);
    return grouped;
  }

  render() {
    return (
      <div>
        <Filter
          label="Last Name Filter"
          value={this.value}
          onChange={this.handleFilterChange}
        />
        <div className="courselisting instructors">
          {this.state.grouped.map(resource => (
            <table key={resource.id}>
              <tbody>
                <tr>
                  <th colSpan="3">
                    <h2>
                      {resource.displayName}
                      <span>{resource.count}</span>
                    </h2>
                  </th>
                </tr>
                {resource.rooms.map(event => (
                  <tr
                    key={event.extendedProps.key}
                    className={
                      event.extendedProps.schedule_print.toLowerCase() +
                      "-scheduled-print " +
                      " " +
                      (event.extendedProps.room_conflict === true
                        ? "room-conflict"
                        : " ")
                    }
                  >
                    <td className="meeting-pattern">
                      <strong>
                        {event.extendedProps.standard_meeting_pattern}
                      </strong>
                    </td>
                    <td className="time">
                      {formatAMPM(event.startTime) +
                        "-" +
                        formatAMPM(event.endTime)}{" "}
                    </td>
                    <td className="main">
                      <strong onClick={this.handleChange(event)}>
                        {event.extendedProps.subject_code + " " + event.title}
                      </strong>
                      <p>
                        {event.extendedProps.last_name}{" "}
                        {event.extendedProps.instructor_role_code === "PI"
                          ? " "
                          : " (" +
                            event.extendedProps.instructor_role_code +
                            ") "}
                        {event.extendedProps.enrollment_total +
                          "/" +
                          event.extendedProps.enrollment_cap}
                        {event.extendedProps.wait_total > 0
                          ? " (" +
                            event.extendedProps.wait_total +
                            "/" +
                            event.extendedProps.wait_cap +
                            ")"
                          : ""}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>
    );
  }
}

export default InstructorList;
