import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiSave } from "react-icons/fi";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "../Scheduler/scheduler.css";

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [termStart, setTermStart] = useState(dayjs());
  const [termEnd, setTermEnd] = useState(dayjs().add(3, "month"));
  const [termMessage, setTermMessage] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/scheduler/events/");
      const eventsData = Array.isArray(res.data) ? res.data : [];
      setEvents(eventsData);
      setFilteredEvents(eventsData);
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...currentEvent,
        start_datetime: dayjs(currentEvent.start_datetime).format(),
        end_datetime: dayjs(currentEvent.end_datetime).format(),
      };

      if (currentEvent.id) {
        await axios.patch(`/api/scheduler/events/${currentEvent.id}/`, payload);
      } else {
        await axios.post("/api/scheduler/events/", payload);
      }

      setOpenDialog(false);
      fetchEvents();
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSetTerm = async () => {
    try {
      await axios.post("/api/scheduler/set-current-term/", {
        term_start: termStart.format("YYYY-MM-DD"),
        term_end: termEnd.format("YYYY-MM-DD"),
      });
      setTermMessage("Current term successfully updated.");
    } catch (err) {
      console.error("Error setting current term:", err);
      setTermMessage("Failed to update current term.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/scheduler/events/${id}/`);
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!Array.isArray(events)) return setFilteredEvents([]);
    let results = [...events];

    if (searchTerm) {
      results = results.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (eventTypeFilter !== "all") {
      results = results.filter((event) => event.event_type === eventTypeFilter);
    }

    setFilteredEvents(results);
  }, [searchTerm, eventTypeFilter, events]);

  const createNewEventTemplate = () => ({
    title: "",
    description: "",
    start_datetime: dayjs(),
    end_datetime: dayjs().add(1, "hour"),
    event_type: "general",
    target_type: "all",
    location: "",
    is_all_day: false,
  });

  return (
    <div className="event-management">
      <div className="management-header">
        <h2>Event Management & Current Term</h2>
        <Button
          startIcon={<FiPlus />}
          onClick={() => {
            setCurrentEvent(createNewEventTemplate());
            setOpenDialog(true);
          }}
          variant="contained"
        >
          Add Event
        </Button>
      </div>

      <div className="term-form" style={{ marginTop: 20, marginBottom: 20 }}>
        <h4>Set Current Term</h4>
        <DateTimePicker
          label="Term Start"
          value={termStart}
          onChange={(date) => setTermStart(date)}
        />
        <DateTimePicker
          label="Term End"
          value={termEnd}
          onChange={(date) => setTermEnd(date)}
          minDateTime={termStart}
        />
        <Button onClick={handleSetTerm} variant="contained" color="secondary">
          Save Term
        </Button>
        {termMessage && <Alert severity="info">{termMessage}</Alert>}
      </div>

      <div className="filters">
        <TextField
          label="Search Events"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <FormControl>
          <InputLabel>Event Type</InputLabel>
          <Select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="general">General</MenuItem>
            <MenuItem value="exam">Exam</MenuItem>
            <MenuItem value="holiday">Holiday</MenuItem>
            <MenuItem value="announcement">Announcement</MenuItem>
          </Select>
        </FormControl>
      </div>

      <TableContainer component={Paper} className="events-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No events found
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.event_type}</TableCell>
                  <TableCell>
                    {new Date(event.start_datetime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(event.end_datetime).toLocaleString()}
                  </TableCell>
                  <TableCell>{event.target_type}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setCurrentEvent({
                          ...event,
                          start_datetime: dayjs(event.start_datetime),
                          end_datetime: dayjs(event.end_datetime),
                        });
                        setOpenDialog(true);
                      }}
                    >
                      <FiEdit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(event.id)}>
                      <FiTrash2 />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {currentEvent?.id ? "Edit Event" : "Create Event"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            fullWidth
            value={currentEvent?.title || ""}
            onChange={handleInputChange}
            margin="normal"
          />

          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={2}
            value={currentEvent?.description || ""}
            onChange={handleInputChange}
            margin="normal"
          />

          <DateTimePicker
            label="Start"
            value={currentEvent?.start_datetime}
            onChange={(date) =>
              setCurrentEvent((prev) => ({ ...prev, start_datetime: date }))
            }
            slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
          />

          <DateTimePicker
            label="End"
            value={currentEvent?.end_datetime}
            onChange={(date) =>
              setCurrentEvent((prev) => ({ ...prev, end_datetime: date }))
            }
            slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
            minDateTime={currentEvent?.start_datetime}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Event Type</InputLabel>
            <Select
              name="event_type"
              value={currentEvent?.event_type || "general"}
              onChange={handleInputChange}
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="exam">Exam</MenuItem>
              <MenuItem value="holiday">Holiday</MenuItem>
              <MenuItem value="announcement">Announcement</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<FiSave />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EventManagement;
