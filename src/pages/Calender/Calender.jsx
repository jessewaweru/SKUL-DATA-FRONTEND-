import "../Calender/calender.css";
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import axios from "axios";
import { useEffect, useState } from "react";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState("general");

  useEffect(() => {
    axios
      .get("http://localhost:8000/scheduler/school-events/")
      .then((res) => {
        const mappedEvents = res.data.map((event) => ({
          Id: event.id,
          Subject: event.title,
          Description: event.description,
          StartTime: new Date(event.start_time),
          EndTime: new Date(event.end_time),
          CategoryColor: mapEventTypeToColor(event.event_type),
        }));
        setEvents(mappedEvents);
      })
      .catch((error) => {
        console.error("Error fetching calender events:", error);
      });
  }, []);

  const handleActionBegin = async (args) => {
    if (args.requestType === "eventCreate") {
      const newEvent = args.data[0];
      try {
        const response = await axios.post(
          "http://localhost:8000/scheduler/create-event/",
          {
            title: newEvent.Subject,
            description: newEvent.Description,
            start_time: newEvent.StartTime,
            end_time: newEvent.EndTime,
            event_type: selectedEventType,
          }
        );
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            ...newEvent,
            Id: response.data.id,
            CategoryColor: mapEventTypeToColor(selectedEventType),
          },
        ]);
      } catch (error) {
        console.error("Error creating event:", error);
      }
    }
    if (args.requestType === "eventChange") {
      const updated = args.data;
      try {
        await axios.put(
          `http://localhost:8000/scheduler/update-event/${updated.Id}/`,
          {
            title: updated.Subject,
            description: updated.Description,
            start_time: updated.StartTime,
            end_time: updated.EndTime,
            event_type: selectedEventType,
          }
        );
      } catch (error) {
        console.error("Error updating event:", error);
      }
    }
    if (args.requestType === "eventRemove") {
      const deleted = args.data[0];
      try {
        await axios.delete(
          `http://localhost:8000/scheduler/delete-event/${deleted.Id}/`
        );
      } catch (err) {
        console.error("Error deleting event", err);
      }
    }
  };

  const handlePopupOpen = (args) => {
    if (args.type === "QuickInfo") {
      setTimeout(() => {
        const popup = document.querySelector(".e-popup-content");
        if (popup && popup.querySelector("#eventTypeDropdown")) {
          const label = document.createElement("label");
          label.innerText = "Event Type";
          label.style.marginTop = "10px";
          label.style.display = "block";

          const select = document.createElement("select");
          select.id = "eventTypeDropdown";
          select.style.marginTop = "5px";
          select.style.width = "100%";
          select.style.padding = "5px";

          const options = [
            "general",
            "meeting",
            "exam",
            "holiday",
            "announcement",
          ];
          options.forEach((type) => {
            const option = document.createElement("option");
            option.value = type;
            option.innerText = type.charAt(0).toUpperCase() + type.slice(1);
            select.appendChild(option);
          });
          select.addEventListener("change", (e) => {
            setSelectedEventType(e.target.value);
          });

          popup.appendChild(label);
          popup.appendChild(select);
        }
      }, 0); // small delay to ensure DOM is ready
    }
  };

  return (
    <div className="calendar-container">
      <div className="custom-calendar-header">
        <p className="calendar-subtitle">App</p>
        <h2 className="calendar-title">Calendar</h2>
      </div>

      <ScheduleComponent
        height="650px"
        selectedDate={new Date()}
        eventSettings={{
          dataSource: events,
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
        }}
        actionBegin={handleActionBegin}
        popupOpen={handlePopupOpen}
      >
        <Inject
          services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
        />
      </ScheduleComponent>
    </div>
  );
};
const mapEventTypeToColor = (type) => {
  switch (type) {
    case "exam":
      return "#f57f17";
    case "meeting":
      return "#3949ab";
    case "holiday":
      return "#00acc1";
    case "announcement":
      return "#7e57c2";
    default:
      return "#43a047"; // general
  }
};
export default Calendar;
