import { useState } from "react";
import { useForm } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { FiSend, FiPaperclip, FiX } from "react-icons/fi";
import { webSocketService } from "../../../../services/websocketService";
import useUser from "../../../../hooks/useUser";
import {
  sendMessage,
  fetchMessageRecipients,
} from "../../../../services/messagesService";
import "../Messages/messages.css";

const MessagesCompose = () => {
  const { user } = useUser();
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      recipients: [],
      subject: "",
      body: "",
    },
  });

  const loadRecipients = async (inputValue) => {
    const response = await fetchMessageRecipients(inputValue);
    return response.map((user) => ({
      value: user.id,
      label: `${user.name} (${user.type})`,
      ...user,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      setIsSending(true);
      setError(null);

      // Send via REST API first
      const formData = new FormData();
      formData.append("subject", data.subject);
      formData.append("body", data.body);
      data.recipients.forEach((recipient) => {
        formData.append("recipients", recipient.value);
      });

      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      const response = await sendMessage(formData);

      // Send via WebSocket for real-time delivery to each recipient
      data.recipients.forEach((recipient) => {
        if (
          webSocketService.sendMessage({
            type: "message",
            message: {
              id: response.id,
              sender_id: user.id,
              sender_name: user.get_full_name(), // Make sure your auth context provides this
              recipient_id: recipient.value,
              subject: data.subject,
              body: data.body,
              is_read: false,
              created_at: new Date().toISOString(),
              status: "sent",
            },
          })
        ) {
          console.log(`Sent via WebSocket to recipient ${recipient.value}`);
        }
      });

      setSuccess(true);
      reset();
      setAttachments([]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="compose-container">
      <h2 className="compose-title">Compose New Message</h2>

      {success && (
        <div className="alert success">Message sent successfully!</div>
      )}

      {error && <div className="alert error">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="compose-form">
        <div className="form-group">
          <label>To:</label>
          <AsyncSelect
            isMulti
            cacheOptions
            defaultOptions
            loadOptions={loadRecipients}
            onChange={(selected) => setValue("recipients", selected)}
            className="recipient-select"
            placeholder="Search for recipients..."
            noOptionsMessage={() => "No users found"}
            loadingMessage={() => "Loading..."}
          />
        </div>

        <div className="form-group">
          <label>Subject:</label>
          <input
            type="text"
            {...register("subject", { required: "Subject is required" })}
            placeholder="Message subject"
          />
        </div>

        <div className="form-group">
          <label>Message:</label>
          <textarea
            {...register("body", { required: "Message body is required" })}
            placeholder="Write your message here..."
            rows={10}
          />
        </div>

        <div className="form-group attachments-group">
          <label>
            <FiPaperclip /> Attachments:
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              style={{ display: "none" }}
              id="file-upload"
            />
          </label>
          <label htmlFor="file-upload" className="file-upload-label">
            Add Files
          </label>

          {attachments.length > 0 && (
            <div className="attachments-preview">
              {attachments.map((file, index) => (
                <div key={index} className="attachment-preview">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="remove-attachment"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSending} className="send-button">
            <FiSend /> {isSending ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessagesCompose;
