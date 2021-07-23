export const getEventSources = (data, eventToggles) => {
  let temp = rawEventsToDotSyntax(data);
  let checked = checkForOverlappingEvents(temp);
  let courses = parseEventsToSubjectCodes(
    removeEmptyPastClasses(checked),
    eventToggles
  );

  //console.log(checked);

  return courses;
};
export const colorBySubject = (area, saturation, lightness) => {
  let color = "hsl(200,20%,20%)";
  switch (area) {
    case "FINE":
      color = "hsl(140," + saturation + "," + lightness + ")";
      break;
    case "MUSC":
      color = "hsl(176," + saturation + "," + lightness + ")";
      break;
    case "FITV":
      color = "hsl(199," + saturation + "," + lightness + ")";
      break;
    case "PMUS":
      color = "hsl(176," + saturation + "," + lightness + ")";
      break;
    case "MSRA":
      color = "hsl(176," + saturation + "," + lightness + ")";
      break;
    case "DACD":
      color = "hsl(140," + saturation + "," + lightness + ")";
      break;
    case "ARTS":
      color = "hsl(140," + saturation + "," + lightness + ")";
      break;
    default:
    // code block
  }
  return color.toString();
};
export const formatAMPM = date => {
  if (!date) {
    return "-";
  }
  var hours = date.substring(0, 2);
  var minutes = date.substring(3, 5);
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  //minutes = minutes < 10 ? '0' + minutes : minutes
  var strTime = hours + ":" + minutes + " " + ampm;
  //var strTime = hours + ":" + minutes;
  return strTime;
};
export const displayTime = (start, end, allday) => {
  let time = "";
  if (!allday && start.length > 2) {
    time = formatAMPM(start) + " to " + formatAMPM(end);
  }
  return time;
};

