import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { colorBySubject } from "../FormattingUtilities.js";

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewTitle: "Calendar"
    };
  }

  next = args => {
    let calendarApi = this.props.calendarRef.current.getApi();
    calendarApi.next();
    this.setState({
      viewTitle: calendarApi.view.title
    });
  };

  prev = args => {
    let calendarApi = this.props.calendarRef.current.getApi();
    calendarApi.prev();
    this.setState({
      viewTitle: calendarApi.view.title
    });
  };

  today = args => {
    let calendarApi = this.props.calendarRef.current.getApi();
    calendarApi.gotoDate(new Date());
    this.setState({
      viewTitle: calendarApi.view.title
    });
  };
  componentDidMount() {
    let calendarApi = this.props.calendarRef.current.getApi();
    calendarApi.initialDate = this.props.state.currentCalendarDate;
    this.setState({
      viewTitle: calendarApi.view.title
    });
    //console.log(this.props.calendarRef.current.);
  }
  render() {
    return (
      <div>
        <div className={"planner-app-top view-title"}>
          <h1>{this.state.viewTitle}</h1>
        </div>
        <FullCalendar
          ref={this.props.calendarRef}
          timeZone="America/Denver"
          initialView="resourceTimelineWeek"
          height="auto"
          aspectRatio={1}
          customButtons={{
            goNext: {
              text: " >",
              click: this.next
            },
            goPrev: {
              text: "< ",
              click: this.prev
            },
            goToday: {
              text: " today ",
              click: this.today
            },
            toggleWeekends: {
              text: "S/Su",
              click: this.props.toggleWeekends
            }
          }}
          headerToolbar={{
            left: "goPrev,goNext goToday",
            right:
              "resourceTimelineMonth,resourceTimelineWeek,resourceTimelineThreeDays,resourceTimelineDay toggleWeekends"
          }}
          initialDate={this.props.state.currentCalendarDate}
          allDaySlot={false}
          defaultAllDayEventDuration={{
            days: 5
          }}
          slotMinTime="08:00:00"
          slotMaxTime="21:30:00"
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5], // Monday - Thursday
            startTime: "8:00",
            endTime: "21:00"
          }}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            resourceTimelinePlugin
          ]}
          schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
          editable={false}
          weekends={this.props.state.calendarWeekends}
          progressiveEventRendering={false}
          lazyFetching={true}
          eventSources={this.props.state.eventsVisible}
          eventContent={function(arg) {
            let articleEl = document.createElement("article");
            articleEl.style.backgroundColor = colorBySubject(
              arg.event.extendedProps.subject_code,
              "36%",
              "40%"
            );
            articleEl.style.width =
              (
                (parseFloat(arg.event.extendedProps.enrollment_total) /
                  parseFloat(arg.event.extendedProps.enrollment_cap)) *
                100
              ).toString() + "%";
            articleEl.lang = "en";
            let titleEl = document.createElement("p");
            titleEl.className = "title";
            titleEl.innerHTML =
              arg.event.title +
              " <span class='course-instructor'>- " +
              arg.event.extendedProps.last_name +
              "</span>";
            let subEl = document.createElement("span");
            subEl.innerHTML = arg.event.extendedProps.last_name;
            subEl.className = "all-day-" + arg.event.allDay;
            articleEl.appendChild(titleEl);
            articleEl.appendChild(subEl);
            let arrayOfDomNodes = [articleEl];
            return { domNodes: arrayOfDomNodes };
          }}
          eventClick={this.props.handleShow}
          eventClassNames={function(arg) {
            let classes = [];
            if (arg.event.extendedProps.room_conflict) {
              classes.push("room-conflict");
            }
            return classes;
          }}
          views={{
            timeline: {
              titleFormat: {
                year: "numeric",
                month: "short",
                day: "numeric"
              },
              resourcesInitiallyExpanded: true,
              allDaySlot: false
            },
            day: {
              allDaySlot: false
            },
            week: {
              allDaySlot: false
            },
            resourceTimelineThreeDays: {
              buttonText: "3 day ",
              allDaySlot: false,
              type: "resourceTimeline",
              duration: {
                days: 3
              }
            },
            resourceTimelineDay: {
              buttonText: "day",
              type: "resourceTimeline",
              allDaySlot: false,
              //weekends: true,
              slotDuration: "00:15:00"
            },
            resourceTimelineWeek: {
              buttonText: "week",
              type: "resourceTimeline",
              slotMaxTime: "20:00:00",
              // duration: {
              //   days: 5
              // },
              slotDuration: "03:00:00"
            }
          }}
          resources={this.props.state.resources}
          resourceOrder="resource"
          filterResourcesWithEvents={false}
          resourcesInitiallyExpanded={this.props.state.resourcesExpanded}
          resourceAreaWidth="15%"
          resourceGroupField="resource"
          resourceAreaHeaderContent={this.props.state.resourceType.toUpperCase()}
          resourceLabelDidMount={function(info) {
            let uniqueCourses = [];
            let events = info.resource.getEvents();
            //console.log(info.el);
            for (let i = 0; i < events.length; i++) {
              if (
                !uniqueCourses.includes(events[i].extendedProps.class_number)
              ) {
                if (
                  events[i].extendedProps.academic_career_code === "UGRD" &&
                  events[i].extendedProps.schedule_print === "Y"
                ) {
                  uniqueCourses.push(events[i].extendedProps.class_number);
                }
              }
            }
            var questionMark = document.createElement("span");
            questionMark.innerText = " (" + uniqueCourses.length + ") ";
            //console.log(info.resource.getEvents());
            info.el
              .querySelector(".fc-datagrid-cell-main")
              .appendChild(questionMark);
          }}
        />
      </div>
    );
  }
}

export default Calendar;
