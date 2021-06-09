import React from "react";
import "./index.css";

import Calendar from "./components/Calendar/";
import Button from "./components/Button/";
import FormStack from "./components/FormStack/";
import Modal from "./components/Modal/";
import CourseDetail from "./components/CourseDetail/";
import ListView from "./components/ListView/";
import Skeleton from "./components/Skeleton/";
import SubjectToggles from "./components/SubjectToggles/";
import { getEventSources } from "./components/FormattingUtilities.js";
import semesterCodes from "../public/semesterCodes.json";

export default class App extends React.Component {
  fullCalendarRef = React.createRef();
  state = {
    fetchedEvents: [],
    isLoading: false,
    latestUpdatedEvent: new Date("1970-01-01"),
    showCalendar: true,
    showToggles: false,
    calendarWeekends: false,
    showModal: false,
    currentSemesterPosition: 10,
    currentlyFetchedSemesterPos: 0,
    currentCalendarDate: new Date(),
    currentToggles: [],
    resources: [],
    resourceType: "buildings",
    eventsVisible: [],
    view: "calendar",
    modalEvent: "",
    errorMessage: ""
  };
  componentDidMount() {
    window.React = this;
    let modalRoot = document.createElement("div");
    modalRoot.id = "modal-root";
    document.body.appendChild(modalRoot);
    let today = new Date();
    let todayPos = this.getSemesterPositionAtCalendarDate(today) + 1;
    let initialDate = new Date(semesterCodes[todayPos].startDate);
    this.setState({
      currentSemesterPosition: todayPos,
      currentCalendarDate: initialDate
    });
    this.fetchEvents(todayPos);
  }

