import React from "react";
import CourseTitle from "../CourseTitle/";
import { displayTime } from "../FormattingUtilities.js";
import InstagramEmbed from "react-instagram-embed";

import "./coursedetail.css";
import courseDescriptions from "../../data/camuniqueinventory.json";

class CourseDetail extends React.Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }
  render() {
    let d = courseDescriptions.find(
      ({ CRSE_ID }) =>
        CRSE_ID === this.props.currentEvent.extendedProps.course_id
    );
    const description = d ? d.CRSE_CATALOG_LD : "No Description Available.";

    const promotion =
      d && d.URL !== "" ? (
        <InstagramEmbed
          className="promote"
          url="https://www.instagram.com/p/CAGTsMBFQYV/"
          maxWidth={320}
          hideCaption={true}
          containerTagName="div"
          protocol=""
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
      ) : (
        ""
      );

    const finePrint = this.props.showFinePrint ? (
      <p className="fine-print">
        {"Course ID: " +
          this.props.currentEvent.extendedProps.course_id +
          ", Class Number: " +
          this.props.currentEvent.extendedProps.class_number +
          ", Term: " +
          this.props.currentEvent.extendedProps.term_code +
          " – " +
          this.props.currentEvent.title +
          "– was last updated on " +
          this.props.currentEvent.extendedProps.last_data_updated_date +
          ". The most recent update for all visible courses was " +
          this.props.latestUpdateVisible +
          "."}
      </p>
    ) : null;

    return (
      <div>
        {promotion}
        <CourseTitle
          title={
            this.props.currentEvent.extendedProps.subject_code +
            " " +
            this.props.currentEvent.title
          }
          meetingpattern={
            this.props.currentEvent.extendedProps.standard_meeting_pattern
          }
          subhead={
            displayTime(
              this.props.currentEvent.extendedProps.meeting_time_start,
              this.props.currentEvent.extendedProps.meeting_time_end,
              this.props.currentEvent.allDay
            ) +
            " " +
            this.props.currentEvent.extendedProps.building_id.substring(
              this.props.currentEvent.extendedProps.building_id.length - 4
            ) +
            " " +
            this.props.currentEvent.extendedProps.room_number
          }
        />
        <p>
          <a
            href={
              "mailto:" +
              this.props.currentEvent.extendedProps.instructor_email +
              "?subject=Question about " +
              this.props.currentEvent.extendedProps.course_title
            }
          >
            {this.props.currentEvent.extendedProps.instructor_name}
          </a>
          <span className="grey">
            &nbsp;&nbsp;
            {"(" +
              this.props.currentEvent.extendedProps.instructor_role_code +
              ")"}
          </span>
        </p>
        <p>{description}</p>
        <p>
          {"Enrolled: " +
            this.props.currentEvent.extendedProps.enrollment_total +
            "/" +
            this.props.currentEvent.extendedProps.enrollment_cap +
            ", Waitlist: " +
            this.props.currentEvent.extendedProps.wait_total +
            "/" +
            this.props.currentEvent.extendedProps.wait_cap}
        </p>
        {finePrint}
      </div>
    );
  }
}

export default CourseDetail;
