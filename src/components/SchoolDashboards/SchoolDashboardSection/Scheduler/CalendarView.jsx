import { useEffect, useState, useCallback } from "react";
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
import useUser from "../../../../hooks/useUser";
import EventEditor from "./EventEditor";
import CalendarToolbar from "./CalendarToolbar";
import "../Scheduler/scheduler.css";

const CalendarView = () => {
  const user = useUser();
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEditor, setShowEditor] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get("/api/scheduler/events/", {
        params: {
          start_date: selectedDate.toISOString(),
          end_date: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth() + 1,
            0
          ).toISOString(),
        },
      });

      const formattedEvents = res.data.map((event) => ({
        Id: event.id,
        Subject: event.title,
        StartTime: new Date(event.start_datetime),
        EndTime: new Date(event.end_datetime),
        Description: event.description,
        Location: event.location,
        IsAllDay: event.is_all_day,
        RecurrenceRule: event.recurrence_rule,
        CategoryColor: mapEventTypeToColor(event.event_type),
        TargetType: event.target_type,
        CustomData: event, // Store full event data
      }));

      setEvents(formattedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventClick = (args) => {
    if (args.elementType === "event") {
      setSelectedEvent(args.data.CustomData);
      setShowEditor(true);
    }
  };

  const handleEventCreated = async (args) => {
    try {
      const newEvent = {
        title: args.Subject,
        description: args.Description,
        start_datetime: args.StartTime,
        end_datetime: args.EndTime,
        event_type: args.EventType || "general",
        location: args.Location,
        is_all_day: args.IsAllDay,
        target_type: args.TargetType || "all",
      };

      await axios.post("/api/scheduler/events/", newEvent);
      fetchEvents();
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  const handleEventUpdated = async (args) => {
    try {
      const updatedEvent = {
        title: args.Subject,
        description: args.Description,
        start_datetime: args.StartTime,
        end_datetime: args.EndTime,
        event_type: args.EventType,
        location: args.Location,
        is_all_day: args.IsAllDay,
        target_type: args.TargetType,
      };

      await axios.patch(`/api/scheduler/events/${args.Id}/`, updatedEvent);
      fetchEvents();
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  const handleEventDeleted = async (args) => {
    try {
      await axios.delete(`/api/scheduler/events/${args.Id}/`);
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  return (
    <div className="calendar-view">
      <CalendarToolbar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onAddEvent={() => {
          setSelectedEvent(null);
          setShowEditor(true);
        }}
      />

      <div className="calendar-container">
        <ScheduleComponent
          height="650px"
          selectedDate={selectedDate}
          eventSettings={{
            dataSource: events,
            fields: {
              id: "Id",
              subject: { name: "Subject" },
              startTime: { name: "StartTime" },
              endTime: { name: "EndTime" },
              description: { name: "Description" },
              location: { name: "Location" },
              isAllDay: { name: "IsAllDay" },
              recurrenceRule: { name: "RecurrenceRule" },
            },
          }}
          eventClick={handleEventClick}
          created={handleEventCreated}
          changed={handleEventUpdated}
          deleted={handleEventDeleted}
        >
          <Inject
            services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
          />
        </ScheduleComponent>
      </div>

      {showEditor && (
        <EventEditor
          event={selectedEvent}
          onClose={() => setShowEditor(false)}
          onSave={() => {
            setShowEditor(false);
            fetchEvents();
          }}
          user={user}
        />
      )}
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
    case "parent_event":
      return "#43a047";
    case "staff_event":
      return "#e53935";
    default:
      return "#8e24aa"; // general
  }
};

export default CalendarView;
