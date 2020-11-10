export const getEventSources = (data, eventToggles) => {
  let temp = rawEventsToDotSyntax(data);
  let courses = parseEventsToSubjectCodes(temp, eventToggles);
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
  let dupeCheck = [];
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
    if (tempStart === tempEnd) {
      tempStart = null;
      tempEnd = null;
      allDay = true;
    }
    const startTime = tempStart;
    const endTime = tempEnd;
    const startDate = course["CLASS_START_DATE"];
    const endDate = course["CLASS_END_DATE"];
    const startRecur = new Date(startDate);
    const endRecur = new Date(endDate);
    //let resourceId = course["BUILDING_ID"] + course["ROOM_NUMBER"].toString();
    let resourceId = course["BUILDING_ID"] + course["ROOM_NUMBER"];
    const daysOfWeek = getDaysOfWeek(course["STANDARD_MEETING_PATTERN"]);
    //const name = course["INSTRUCTOR_NAME"].split(",");
    let name = course["INSTRUCTOR_NAME"];
    if (name === null || name.length < 1) {
      name = "-";
    }
    let last = course["INSTRUCTOR_LAST_NAME"];
    if (last === null || last.length < 1) {
      last = "-";
    }
    if (course["SCHEDULE_PRINT"] !== "Y") {
      longtitle += " (H)";
    }
    const updatedAt = new Date(course["LAST_DATA_UPDATED_DATE"]);

    let buildId = course["BUILDING_ID"];
    if (buildId === null) {
      buildId = "D_NONE";
    }

    let room_conflict = false;
    let has_other_teacher = false;
    //Check for Room conflicts
    if (!allDay && startTime) {
      if (
        course["INSTRUCTOR_ROLE_CODE"] === "TA" ||
        course["INSTRUCTOR_ROLE_CODE"] === "SI"
      ) {
        has_other_teacher = true;
      }
      //This can be improved to convert to a class d and instructor email, that way a dupe is not a dupe if emails are the same for both classes
      let d =
        startTime +
        resourceId +
        course["STANDARD_MEETING_PATTERN"] +
        startRecur.getMonth() +
        startRecur.getFullYear() +
        course["SCHEDULE_PRINT"] +
        has_other_teacher;

      if (!dupeCheck.includes(d)) {
        dupeCheck.push(d);
      } else {
        if (
          course["BUILDING_ID"] === "D_ZOOM" ||
          course["BUILDING_ID"] === "HYBRID" ||
          course["BUILDING_ID"] === "D_REMOTE" ||
          course["SUBJECT_CODE"] === "PMUS" ||
          course["COMBINED_SECTION"] === "C" ||
          course["ACADEMIC_CAREER_CODE"] === "GRAD"
        ) {
          room_conflict = false;
        } else {
          room_conflict = true;
        }
      }
    }

    let color = colorBySubject(course["SUBJECT_CODE"], "36%", "54%");
    if (course["SCHEDULE_PRINT"] !== "Y") {
      color = colorBySubject(course["SUBJECT_CODE"], "26%", "84%");
    }

    key++;
    return {
      id: course["SUBJECT_CODE"],
      title: longtitle,
      startTime,
      endTime,
      startRecur,
      endRecur,
      resourceId,
      daysOfWeek,
      allDay,
      color,
      extendedProps: {
        course_title: course["COURSE_TITLE"],
        catalog_number: course["CATALOG_NUMBER"],
        subject_code: course["SUBJECT_CODE"],
        subject: course["SUBJECT"],
        class_section_code: course["CLASS_SECTION_CODE"].toString(),
        standard_meeting_pattern: course["STANDARD_MEETING_PATTERN"],
        meeting_time_start: course["MEETING_TIME_START"],
        meeting_time_end: course["MEETING_TIME_END"],
        class_start_date: course["CLASS_START_DATE"],
        building_id: buildId,
        room_number: course["ROOM_NUMBER"],
        course_id: course["COURSE_ID"],
        academic_career_code: course["ACADEMIC_CAREER_CODE"],
        academic_organization_code: course["ACADEMIC_ORGANIZATION_CODE"],
        instructor_name: course["INSTRUCTOR_NAME"],
        instructor_email: course["INSTRUCTOR_EMAIL"],
        last_name: last,
        instructor_role_code: course["INSTRUCTOR_ROLE_CODE"],
        instructor_mode_code: course["INSTRUCTOR_MODE_CODE"],
        instructor_load_factor: course["INSTRUCTOR_LOAD_FACTOR"],
        instructor_empl_id: course["INSTRUCTOR_EMPL_ID"],
        grade_restriction_access: course["GRADE_RESTRICTION_ACCESS"],
        instructor_assignment_number: course["INSTRUCTOR_ASSIGNMENT_NUMBER"],
        room_cap_request: course["ROOM_CAP_REQUEST"],
        consent: course["CONSENT"],
        student_special_perm: course["STUDENT_SPEC_PERM"],
        campus_code: course["CAMPUS_CODE"],
        term_code: course["TERM_CODE"],
        combined_section: course["COMBINED_SECTION"],
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
        last_data_updated_date: updatedAt,
        class_number: course["CLASS_NUMBER"].toString(),
        room_conflict: room_conflict,
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
  let buildId = course["BUILDING_ID"];
  if (buildId === null) {
    buildId = "D_NULL";
  }
  const id = buildId + course["ROOM_NUMBER"];
  const title =
    buildId.substring(buildId.length - 4) + " " + course["ROOM_NUMBER"];
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
  const id = course["INSTRUCTOR_EMPL_ID"];
  const title = course["INSTRUCTOR_NAME"];

  const resource = course["INSTRUCTOR_LAST_NAME"];
  return {
    id,
    title,
    resource,
    extendedProps: {}
  };
}
// function getUniqueEvents(events) {
//   let areas = [];
//   for (let i = 0; i < events.length; i++) {
//     let eventIds = [];
//     let uniqueEvents = [];
//     for (let j = 0; j < events[i].events.length; j++) {
//       if (!eventIds.includes(events[i].events[j].extendedProps.key)) {
//         eventIds.push(events[i].events[j].extendedProps.key);
//         uniqueEvents.push(events[i].events[j]);
//       }
//     }
//     areas.push({ id: events[i].id, events: uniqueEvents });
//   }
//
//   //console.log(temp);
//   return areas;
// }
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
