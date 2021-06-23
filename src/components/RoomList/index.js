import React from "react";
import _ from "lodash";
import Filter from "../Filter/";
import { formatAMPM } from "../FormattingUtilities.js";
import "./roomlist.css";

class RoomList extends React.Component {
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
      var x = a.resourceId,
        y = b.resourceId;
      return x === y ? 0 : x < y ? -1 : 1;
    });

    let groupedBuildings = _.groupBy(allEvents, function(o) {
      return o.resourceId;
    });
    //console.log(groups);
    for (let key in groupedBuildings)
      groupedBuildings[key].sort(function(a, b) {
        let x =
            a.extendedProps.room_number +
            a.extendedProps.standard_meeting_pattern +
            a.startTime,
          y =
            b.extendedProps.room_number +
            b.extendedProps.standard_meeting_pattern +
            b.startTime;
        return x === y ? 0 : x < y ? -1 : 1;
      });

    _.forEach(groupedBuildings, function(value, key) {
      groupedBuildings[key] = _.groupBy(groupedBuildings[key], function(item) {
        return item.extendedProps.room_number;
      });
    });

    //console.log(groupedBuildings);
    let grouped = [];
    let bldgKeys = Object.keys(groupedBuildings);
    for (let i = 0; i < bldgKeys.length; i++) {
      let roomKeys = Object.keys(groupedBuildings[bldgKeys[i]]);
      //console.log("Room keys: " + roomKeys);
      for (let j = 0; j < roomKeys.length; j++) {
        let r = groupedBuildings[bldgKeys[i]][roomKeys[j]];
        let displayName =
          r[0].extendedProps.building_id.substring(
            r[0].extendedProps.building_id.length - 4
          ) +
          " " +
          roomKeys[j];
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
            id: bldgKeys[i],
            displayName: displayName,
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
          label="Building or Room Filter"
          value={this.value}
          onChange={this.handleFilterChange}
        />
        <div className="courselisting buildings">
          {this.getAllEvents().map(resource => (
            <table key={resource.id}>
              <tbody>
                <tr>
                  <th colSpan="3">
                    <h2>{resource.displayName}</h2>
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
                        {event.extendedProps.combined_section === "C"
                          ? " (" + event.extendedProps.combined_section + ")"
                          : ""}
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

export default RoomList;