function rawEventsToDotSyntax(courses) {
  //let dupeCheck = [];
  let key = 0;
  return courses.map(course => {
    let longtitle =
      course["CATALOG_NUMBER"] +
      "." +
      course["CLASS_SECTION_CODE"].toString() +
      " " +
      course["COURSE_TITLE"];

    let allDay = false;
    let tempStart = course["MEETING_TIME_START"];
    let tempEnd = course["MEETING_TIME_END"];
    if (tempStart == tempEnd) {
      tempStart = null; //This needs to be null to display across seeral days in Calendar view
      tempEnd = null;
      allDay = true;
      //console.log(course);
      //console.log(tempEnd);
    }

    const daysOfWeek = getDaysOfWeek(
      course["STANDARD_MEETING_PATTERN"] ?? "ASYNC"
    );

    if (course["SCHEDULE_PRINT"] !== "Y") {
      longtitle += " (H)";
    }

    let color = colorBySubject(course["SUBJECT_CODE"], "36%", "54%");
    if (course["SCHEDULE_PRINT"] !== "Y") {
      color = colorBySubject(course["SUBJECT_CODE"], "26%", "84%");
    }
    key++;
    return {
      id: course["SUBJECT_CODE"],
      title: longtitle,
      startTime: tempStart,
      endTime: tempEnd,
      startRecur: new Date(course["CLASS_START_DATE"]),
      endRecur: new Date(course["CLASS_END_DATE"]),
      resourceId:
        (course["BUILDING_ID"] ?? "Z_NONE") +
        (course["ROOM_NUMBER"] ?? "ONLINE"),
      daysOfWeek,
      allDay,
      color,
      extendedProps: {
        course_title: course["COURSE_TITLE"],
        catalog_number: course["CATALOG_NUMBER"],
        subject_code: course["SUBJECT_CODE"],
        subject: course["SUBJECT"],
        class_section_code: course["CLASS_SECTION_CODE"].toString(),
        standard_meeting_pattern: course["STANDARD_MEETING_PATTERN"] ?? "ASYNC",
        meeting_time_start: course["MEETING_TIME_START"],
        meeting_time_end: course["MEETING_TIME_END"],
        class_start_date: course["CLASS_START_DATE"],
        building_id: course["BUILDING_ID"] ?? "Z_NONE",
        room_number: course["ROOM_NUMBER"] ?? "ONLINE",
        course_id: course["COURSE_ID"],
        academic_career_code: course["ACADEMIC_CAREER_CODE"],
        academic_organization_code: course["ACADEMIC_ORGANIZATION_CODE"],
        instructor_name: course["INSTRUCTOR_NAME"] ?? "-",
        instructor_email: course["INSTRUCTOR_EMAIL"] ?? "-",
        last_name: course["INSTRUCTOR_LAST_NAME"] ?? "-",
        instructor_role_code: course["INSTRUCTOR_ROLE_CODE"] ?? "-",
        instructor_mode_code: course["INSTRUCTOR_MODE_CODE"] ?? "-",
        instructor_load_factor: course["INSTRUCTOR_LOAD_FACTOR"],
        instructor_empl_id: course["INSTRUCTOR_EMPL_ID"] ?? key.toString(),
        grade_restriction_access: course["GRADE_RESTRICTION_ACCESS"],
        instructor_assignment_number: course["INSTRUCTOR_ASSIGNMENT_NUMBER"],
        room_cap_request: course["ROOM_CAP_REQUEST"],
        consent: course["CONSENT"],
        student_special_perm: course["STUDENT_SPEC_PERM"],
        campus_code: course["CAMPUS_CODE"],
        term_code: course["TERM_CODE"],
        combined_section: course["COMBINED_SECTION"] ?? "N",
        section_combined_description: course["SECTION_COMBINED_DESCRIPTION"],
        section_combined_code: course["SECTION_COMBINED_CODE"],
        course_topic: course["COURSE_TOPIC"],
        schedule_print: course["SCHEDULE_PRINT"],
        class_status: course["CLASS_STATUS"],
        course_offer_number: course["COURSE_OFFER_NUMBER"],
        enrollment_cap: course["ENROLLMENT_CAP"],
        enrollment_total: course["ENROLLMENT_TOTAL"],
        wait_total: course["WAIT_TOTAL"],
        wait_cap: course["WAIT_CAP"],
        color: color,
        last_data_updated_date: new Date(course["LAST_DATA_UPDATED_DATE"]),
        class_number: course["CLASS_NUMBER"].toString(),
        room_conflict: false,
        key: key.toString(),
        resourceIds: {
          building: formatBuildingID(course),
          course: formatCourseID(course),
          instructor: formatInstructorID(course)
        }
      }
    };
  });
}
function parseEventsToSubjectCodes(courses, eventToggles) {
  let subjectCodeIDs = [];
  let subjectCodes = [];
  for (let i = 0; i < courses.length; i++) {
    if (!subjectCodeIDs.includes(courses[i].extendedProps.subject_code)) {
      subjectCodeIDs.push(courses[i].extendedProps.subject_code);
      subjectCodes.push({
        id: courses[i].extendedProps.subject_code,
        name: courses[i].extendedProps.subject
      });
    }
  }
  let eventSources = [];
  for (let i = 0; i < subjectCodes.length; i++) {
    let id = subjectCodes[i].id;
    let name = subjectCodes[i].name;
    let source = {
      events: [],
      id: id,
      name: name,
      isVisible: eventToggles.find(({ key }) => key === subjectCodes[i].id)
        ? eventToggles.find(({ key }) => key === subjectCodes[i].id).checked
        : true
    };
    eventSources.push(source);
  }

  for (let i = 0; i < courses.length; i++) {
    for (let j = 0; j < eventSources.length; j++) {
      if (courses[i].id === eventSources[j].id) {
        eventSources[j].events.push(courses[i]);
      }
    }
  }

  let temp = [];
  for (let i = 0; i < eventSources.length; i++) {
    if (eventSources[i].events.length > 1) {
      temp.push(eventSources[i]);
    }
  }
  //console.log(temp);
  return temp;
}
function formatBuildingID(course) {
  //console.log("Building is" + course["BUILDING_ID"]);
  const buildId = course["BUILDING_ID"] ?? "Z_NONE";
  const id = buildId + (course["ROOM_NUMBER"] ?? "ONLINE");
  const title =
    buildId.substring(buildId.length - 4) +
    " " +
    (course["ROOM_NUMBER"] ?? "ONLINE");
  const resource = buildId.substring(buildId.length - 4);
  return {
    id,
    title,
    resource,
    extendedProps: {}
  };
}
function formatCourseID(course) {
  const id = course["COURSE_ID"];
  const title = course["COURSE_TITLE"];
  const resource = course["SUBJECT_CODE"] + " " + course["CATALOG_NUMBER"];
  return {
    id,
    title,
    resource,
    extendedProps: {}
  };
}
function formatInstructorID(course) {
  const id = course["INSTRUCTOR_EMPL_ID"] ?? "0000";
  const title = course["INSTRUCTOR_NAME"] ?? "-";

  const resource = course["INSTRUCTOR_LAST_NAME"] ?? "-";
  return {
    id,
    title,
    resource,
    extendedProps: {}
  };
}

