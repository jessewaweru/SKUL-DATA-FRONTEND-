import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMessageRecipients } from "../../../../services/messagesService";
import { FiUser, FiMail, FiSearch } from "react-icons/fi";
import "../Messages/messages.css";

const MessagesContacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const {
    data: contacts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["message-contacts", searchTerm, selectedType],
    queryFn: () =>
      fetchMessageRecipients(searchTerm).then((data) =>
        selectedType === "all"
          ? data
          : data.filter((user) => user.type === selectedType)
      ),
  });

  return (
    <div className="contacts-container">
      <div className="contacts-header">
        <h2>School Contacts</h2>
        <div className="contacts-search">
          <div className="search-input-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="type-filter"
          >
            <option value="all">All</option>
            <option value="teacher">Teachers</option>
            <option value="parent">Parents</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      <div className="contacts-list">
        {isLoading ? (
          <div className="loading">Loading contacts...</div>
        ) : isError ? (
          <div className="error">Error loading contacts</div>
        ) : contacts?.length > 0 ? (
          contacts.map((contact) => (
            <div key={contact.id} className="contact-item">
              <div className="contact-avatar">
                <FiUser />
              </div>
              <div className="contact-info">
                <h3>{contact.name}</h3>
                <p className="contact-type">{contact.type_display}</p>
                {contact.email && (
                  <p className="contact-email">
                    <FiMail /> {contact.email}
                  </p>
                )}
              </div>
              <div className="contact-actions">
                <button
                  className="message-button"
                  onClick={() => {
                    // Navigate to compose with this contact pre-selected
                  }}
                >
                  Message
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty">No contacts found</div>
        )}
      </div>
    </div>
  );
};

export default MessagesContacts;
