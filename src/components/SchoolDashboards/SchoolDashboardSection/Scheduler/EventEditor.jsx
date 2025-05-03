import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { FiX, FiSave } from "react-icons/fi";
import "../Scheduler/scheduler.css";

const EventEditor = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState({
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

  const [teachers, setTeachers] = useState([]);
  const [parents, setParents] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        start_datetime: new Date(event.start_datetime),
        end_datetime: new Date(event.end_datetime),
        event_type: event.event_type,
        target_type: event.target_type,
        location: event.location || "",
        is_all_day: event.is_all_day,
        targeted_teachers: event.targeted_teachers?.map((t) => t.id) || [],
        targeted_parents: event.targeted_parents?.map((p) => p.id) || [],
        targeted_classes: event.targeted_classes?.map((c) => c.id) || [],
      });
    }

    // Fetch available options
    const fetchOptions = async () => {
      try {
        const [teachersRes, parentsRes, classesRes] = await Promise.all([
          axios.get("/api/users/teachers/"),
          axios.get("/api/users/parents/"),
          axios.get("/api/schools/classes/"),
        ]);

        setTeachers(teachersRes.data);
        setParents(parentsRes.data);
        setClasses(classesRes.data);
      } catch (err) {
        console.error("Error fetching options:", err);
      }
    };

    fetchOptions();
  }, [event]);

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        start_datetime: formData.start_datetime.toISOString(),
        end_datetime: formData.end_datetime.toISOString(),
      };

      if (event) {
        await axios.patch(`/api/scheduler/events/${event.id}/`, payload);
      } else {
        await axios.post("/api/scheduler/events/", payload);
      }

      onSave();
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{event ? "Edit Event" : "Create New Event"}</DialogTitle>
      <DialogContent dividers>
        <div className="event-editor-form">
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <div className="datetime-row">
            <DateTimePicker
              label="Start Time"
              value={formData.start_datetime}
              onChange={(date) =>
                setFormData({ ...formData, start_datetime: date })
              }
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />

            <DateTimePicker
              label="End Time"
              value={formData.end_datetime}
              onChange={(date) =>
                setFormData({ ...formData, end_datetime: date })
              }
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
              minDateTime={formData.start_datetime}
            />
          </div>

          <FormControl fullWidth margin="normal">
            <InputLabel>Event Type</InputLabel>
            <Select
              value={formData.event_type}
              onChange={(e) =>
                setFormData({ ...formData, event_type: e.target.value })
              }
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
              value={formData.target_type}
              onChange={(e) =>
                setFormData({ ...formData, target_type: e.target.value })
              }
            >
              <MenuItem value="all">Everyone</MenuItem>
              <MenuItem value="teachers">All Teachers</MenuItem>
              <MenuItem value="parents">All Parents</MenuItem>
              <MenuItem value="specific">Specific Users</MenuItem>
              <MenuItem value="classes">Specific Classes</MenuItem>
            </Select>
          </FormControl>

          {formData.target_type === "specific" && (
            <div className="target-selection">
              <FormControl fullWidth margin="normal">
                <InputLabel>Target Teachers</InputLabel>
                <Select
                  multiple
                  value={formData.targeted_teachers}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targeted_teachers: e.target.value,
                    })
                  }
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
                  value={formData.targeted_parents}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targeted_parents: e.target.value,
                    })
                  }
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

          {formData.target_type === "classes" && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Target Classes</InputLabel>
              <Select
                multiple
                value={formData.targeted_classes}
                onChange={(e) =>
                  setFormData({ ...formData, targeted_classes: e.target.value })
                }
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
                checked={formData.is_all_day}
                onChange={(e) =>
                  setFormData({ ...formData, is_all_day: e.target.checked })
                }
              />
            }
            label="All Day Event"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<FiX />} onClick={onClose}>
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
  );
};

export default EventEditor;