function removeEmptyPastClasses(events) {
  let today = new Date();
  today.setDate(today.getDate() - 60);
  let temp = [];
  //console.log(today);
  for (let i = 0; i < events.length; i++) {
    if (
      events[i].startRecur > today ||
      parseInt(events[i].extendedProps.enrollment_total) >= 1
    ) {
      temp.push(events[i]);
    }
  }
  //console.log("Started with " + events.length + ", returned " + temp.length);
  return temp;
}

function getDaysOfWeek(meetingPattern) {
  let dow = [1];
  switch (meetingPattern) {
    case "TTH":
      dow = [2, 4];
      break;
    case "F":
      dow = [5];
      break;
    case "MW":
      dow = [1, 3];
      break;
    case "W":
      dow = [3];
      break;
    case "M":
      dow = [1];
      break;
    case "S":
      dow = [6];
      break;
    case "TH":
      dow = [4];
      break;
    case "T":
      dow = [2];
      break;
    default:
  }
  return dow;
}

function checkForOverlappingEvents(events) {
  const targetEvents = events.sort((a, b) =>
    a.resourceId.localeCompare(b.resourceId)
  );

  //  const targetEvents = events;
  for (let i = 0; i < targetEvents.length; i++) {
    const startMoment = new Date(
      Date.parse("1970/01/01 " + targetEvents[i].startTime)
    );
    const endMoment = new Date(
      Date.parse("1970/01/01 " + targetEvents[i].endTime)
    );
    const classId = parseInt(targetEvents[i].extendedProps.class_number);
    const subject = targetEvents[i].extendedProps.subject_code;
    const resource = targetEvents[i].resourceId;
    const meeting = targetEvents[i].extendedProps.standard_meeting_pattern;
    const combined = targetEvents[i].extendedProps.combined_section;
    const instructor = targetEvents[i].extendedProps.instructor_empl_id;

    for (let j = 0; j < targetEvents.length; j++) {
      let courseInt = parseInt(targetEvents[j].extendedProps.class_number);
      let paddedEndTime = new Date(
        Date.parse("1970/01/01 " + targetEvents[j].endTime)
      );
      if (
        !targetEvents[j].allDay &&
        instructor != targetEvents[j].extendedProps.instructor_empl_id &&
        targetEvents[j].extendedProps.schedule_print == "Y" &&
        targetEvents[i].extendedProps.schedule_print == "Y" &&
        meeting == targetEvents[j].extendedProps.standard_meeting_pattern &&
        resource == targetEvents[j].resourceId &&
        classId != courseInt &&
        targetEvents[j].extendedProps.subject_code != "PMUS" &&
        !targetEvents[j].extendedProps.room_conflict &&
        targetEvents[j].resourceId != "D_ZOOMZOOM" &&
        targetEvents[j].resourceId != "D_ONLNONLINE" &&
        targetEvents[j].resourceId != "Z_NONEONLINE" &&
        startMoment >= Date.parse("1970/01/01 " + targetEvents[j].startTime) &&
        endMoment <= paddedEndTime.setMinutes(paddedEndTime.getMinutes() + 46)
      ) {
        targetEvents[j].extendedProps.room_conflict = true;
      }
    }
  }
  return targetEvents;
  //console.log(targetEvents);
}
