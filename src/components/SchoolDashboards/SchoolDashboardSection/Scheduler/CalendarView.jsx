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
import api from "../../../../services/api"; // Import the configured axios instance

const CalendarView = () => {
  const user = useUser();
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEditor, setShowEditor] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    if (!user?.user?.id) {
      console.log("User not loaded yet, skipping fetch");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching events for user:", user.user);
      console.log("User school:", user.school);

      // Format dates properly for the API
      const startDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      );
      const endDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      );

      console.log("Date range:", {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });

      // Use the configured api instance which handles auth automatically
      const res = await api.get("/scheduler/events/", {
        params: {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        },
      });

      console.log("API Response:", res.data);

      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      const formattedEvents = data.map((event) => ({
        Id: event.id,
        Subject: event.title,
        StartTime: new Date(event.start_datetime),
        EndTime: new Date(event.end_datetime),
        Description: event.description || "",
        Location: event.location || "",
        IsAllDay: event.is_all_day || false,
        RecurrenceRule: event.recurrence_rule || "",
        CategoryColor: mapEventTypeToColor(event.event_type),
        TargetType: event.target_type,
        EventType: event.event_type,
        CustomData: event,
      }));

      console.log("Formatted events:", formattedEvents);
      setEvents(formattedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      console.error("Error response:", err.response);

      if (err.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else {
        setError(
          err.response?.data?.detail || err.message || "Failed to fetch events"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [selectedDate, user?.user?.id]);

  useEffect(() => {
    if (user?.user?.id) {
      fetchEvents();
    }
  }, [fetchEvents, user?.user?.id]);

  const handleEventClick = (args) => {
    console.log("Event clicked:", args);
    if (args.elementType === "event") {
      setSelectedEvent(args.data.CustomData);
      setShowEditor(true);
    }
  };

  const handleEventCreated = async (args) => {
    console.log("Creating event with args:", args);

    if (!args || typeof args !== "object") {
      console.error("Invalid event creation args:", args);
      return;
    }

    try {
      const newEvent = {
        title: args.Subject || args.subject || "New Event",
        description: args.Description || args.description || "",
        start_datetime: args.StartTime || args.startTime || new Date(),
        end_datetime: args.EndTime || args.endTime || new Date(),
        event_type: args.EventType || "general",
        location: args.Location || args.location || "",
        is_all_day: args.IsAllDay || args.isAllDay || false,
        target_type: args.TargetType || "all",
      };

      console.log("Sending new event:", newEvent);

      await api.post("/scheduler/events/", newEvent);
      await fetchEvents();
    } catch (err) {
      console.error("Error creating event:", err);
      console.error("Error response:", err.response);
      setError(err.response?.data?.detail || "Failed to create event");
    }
  };

  const handleEventUpdated = async (args) => {
    if (!args || !args.Id) {
      console.error("Invalid event update args:", args);
      return;
    }

    try {
      const updatedEvent = {
        title: args.Subject || args.subject,
        description: args.Description || args.description || "",
        start_datetime: args.StartTime || args.startTime,
        end_datetime: args.EndTime || args.endTime,
        event_type: args.EventType || args.eventType || "general",
        location: args.Location || args.location || "",
        is_all_day: args.IsAllDay || args.isAllDay || false,
        target_type: args.TargetType || args.targetType || "all",
      };

      console.log("Updating event:", updatedEvent);

      await api.patch(`/scheduler/events/${args.Id}/`, updatedEvent);
      await fetchEvents();
    } catch (err) {
      console.error("Error updating event:", err);
      setError(err.response?.data?.detail || "Failed to update event");
    }
  };

  const handleEventDeleted = async (args) => {
    if (!args || !args.Id) {
      console.error("Invalid event delete args:", args);
      return;
    }

    try {
      await api.delete(`/scheduler/events/${args.Id}/`);
      await fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      setError(err.response?.data?.detail || "Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div className="calendar-view">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading calendar events...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-view">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-red-500 text-lg mb-4">
            Error loading calendar: {error}
          </div>
          <button
            onClick={() => {
              setError(null);
              fetchEvents();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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

      {/* Debug info */}
      {import.meta.env.MODE === "development" && (
        <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
          <div>Events loaded: {events.length}</div>
          <div>User: {user?.user?.username}</div>
          <div>
            School: {user?.school?.name} (ID: {user?.school?.id})
          </div>
          <div>User Type: {user?.user?.user_type}</div>
        </div>
      )}

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
          actionBegin={(args) => {
            console.log("Action begin:", args.requestType, args);

            if (args.requestType === "eventCreate") {
              args.cancel = true;
              handleEventCreated(args.data[0]);
            } else if (args.requestType === "eventChange") {
              args.cancel = true;
              handleEventUpdated(args.data);
            } else if (args.requestType === "eventRemove") {
              args.cancel = true;
              handleEventDeleted(args.data[0]);
            }
          }}
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