  render() {
    const modal = this.state.showModal ? (
      <Modal
        modalRoot={document.getElementById("modal-root")}
        onClose={this.handleHide}
      >
        <div className="modal">
          <div className="modal-main">
            <FormStack isVisible={false} currentEvent={this.state.modalEvent} />
            <CourseDetail
              currentEvent={this.state.modalEvent}
              latestUpdateVisible={this.state.latestUpdatedEvent}
              showFinePrint={true}
            />
          </div>
        </div>
      </Modal>
    ) : null;

    const calendarView =
      this.state.view === "calendar" && this.state.showCalendar ? (
        <Calendar
          calendarRef={this.fullCalendarRef}
          className="the-full-calendar"
          state={this.state}
          goToSelectedSemester={this.goToSelectedSemester}
          toggleWeekends={this.toggleWeekends}
          handleShow={this.handleShow}
          semesterCodes={semesterCodes}
        />
      ) : null;

    const courselistingView =
      this.state.view === "courselistings" ? (
        <ListView
          events={this.state.eventsVisible}
          resourceType={this.state.resourceType}
          semester={
            this.state.currentlyFetchedSemesterPos !== 0
              ? semesterCodes[this.state.currentlyFetchedSemesterPos].value
              : "No Semester Data has been Fetched!"
          }
          onClick={this.handleShow}
        />
      ) : null;

    const skeleton = this.state.isLoading ? (
      <Modal
        modalRoot={document.getElementById("modal-root")}
        onClose={this.handleHide}
      >
        <div className="modal">
          <div className="modal-main">
            <Skeleton />
          </div>
        </div>
      </Modal>
    ) : null;

    const toggles = this.state.showToggles ? (
      <SubjectToggles
        currentToggles={this.state.currentToggles}
        eventSources={this.state.fetchedEvents}
        onChange={this.onToggleChange}
      />
    ) : null;
    return (
      <div className="planner-app">
        {modal}
        <div
          className={
            "planner-app-top " + this.state.resourceType + " " + this.state.view
          }
        >
          <div className="fc fc-media-screen fc-direction-ltr fc-theme-standard fc-liquid-hack">
            <div className="fc-button-group calendar-list">
              <Button
                className="calendar fc-previousSemester-button fc-button fc-button-primary"
                onClick={this.handleViewChange}
                name="CALENDAR"
              />
              <Button
                className="courselistings fc-thisSemester-button fc-button fc-button-primary"
                onClick={this.handleViewChange}
                name="LIST VIEW"
              />
            </div>
            <div className="fc-button-group">
              <Button
                className="buildings fc-previousSemester-button fc-button fc-button-primary"
                onClick={this.handleResourceChange}
                name="buildings"
              />
              <Button
                className="instructors fc-thisSemester-button fc-button fc-button-primary"
                onClick={this.handleResourceChange}
                name="instructors"
              />
              <Button
                className="courses fc-nextSemester-button fc-button fc-button-primary"
                onClick={this.handleResourceChange}
                name="courses"
              />
            </div>
            <div className="fc-button-group semester-navigation">
              <Button
                className="previous fc-previousSemester-button fc-button fc-button-primary"
                onClick={this.goToSelectedSemester}
                name=" < "
              />
              <Button
                id="current-semester-button"
                className="this fc-thisSemester-button current-semester-button fc-button fc-button-primary disabled"
                name={semesterCodes[this.state.currentSemesterPosition].value}
              />
              <Button
                className="next fc-nextSemester-button fc-button fc-button-primary"
                onClick={this.goToSelectedSemester}
                name=" > "
              />
            </div>
          </div>
        </div>
        <div className={"planner-app-top " + this.state.resourceType}>
          {toggles}
        </div>
        <div
          className={
            "main-display-area planner-app-calendar " +
            "show-detail-" +
            this.state.showModal.toString() +
            " show-loading-" +
            this.state.isLoading.toString() +
            " " +
            this.state.resourceType
          }
        >
          <label className="error">
            {this.state.errorMessage
              ? this.state.errorMessage +
                "\n\n Sorry! Bryan set this up to check 2 semesters ahead of today! \n\n Contact Assoc. Prof. Bryan Leister at bryan.leister@ucdenver.edu if you want him to change that..."
              : ""}
          </label>
          {calendarView} {skeleton} {courselistingView}
        </div>
      </div>
    );
  }
  handleShow = args => {
    let event = args.event;
    if (!event) {
      event = args;
    }
    this.setState({
      showModal: true,
      modalEvent: event
    });
  };
  handleHide = args => {
    this.setState({
      showModal: false,
      modalEvent: null
    });
  };
  goToSelectedSemester = args => {
    let buttonClicked = args.target.className;
    let p = 0;
    //Get the first class name from the button
    switch (buttonClicked.substr(0, buttonClicked.indexOf(" "))) {
      case "previous":
        p = p - 1;
        break;
      case "this":
        break;
      case "next":
        p = p + 1;
        break;
      default:
    }
    let pPos = this.state.currentSemesterPosition + p;
    if (pPos <= 0) {
      pPos = 0;
    }
    if (pPos >= semesterCodes.length - 3) {
      pPos = semesterCodes.length - 3;
    }
    let goToDate = semesterCodes[pPos].startDate;

    if (this.state.view === "calendar") {
      let calendarApi = this.fullCalendarRef.current.getApi();
      calendarApi.gotoDate(goToDate);
    }
    this.setState({
      currentSemesterPosition: pPos,
      currentCalendarDate: goToDate
    });
    this.fetchEvents(pPos);
  };
  handleResourceChange = args => {
    let buttonClicked = args.target.className;
    let resourceType = buttonClicked.substr(0, buttonClicked.indexOf(" "));
    let updateRawEvents = this.changeResourceType(resourceType);
    let rebuiltEvents = this.returnVisibleFromFetchedEvents(updateRawEvents);
    this.setState({
      resourceType: resourceType,
      fetchedEvents: updateRawEvents,
      eventsVisible: rebuiltEvents,
      resources: this.populateResources(rebuiltEvents, resourceType)
    });
    this.forceCalendarRefresh();
  };
  handleViewChange = args => {
    let buttonClicked = args.target.className;
    let view = buttonClicked.substr(0, buttonClicked.indexOf(" "));
    this.setState({
      view: view
    });
  };
  forceCalendarRefresh = () => {
    this.setState({
      showCalendar: false
    });
    setTimeout(function() {
      window.top.React.setState({
        showCalendar: true
      });
    }, 10);
  };
  onToggleChange = event => {
    const {
      target: { id, checked }
    } = event;

    //track the state of the toggles
    let trackedKeys = this.state.currentToggles;
    let match = trackedKeys.find(({ key }) => key === id);
    if (match) {
      match.checked = checked;
    } else {
      let t = { key: id, checked: checked };
      trackedKeys.push(t);
    }
    this.rebuildEventVisibility(checked, id);
    this.setState({
      currentToggles: trackedKeys
    });
  };
  rebuildEventVisibility = (checked, id) => {
    let updateRawEvents = this.state.fetchedEvents;
    for (let i = 0; i < updateRawEvents.length; i++) {
      if (updateRawEvents[i].id === id) {
        updateRawEvents[i].isVisible = checked;
      }
    }
    let rebuiltEvents = this.returnVisibleFromFetchedEvents(updateRawEvents);
    let resources = this.populateResources(
      rebuiltEvents,
      this.state.resourceType
    );
    this.setState({
      eventsVisible: rebuiltEvents,
      resources: resources
    });
  };

