import React from "react";
import CustomSelect from "../CustomSelect/";
import ToggleSwitch from "../Toggle/";
import { formatAMPM } from "../FormattingUtilities.js";
import approvers from "../../data/approvers.json";
import requestors from "../../data/requestors.json";

import "./formstack.css";

class FSButton extends React.Component {
  constructor(props) {
    super(props);
    this.courseChangeURL = this.courseChangeURL.bind(this);
    this.addCourseURL = this.addCourseURL.bind(this);
    //this.changeApprover = this.changeApprover.bind(this);
    this.validateAndSubmit = this.validateAndSubmit.bind(this);
    this.changeFrom = this.changeFrom.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.state = {
      approver: { name: "Sonia Brown", email: "sonia.brown@ucdenver.edu" },
      from: { name: "", email: "" },
      add: false,
      isFutureCourse: true,
      isValid: false
    };
  }

  componentDidMount() {
    var date = new Date(); // Now
    date.setDate(date.getDate() - 30);

    //If this continues to be a problem, I guess we could use the class_end_date....
    let isFutureCourse =
      date < new Date(this.props.currentEvent.extendedProps.class_start_date);

    this.setState({
      isFutureCourse: isFutureCourse,
      add: !isFutureCourse
    });
  }

  componentWillUnmount() {}
  validateAndSubmit = () => {
    if (
      this.state.approver.name.length < 2 ||
      this.state.from.name.length < 2
    ) {
      return true;
    } else {
      return false;
    }
  };

  addCourseURL() {
    let url = "https://ucdenverdata.formstack.com/forms/new_course_add_form?";
    const e = this.props.currentEvent;

    let start = formatAMPM(e.extendedProps.meeting_time_start);
    let end = formatAMPM(e.extendedProps.meeting_time_end);
    start = start.split(":");
    end = end.split(":");

    url += "field82722827=" + e.extendedProps.term_code;
    url += "&field82722824=" + e.extendedProps.catalog_number;
    url += "&field82722823=" + e.extendedProps.subject_code;
    url += "&field82722825=TBD";
    url += "&field82661887=TBD";
    url += "&field82661997=TBD";
    url += "&field82722829=" + e.extendedProps.course_title;
    url += "&field82722838=" + e.extendedProps.instructor_name;
    url += "&field82722837=" + e.extendedProps.instructor_email;
    url += "&field82722826=" + e.extendedProps.enrollment_cap; //For display only
    url += "&field84502599=" + e.extendedProps.enrollment_total;
    url += "&field82722840=" + e.extendedProps.instructor_role_code;
    url += "&field82722858=" + e.extendedProps.instructor_mode_code;
    url += "&field82722841=" + e.extendedProps.instructor_load_factor;
    url += "&field82722842=" + e.extendedProps.grade_restriction_access;
    url += "&field82722843=" + e.extendedProps.instructor_assignment_number;
    url += "&field82722845=" + e.extendedProps.building_id;
    url += "&field82722846=" + e.extendedProps.room_number;
    url += "&field82722847=" + e.extendedProps.standard_meeting_pattern;
    url += "&field82722851=" + e.extendedProps.enrollment_cap;
    url += "&field82722852=" + e.extendedProps.room_cap_request;
    url += "&field82722853=" + e.extendedProps.wait_cap;
    url += "&field82722854=" + e.extendedProps.consent;
    url += "&field82722855=" + e.extendedProps.student_special_perm;
    url += "&field82722860=" + e.extendedProps.campus_code;
    url += "&field82722861=" + e.extendedProps.academic_organization_code;
    url += "&field82722862=" + e.extendedProps.academic_career_code;
    url += "&field82722859=" + e.extendedProps.schedule_print;
    url += "&field82722864=" + e.extendedProps.combined_section;
    url += "&field82722865=" + e.extendedProps.section_combined_description;
    url += "&field82722863=" + e.extendedProps.course_topic;
    url += "&field82722848H=" + start[0].padStart(2, "0");
    url += "&field82722848I=" + start[1].substring(0, 2);
    url +=
      "&field82722848A=" +
      start[1].substring(start[1].length - 2).toUpperCase();
    url += "&field82722849H=" + end[0].padStart(2, "0");
    url += "&field82722849I=" + end[1].substring(0, 2);
    url +=
      "&field82722849A=" + end[1].substring(end[1].length - 2).toUpperCase();
    url += "&field82722867=" + this.state.from.name;
    url += "&field82722868=" + this.state.from.email;
    url += "&field82722833=" + this.state.approver.email;
    url += "&field82722832=" + this.state.approver.name;
    //console.log(encodeURI(url));
    return encodeURI(url);
  }

