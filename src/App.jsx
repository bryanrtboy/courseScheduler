import React from "react";
import "./index.css";

import Calendar from "./components/Calendar/";
import Button from "./components/Button/";
import FormStackButton from "./components/FormStackButton/";
import Modal from "./components/Modal/";
import CourseDetail from "./components/CourseDetail/";
import ListView from "./components/ListView/";
import Skeleton from "./components/Skeleton/";
import SubjectToggles from "./components/SubjectToggles/";
import { getEventSources } from "./components/FormattingUtilities.js";
import semesterCodes from "./data/semesterCodes.json";

export default class App extends React.Component {
  fullCalendarRef = React.createRef();
  state = {
    allEventsBySubj: [],
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
    events: [],
    view: "calendar",
    modalEvent: ""
  };
  componentDidMount() {
    window.React = this;
    let modalRoot = document.createElement("div");
    modalRoot.id = "modal-root";
    document.body.appendChild(modalRoot);
    let today = new Date();
    let todayPos = this.getSemesterPositionAtCalendarDate(today);
    this.setState({
      currentSemesterPosition: todayPos
    });
  }

  render() {
    const modal = this.state.showModal ? (
      <Modal
        modalRoot={document.getElementById("modal-root")}
        onClose={this.handleHide}
      >
        <div className="modal">
          <div className="modal-main">
            <FormStackButton
              isVisible={false}
              currentEvent={this.state.modalEvent}
            />{" "}
            <CourseDetail
              currentEvent={this.state.modalEvent}
              latestUpdateVisible={this.state.latestUpdatedEvent}
              showFinePrint={true}
            />{" "}
          </div>{" "}
        </div>{" "}
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
          events={this.state.events}
          resourceType={this.state.resourceType}
          semester={semesterCodes[this.state.currentlyFetchedSemesterPos].value}
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
          </div>{" "}
        </div>{" "}
      </Modal>
    ) : null;

    const toggles = this.state.showToggles ? (
      <SubjectToggles
        currentToggles={this.state.currentToggles}
        eventSources={this.state.allEventsBySubj}
        onChange={this.onToggleChange}
      />
    ) : null;

    return (
      <div className="planner-app">
        {" "}
        {modal}{" "}
        <div
          className={
            "planner-app-top " + this.state.resourceType + " " + this.state.view
          }
        >
          <div className="fc fc-media-screen fc-direction-ltr fc-theme-standard fc-liquid-hack">
            <div className="fc-button-group">
              <Button
                className="calendar fc-previousSemester-button fc-button fc-button-primary"
                onClick={this.handleViewChange}
                name="calendar"
              />
              <Button
                className="courselistings fc-thisSemester-button fc-button fc-button-primary"
                onClick={this.handleViewChange}
                name="list view"
              />
            </div>{" "}
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
            </div>{" "}
            <div className="fc-button-group semester-navigation">
              <Button
                className="previous fc-previousSemester-button fc-button fc-button-primary"
                onClick={this.goToSelectedSemester}
                name=" < "
              />
              <Button
                className="this fc-thisSemester-button fc-button fc-button-primary"
                onClick={
                  this.state.currentlyFetchedSemesterPos !==
                  this.state.currentSemesterPosition
                    ? this.fetchEvents
                    : null
                }
                name={
                  this.state.currentlyFetchedSemesterPos ===
                  this.state.currentSemesterPosition
                    ? semesterCodes[this.state.currentSemesterPosition].value
                    : "Get Data for " +
                      semesterCodes[this.state.currentSemesterPosition].value
                }
              />{" "}
              <Button
                className="next fc-nextSemester-button fc-button fc-button-primary"
                onClick={this.goToSelectedSemester}
                name=" > "
              />
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className={"planner-app-top " + this.state.resourceType}>
          {" "}
          {toggles}{" "}
        </div>{" "}
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
          {" "}
          {calendarView} {skeleton} {courselistingView}{" "}
        </div>{" "}
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
    if (pPos <= 2) {
      pPos = 2;
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
  };
  handleResourceChange = args => {
    let buttonClicked = args.target.className;
    let resourceType = buttonClicked.substr(0, buttonClicked.indexOf(" "));
    let updateRawEvents = this.changeResourceType(resourceType);
    let rebuiltEvents = [];
    for (let i = 0; i < updateRawEvents.length; i++) {
      if (updateRawEvents[i].isVisible) {
        rebuiltEvents.push(updateRawEvents[i]);
      }
    }
    //console.log("Getting the " + resourceType);
    //Get the data and format based on new resources type
    this.setState({
      resourceType: resourceType,
      allEventsBySubj: updateRawEvents,
      events: rebuiltEvents,
      resources: this.populateResources(rebuiltEvents, resourceType)
    });
    //  this.updateToggleStates();
    this.forceCalendarRefresh();
  };
  handleViewChange = args => {
    let buttonClicked = args.target.className;
    let view = buttonClicked.substr(0, buttonClicked.indexOf(" "));
    this.setState({
      view: view
    });
    this.forceCalendarRefresh();
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
    //console.log(event);
    let updateRawEvents = this.state.allEventsBySubj;
    for (let i = 0; i < updateRawEvents.length; i++) {
      if (updateRawEvents[i].id === id) {
        updateRawEvents[i].isVisible = checked;
      }
    }
    let rebuiltEvents = [];
    for (let i = 0; i < updateRawEvents.length; i++) {
      if (updateRawEvents[i].isVisible) {
        rebuiltEvents.push(updateRawEvents[i]);
      }
    }
    let resources = this.populateResources(
      rebuiltEvents,
      this.state.resourceType
    );
    this.setState({
      events: rebuiltEvents,
      rawEvents: updateRawEvents,
      currentToggles: trackedKeys,
      resources: resources
    });
  };
  toggleWeekends = () => {
    this.setState({
      calendarWeekends: !this.state.calendarWeekends
    });
  };
  handleDateClick = arg => {
    // if (confirm("Would you like to add an event to " + arg.dateStr + " ?")) {
    //   this.setState({
    //     events: this.state.events.concat({
    //       title: "New Event",
    //       start: arg.date,
    //       allDay: arg.allDay
    //     })
    //   });
    // }
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
  fetchEvents = () => {
    this.setState({
      isLoading: true,
      showToggles: false
    });
    //https://cors-anywhere.herokuapp.com/

    let fetchPhp =
      "https://www.bryanleister.com/fetching.php?term=" +
      semesterCodes[this.state.currentSemesterPosition].key +
      "&campus=DC";

    fetch(fetchPhp)
      .then(response => response.json())
      .then(data => {
        let eventSources = getEventSources(data, this.state.currentToggles);
        let resources = this.populateResources(
          eventSources,
          this.state.resourceType
        );
        this.getLatestUpdateDate(eventSources);
        let eventCount = 0;
        for (let i = 0; i < eventSources.length; i++) {
          eventCount += eventSources[i].events.length;
        }
        console.log(
          "Found " +
            eventSources.length +
            " subjects, " +
            eventCount +
            "  events and " +
            resources.length +
            " resources."
        );
        this.setState({
          allEventsBySubj: eventSources,
          currentlyFetchedSemesterPos: this.state.currentSemesterPosition,
          events: eventSources,
          resources: resources,
          isLoading: false,
          showToggles: true
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
    let eventSources = this.state.allEventsBySubj;
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
}
