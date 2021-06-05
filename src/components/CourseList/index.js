import React from "react";
import _ from "lodash";
import { formatAMPM } from "../FormattingUtilities.js";
import Filter from "../Filter/";
import courseDescriptions from "../../data/camuniqueinventory.json";
import "./courselist.css";

class CourseList extends React.Component {
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
      let x = a.extendedProps.subject_code + a.extendedProps.catalog_number,
        y = b.extendedProps.subject_code + b.extendedProps.catalog_number;
      return x === y ? 0 : x < y ? -1 : 1;
    });

    let groupedCourses = _.groupBy(allEvents, function(o) {
      return o.extendedProps.catalog_number;
    });
    //console.log(groups);
    for (let key in groupedCourses)
      groupedCourses[key].sort(function(a, b) {
        var x = a.extendedProps.standard_meeting_pattern + a.startTime;
        var y = b.extendedProps.standard_meeting_pattern + b.startTime;
        return x === y ? 0 : x < y ? -1 : 1;
      });

    _.forEach(groupedCourses, function(value, key) {
      groupedCourses[key] = _.groupBy(groupedCourses[key], function(item) {
        return item.extendedProps.course_id;
      });
    });

    //console.log(groupedBuildings);
    let grouped = [];
    let courseKeys = Object.keys(groupedCourses);
    for (let i = 0; i < courseKeys.length; i++) {
      let sectionKeys = Object.keys(groupedCourses[courseKeys[i]]);
      //console.log("Room keys: " + roomKeys);
      for (let j = 0; j < sectionKeys.length; j++) {
        let r = groupedCourses[courseKeys[i]][sectionKeys[j]];

        let d = courseDescriptions.find(
          ({ CRSE_ID }) => CRSE_ID === r[0].extendedProps.course_id
        );
        const description = d
          ? d.CRSE_CATALOG_LD +
            " Status: " +
            d.STATUS +
            ". Effective " +
            d.EFFECTIVE_DATE.slice(0, -5)
          : "No Description Available.";
        //console.log(r);
        let displayName =
          r[0].extendedProps.subject_code +
          " " +
          r[0].extendedProps.catalog_number +
          " - " +
          r[0].extendedProps.course_title;
        let count = " (" + r.length + ")";
        //console.log(r);
        let include = true;
        if (
          this.state.value.length > 0 &&
          !displayName.toLowerCase().includes(this.state.value.toLowerCase())
        ) {
          include = false;
        }

        if (include) {
          grouped.push({
            id: courseKeys[i],
            displayName: displayName,
            count: count,
            description: description,
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
          label="Filter by Title or Number"
          value={this.value}
          onChange={this.handleFilterChange}
        />
        <div className="courselisting">
          {this.state.grouped.map((resource, index) => (
            <table key={index}>
              <tbody>
                <tr>
                  <th colSpan="3">
                    <h2>
                      {resource.displayName}
                      <span>{resource.count}</span>
                    </h2>
                    <p>{resource.description}</p>
                  </th>
                </tr>
                {resource.rooms.map(event => (
                  <tr
                    key={event.extendedProps.key}
                    className={
                      event.extendedProps.schedule_print.toLowerCase() +
                      "-scheduled-print"
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

export default CourseList;
