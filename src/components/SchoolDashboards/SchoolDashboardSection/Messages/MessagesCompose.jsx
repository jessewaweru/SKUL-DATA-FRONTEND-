import { useState } from "react";
import {
  sendMessage,
  fetchMessageRecipients,
} from "../../../../services/messagesService";
import { FiSend, FiPaperclip, FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import AsyncSelect from "react-select/async";
import "../Messages/messages.css";

const MessagesCompose = () => {
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

      const formData = new FormData();
      formData.append("subject", data.subject);
      formData.append("body", data.body);
      data.recipients.forEach((recipient) => {
        formData.append("recipients", recipient.value);
      });

      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      await sendMessage(formData);

      setSuccess(true);
      reset();
      setAttachments([]);

      // Reset success message after 3 seconds
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
