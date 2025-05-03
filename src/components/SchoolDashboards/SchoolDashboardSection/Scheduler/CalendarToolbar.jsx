import { Button, IconButton } from "@mui/material";
import { FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../Scheduler/scheduler.css";

const CalendarToolbar = ({ selectedDate, onDateChange, onAddEvent }) => {
  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  return (
    <div className="calendar-toolbar">
      <div className="date-navigation">
        <IconButton onClick={() => navigateDate("prev")}>
          <FiChevronLeft />
        </IconButton>
        <h3>
          {selectedDate.toLocaleDateString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <IconButton onClick={() => navigateDate("next")}>
          <FiChevronRight />
        </IconButton>
      </div>
      <Button
        startIcon={<FiPlus />}
        onClick={onAddEvent}
        variant="contained"
        color="primary"
      >
        New Event
      </Button>
    </div>
  );
};

export default CalendarToolbar;