  courseChangeURL() {
    //When adding new fields, you need to also edit FormattingUtilities.js to match the API with these names
    let url = "https://ucdenverdata.formstack.com/forms/course_change_form?";
    const e = this.props.currentEvent;

    let start = formatAMPM(e.extendedProps.meeting_time_start);
    let end = formatAMPM(e.extendedProps.meeting_time_end);
    start = start.split(":");
    end = end.split(":");

    url += "field82661884=" + e.extendedProps.term_code;
    url += "&field82661886=" + e.extendedProps.catalog_number;
    url += "&field82663633=" + e.extendedProps.subject_code;
    url += "&field82661887=" + e.extendedProps.class_section_code;
    url += "&field82661997=" + e.extendedProps.class_number;
    url += "&field82664095=" + e.extendedProps.course_title;
    url += "&field82662294=" + e.extendedProps.instructor_name;
    url += "&field82672947=" + e.extendedProps.instructor_email;
    url += "&field82672583=" + e.extendedProps.enrollment_cap; //For display only
    url += "&field84502599=" + e.extendedProps.enrollment_total;
    url += "&field82673425=" + e.extendedProps.instructor_role_code;
    url += "&field82673429=" + e.extendedProps.instructor_mode_code;
    url += "&field82673536=" + e.extendedProps.instructor_load_factor;
    url += "&field82673537=" + e.extendedProps.grade_restriction_access;
    url += "&field82673540=" + e.extendedProps.instructor_assignment_number;
    url += "&field82663287=" + e.extendedProps.building_id;
    url += "&field82663392=" + e.extendedProps.room_number;
    url += "&field82673357=" + e.extendedProps.standard_meeting_pattern;
    url += "&field82673338=" + e.extendedProps.enrollment_cap;
    url += "&field82673339=" + e.extendedProps.room_cap_request;
    url += "&field82673341=" + e.extendedProps.wait_cap;
    url += "&field82673343=" + e.extendedProps.consent;
    url += "&field82673356=" + e.extendedProps.student_special_perm;
    url += "&field82673545=" + e.extendedProps.campus_code;
    url += "&field82673550=" + e.extendedProps.academic_organization_code;
    url += "&field82673707=" + e.extendedProps.academic_career_code;
    url += "&field82673730=" + e.extendedProps.schedule_print;
    url += "&field82673711=" + e.extendedProps.combined_section;
    url += "&field82673727=" + e.extendedProps.section_combined_description;
    url += "&field101479305=" + e.extendedProps.section_combined_code;
    url += "&field82673709=" + e.extendedProps.course_topic;
    url += "&field82663458H=" + start[0].padStart(2, "0");
    url += "&field82663458I=" + start[1].substring(0, 2);
    url +=
      "&field82663458A=" +
      start[1].substring(start[1].length - 2).toUpperCase();
    url += "&field82663502H=" + end[0].padStart(2, "0");
    url += "&field82663502I=" + end[1].substring(0, 2);
    url +=
      "&field82663502A=" + end[1].substring(end[1].length - 2).toUpperCase();
    url += "&field82673983=" + this.state.from.name;
    url += "&field82673986=" + this.state.from.email;
    url += "&field82685309=" + this.state.approver.email;
    url += "&field82685606=" + this.state.approver.name;
    //console.log(encodeURI(url));
    return encodeURI(url);
  }

  // changeApprover = e => {
  //   //console.log("e is " + e);
  //   if (e === "Formstack Approver") {
  //     this.setState({
  //       approver: { name: "", email: "" }
  //     });
  //     return;
  //   }
  //   let approver = approvers.find(({ id }) => id === e);
  //   //let approver = {name: formstack};
  //   this.setState({
  //     approver: { name: approver.name, email: approver.id }
  //   });
  // };

  changeFrom = e => {
    if (e === "Your Name") {
      this.setState({
        from: { name: "", email: "" }
      });
      return;
    }

    let from = requestors.find(({ id }) => id === e);
    //let approver = {name: formstack};
    this.setState({
      from: { name: from.name, email: from.id }
    });
  };

  onSelectChange(event) {
    console.log(event.target.value);
  }

  onCheckboxChange() {
    this.setState({
      add: !this.state.add
    });
  }

  render() {
    return (
      <form
        className="formstack"
        action={this.state.add ? this.addCourseURL() : this.courseChangeURL()}
        method="post"
        target="_blank"
      >
        <div>
          <CustomSelect
            name="Your Name"
            onSelectChange={this.changeFrom}
            data={requestors}
          />
          {/*<CustomSelect
            name="Formstack Approver"
            onSelectChange={this.changeApprover}
            data={approvers}
          />*/}
          <ToggleSwitch
            id="Add"
            key="Add"
            className="add_toggle"
            Text={["Add", "Add"]}
            Name="Add Toggle"
            onChange={this.onCheckboxChange}
            defaultChecked={!this.state.isFutureCourse}
            Small={false}
            disabled={!this.state.isFutureCourse}
          />
          <button
            className="fc-button fc-button-primary"
            type="submit"
            disabled={this.validateAndSubmit()}
          >
            {this.state.add ? "Add/Clone" : "Change"}
          </button>
        </div>
      </form>
    );
  }
}

export default FSButton;
