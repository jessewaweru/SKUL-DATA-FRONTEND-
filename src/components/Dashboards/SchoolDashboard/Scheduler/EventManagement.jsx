import { useState, useEffect } from "react";
// import useUser from "../../../../hooks/useUser";
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
} from "@mui/material";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiX,
  FiSave,
} from "react-icons/fi";
import { DateTimePicker } from "@mui/x-date-pickers";
import "../Scheduler/scheduler.css";

const EventManagement = () => {
  //   const  user  = useUser();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [parents, setParents] = useState([]);
  const [classes, setClasses] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/scheduler/events/");
      // Ensure we're setting arrays for events and filteredEvents
      const eventsData = Array.isArray(res.data) ? res.data : [];
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      // If there's an error, ensure we at least set empty arrays
      setEvents([]);
      setFilteredEvents([]);
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [teachersRes, parentsRes, classesRes] = await Promise.all([
        axios.get("/users/teachers/"),
        axios.get("/users/parents/"),
        axios.get("/schools/classes/"),
      ]);
      setTeachers(Array.isArray(teachersRes.data) ? teachersRes.data : []);
      setParents(Array.isArray(parentsRes.data) ? parentsRes.data : []);
      setClasses(Array.isArray(classesRes.data) ? classesRes.data : []);
    } catch (err) {
      console.error("Error fetching options:", err);
      setTeachers([]);
      setParents([]);
      setClasses([]);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchOptions();
  }, []);

  useEffect(() => {
    // Ensure events is an array before filtering
    if (!Array.isArray(events)) {
      setFilteredEvents([]);
      return;
    }

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/scheduler/events/${id}/`);
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...currentEvent,
        start_datetime: currentEvent.start_datetime.toISOString(),
        end_datetime: currentEvent.end_datetime.toISOString(),
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

  return (
    <div className="event-management">
      <div className="management-header">
        <h2>Event Management</h2>
        <Button
          startIcon={<FiPlus />}
          onClick={() => {
            setCurrentEvent({
              title: "",
              description: "",
              start_datetime: new Date(),
              end_datetime: new Date(),
              event_type: "general",
              target_type: "all",
              location: "",
              is_all_day: false,
              targeted_teachers: [],
              targeted_parents: [],
              targeted_classes: [],
            });
            setOpenDialog(true);
          }}
          variant="contained"
          color="primary"
        >
          Add Event
        </Button>
      </div>

      <div className="filters">
        <TextField
          label="Search Events"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <FiSearch style={{ marginRight: 8 }} />,
          }}
          style={{ width: 300 }}
        />

        <FormControl variant="outlined" size="small" style={{ width: 200 }}>
          <InputLabel>Event Type</InputLabel>
          <Select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            label="Event Type"
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="general">General</MenuItem>
            <MenuItem value="meeting">Meeting</MenuItem>
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
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
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
            ) : !Array.isArray(filteredEvents) ||
              filteredEvents.length === 0 ? (
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
                          start_datetime: new Date(event.start_datetime),
                          end_datetime: new Date(event.end_datetime),
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

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentEvent?.id ? "Edit Event" : "Create Event"}
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              margin="normal"
              value={currentEvent?.title || ""}
              onChange={handleInputChange}
              required
            />

            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={currentEvent?.description || ""}
              onChange={handleInputChange}
            />

            <div className="datetime-row">
              <DateTimePicker
                label="Start Time"
                value={currentEvent?.start_datetime || new Date()}
                onChange={(date) =>
                  setCurrentEvent((prev) => ({ ...prev, start_datetime: date }))
                }
                slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
              />

              <DateTimePicker
                label="End Time"
                value={currentEvent?.end_datetime || new Date()}
                onChange={(date) =>
                  setCurrentEvent((prev) => ({ ...prev, end_datetime: date }))
                }
                slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
                minDateTime={currentEvent?.start_datetime}
              />
            </div>

            <FormControl fullWidth margin="normal">
              <InputLabel>Event Type</InputLabel>
              <Select
                name="event_type"
                value={currentEvent?.event_type || "general"}
                onChange={handleInputChange}
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="meeting">Meeting</MenuItem>
                <MenuItem value="exam">Exam</MenuItem>
                <MenuItem value="holiday">Holiday</MenuItem>
                <MenuItem value="announcement">Announcement</MenuItem>
                <MenuItem value="parent_event">Parent Event</MenuItem>
                <MenuItem value="staff_event">Staff Event</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Target Audience</InputLabel>
              <Select
                name="target_type"
                value={currentEvent?.target_type || "all"}
                onChange={handleInputChange}
              >
                <MenuItem value="all">Everyone</MenuItem>
                <MenuItem value="teachers">All Teachers</MenuItem>
                <MenuItem value="parents">All Parents</MenuItem>
                <MenuItem value="specific">Specific Users</MenuItem>
                <MenuItem value="classes">Specific Classes</MenuItem>
              </Select>
            </FormControl>

            {currentEvent?.target_type === "specific" && (
              <div className="target-selection">
                <FormControl fullWidth margin="normal">
                  <InputLabel>Target Teachers</InputLabel>
                  <Select
                    multiple
                    name="targeted_teachers"
                    value={currentEvent?.targeted_teachers || []}
                    onChange={handleInputChange}
                  >
                    {teachers.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id}>
                        {teacher.user.full_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Target Parents</InputLabel>
                  <Select
                    multiple
                    name="targeted_parents"
                    value={currentEvent?.targeted_parents || []}
                    onChange={handleInputChange}
                  >
                    {parents.map((parent) => (
                      <MenuItem key={parent.id} value={parent.id}>
                        {parent.user.full_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}

            {currentEvent?.target_type === "classes" && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Target Classes</InputLabel>
                <Select
                  multiple
                  name="targeted_classes"
                  value={currentEvent?.targeted_classes || []}
                  onChange={handleInputChange}
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  name="is_all_day"
                  checked={currentEvent?.is_all_day || false}
                  onChange={(e) =>
                    setCurrentEvent((prev) => ({
                      ...prev,
                      is_all_day: e.target.checked,
                    }))
                  }
                />
              }
              label="All Day Event"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<FiX />} onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button
            startIcon={<FiSave />}
            onClick={handleSubmit}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EventManagement;
