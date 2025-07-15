import { useState } from "react";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import { FiSend, FiAlertCircle } from "react-icons/fi";
import "./timetables.css";

const TimetableFeedback = () => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const { sendFeedback } = useTimetableApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await sendFeedback({ message: feedback, category: "TIMETABLE" });
      setSubmitStatus("success");
      setFeedback("");
    } catch (error) {
      setSubmitStatus("error");
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="timetable-feedback-container">
      <h2>Timetable Feedback</h2>
      <p className="feedback-description">
        Encountered issues with the timetable system? Let us know and we'll help
        resolve them.
      </p>

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="feedback">Your Feedback</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            rows={5}
            placeholder="Describe your issue or suggestion..."
          />
        </div>

        <button type="submit" disabled={isSubmitting || !feedback.trim()}>
          {isSubmitting ? "Sending..." : "Send Feedback"} <FiSend />
        </button>

        {submitStatus === "success" && (
          <div className="alert success">
            Thank you! Your feedback has been submitted successfully.
          </div>
        )}

        {submitStatus === "error" && (
          <div className="alert error">
            <FiAlertCircle /> Failed to submit feedback. Please try again.
          </div>
        )}
      </form>
    </div>
  );
};

export default TimetableFeedback;