  toggleWeekends = () => {
    this.setState({
      calendarWeekends: !this.state.calendarWeekends
    });
  };
  getLatestUpdateDate(eventSources) {
    let latestUpdateDate = new Date("1970-01-01");
    for (let i = 0; i < eventSources.length; i++) {
      for (let j = 0; j < eventSources[i].events.length; j++) {
        let d = new Date(
          eventSources[i].events[j].extendedProps.last_data_updated_date
        );
        if (d > latestUpdateDate) {
          latestUpdateDate = d;
        }
      }
    }
    this.setState({
      latestUpdatedEvent: latestUpdateDate
    });
  }
  fetchEvents = semesterIndexPosition => {
    this.setState({
      isLoading: true,
      showToggles: false,
      showCalendar: false
    });
    //As of January 2021, CORS anywhere does not work...
    //Change PHP to Cron job and use static files in the public folder
    let fetchPhp =
      "./public/" + semesterCodes[semesterIndexPosition].key + ".json";

    // let fetchPhp =
    //   "https://designucd.com/fetching.php?term=" +
    //   semesterCodes[this.state.currentSemesterPosition].key +
    //   "&campus=DC";

    let error;
    ("There was an error loading the files!");

    fetch(fetchPhp, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .catch(err => {
        console.log(err);
        error = err.toString();
        this.setState({
          isLoading: false,
          errorMessage: error
        });
      })
      .then(data => {
        let fetchedEvents = getEventSources(data, this.state.currentToggles);
        let visibleEvents = this.returnVisibleFromFetchedEvents(fetchedEvents);
        let resources = this.populateResources(
          visibleEvents,
          this.state.resourceType
        );
        this.getLatestUpdateDate(fetchedEvents);
        this.getStudentTeacherCounts(fetchedEvents);
        this.setState({
          fetchedEvents: fetchedEvents,
          currentlyFetchedSemesterPos: this.state.currentSemesterPosition,
          eventsVisible: visibleEvents,
          resources: resources,
          isLoading: false,
          showToggles: true,
          errorMessage: error,
          showCalendar: true
        });
      });
  };
  getSemesterPositionAtCalendarDate = date => {
    let earliestSemester = new Date(
      semesterCodes[semesterCodes.length - 1].startDate
    );
    let currentPos = 0;
    for (let i = 0; i < semesterCodes.length; i++) {
      let d = new Date(semesterCodes[i].startDate);

      if (d < earliestSemester && d > date) {
        earliestSemester = d;
        currentPos = i - 1;
      }
    }
    this.setState({
      currentSemesterPosition: currentPos
    });
    return currentPos;
  };
  returnVisibleFromFetchedEvents = fetchedEvents => {
    let visibleEvents = [];
    for (let i = 0; i < fetchedEvents.length; i++) {
      if (fetchedEvents[i].isVisible) {
        visibleEvents.push(fetchedEvents[i]);
      }
    }
    return visibleEvents;
  };
  populateResources = (eventSources, resourceType) => {
    let resourceIds = [];
    let currentResources = [];
    for (let i = 0; i < eventSources.length; i++) {
      for (let j = 0; j < eventSources[i].events.length; j++) {
        let resource =
          eventSources[i].events[j].extendedProps.resourceIds.building;
        switch (resourceType) {
          case "instructors":
            resource =
              eventSources[i].events[j].extendedProps.resourceIds.instructor;
            break;
          case "courses":
            resource =
              eventSources[i].events[j].extendedProps.resourceIds.course;
            break;
          default:
        }
        if (!resourceIds.includes(resource.id)) {
          resourceIds.push(resource.id);
          currentResources.push(resource);
        }
      }
    }
    return currentResources;
  };
  changeResourceType = resourceType => {
    let eventSources = this.state.fetchedEvents;
    for (let i = 0; i < eventSources.length; i++) {
      for (let j = 0; j < eventSources[i].events.length; j++) {
        switch (resourceType) {
          case "buildings":
            eventSources[i].events[j].resourceId =
              eventSources[i].events[j].extendedProps.resourceIds.building.id;
            break;
          case "instructors":
            eventSources[i].events[j].resourceId =
              eventSources[i].events[j].extendedProps.resourceIds.instructor.id;
            break;
          case "courses":
            eventSources[i].events[j].resourceId =
              eventSources[i].events[j].extendedProps.resourceIds.course.id;
            break;
          default:
        }
      }
    }
    return eventSources;
  };
  getStudentTeacherCounts = eventList => {
    // console.log(
    //   "Data for " +
    //     semesterCodes[this.state.currentSemesterPosition].value +
    //     " excluding courses with 1 (Independent Studies).\n\n"
    // );

    console.log(
      "Excluding TA's and courses with 1 enrolled, i.e. Independent Studies (IS)\n" +
        "CAM totals also exclude MSMF, MSRA and ARTS courses\n\n" +
        semesterCodes[this.state.currentSemesterPosition].value +
        "\tSUBJECT\tINSTR\tENROL\tRATIO\tTA's\tIS\t"
    );

    let camTeacherCount = 0;
    let camStudentCount = 0;
    let camTACount = 0;
    let camISCount = 0;
    for (let i = 0; i < eventList.length; i++) {
      let teacherCount = 0;
      let studentCount = 0;
      let aidCount = 0;
      let isCount = 0;
      if (eventList[i].events.length > 0) {
        for (let j = 0; j < eventList[i].events.length; j++) {
          if (
            eventList[i].events[j].extendedProps.instructor_role_code === "PI"
          ) {
            if (eventList[i].events[j].extendedProps.enrollment_total == 1) {
              isCount++;
            }
            teacherCount++;
            studentCount +=
              eventList[i].events[j].extendedProps.enrollment_total;
          }

          if (
            eventList[i].events[j].extendedProps.instructor_role_code === "TA"
          ) {
            aidCount++;
          }
        }
      }

      let ratio = 0;
      if (studentCount > 0) {
        ratio = parseFloat(
          (studentCount - isCount) / (teacherCount - isCount)
        ).toFixed(2);
      }
      let mess =
        "            \t" +
        eventList[i].id +
        "\t" +
        teacherCount +
        "\t" +
        studentCount +
        "\t" +
        ratio +
        "\t" +
        aidCount +
        "\t" +
        isCount +
        "\t";
      console.log(mess);
      if (
        eventList[i].id != "MSMF" &&
        eventList[i].id != "MSRA" &&
        eventList[i].id != "ARTS"
      ) {
        camTeacherCount += teacherCount;
        camStudentCount += studentCount;
        camTACount += aidCount;
        camISCount += isCount;
      }
    }

    let camRatio = parseFloat(
      (camStudentCount - camISCount) / (camTeacherCount - camISCount)
    ).toFixed(2);
    console.log(
      "\n            \tCAM\t" +
        camTeacherCount +
        "\t" +
        camStudentCount +
        "\t" +
        camRatio +
        "\t" +
        camTACount +
        "\t" +
        camISCount +
        "\n\n"
    );
    //let today = new Date();
    //console.log(today);
  };
}
