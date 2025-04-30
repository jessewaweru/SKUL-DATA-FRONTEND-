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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiX,
  FiSave,
} from "react-icons/fi";
import "../Scheduler/scheduler.css";

const EventTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get("/api/scheduler/templates/");
      // Ensure we're setting arrays for templates and filteredTemplates
      const templatesData = Array.isArray(res.data) ? res.data : [];
      setTemplates(templatesData);
      setFilteredTemplates(templatesData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching templates:", err);
      // If there's an error, ensure we at least set empty arrays
      setTemplates([]);
      setFilteredTemplates([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    // Ensure templates is an array before filtering
    if (!Array.isArray(templates)) {
      setFilteredTemplates([]);
      return;
    }

    const results = templates.filter(
      (template) =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTemplates(results);
  }, [searchTerm, templates]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/scheduler/templates/${id}/`);
      fetchTemplates();
    } catch (err) {
      console.error("Error deleting template:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTemplate.id) {
        await axios.patch(
          `/api/scheduler/templates/${currentTemplate.id}/`,
          currentTemplate
        );
      } else {
        await axios.post("/api/scheduler/templates/", currentTemplate);
      }

      setOpenDialog(false);
      fetchTemplates();
    } catch (err) {
      console.error("Error saving template:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTemplate((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="event-templates">
      <div className="templates-header">
        <h2>Event Templates</h2>
        <Button
          startIcon={<FiPlus />}
          onClick={() => {
            setCurrentTemplate({
              name: "",
              description: "",
              event_type: "general",
              default_duration: 60,
              default_target: "all",
            });
            setOpenDialog(true);
          }}
          variant="contained"
          color="primary"
        >
          Add Template
        </Button>
      </div>

      <div className="filters">
        <TextField
          label="Search Templates"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <FiSearch style={{ marginRight: 8 }} />,
          }}
          style={{ width: 300 }}
        />
      </div>

      <TableContainer component={Paper} className="templates-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Default Duration</TableCell>
              <TableCell>Default Target</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : !Array.isArray(filteredTemplates) ||
              filteredTemplates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No templates found
                </TableCell>
              </TableRow>
            ) : (
              filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.event_type}</TableCell>
                  <TableCell>{template.default_duration} minutes</TableCell>
                  <TableCell>{template.default_target}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setCurrentTemplate(template);
                        setOpenDialog(true);
                      }}
                    >
                      <FiEdit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(template.id)}>
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentTemplate?.id ? "Edit Template" : "Create Template"}
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              margin="normal"
              value={currentTemplate?.name || ""}
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
              value={currentTemplate?.description || ""}
              onChange={handleInputChange}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Event Type</InputLabel>
              <Select
                name="event_type"
                value={currentTemplate?.event_type || "general"}
                onChange={handleInputChange}
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="meeting">Meeting</MenuItem>
                <MenuItem value="exam">Exam</MenuItem>
                <MenuItem value="holiday">Holiday</MenuItem>
                <MenuItem value="announcement">Announcement</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Default Duration (minutes)"
              name="default_duration"
              type="number"
              fullWidth
              margin="normal"
              value={currentTemplate?.default_duration || 60}
              onChange={handleInputChange}
              inputProps={{ min: 15, step: 15 }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Default Target</InputLabel>
              <Select
                name="default_target"
                value={currentTemplate?.default_target || "all"}
                onChange={handleInputChange}
              >
                <MenuItem value="all">Everyone</MenuItem>
                <MenuItem value="teachers">All Teachers</MenuItem>
                <MenuItem value="parents">All Parents</MenuItem>
              </Select>
            </FormControl>
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

export default EventTemplates;
