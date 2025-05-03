import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { FiPlus, FiLink, FiEye, FiLogOut, FiPhone } from "react-icons/fi";

const CommandMenu = ({ open, setOpen }) => {
  // Toggle the menu when ⌘K is pressed
  const [value, setValue] = useState("");

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="command-dialog"
      onClick={() => setOpen(false)}
    >
      <div onClick={(e) => e.stopPropagation()} className="command-container">
        <Command.Input
          value={value}
          onValueChange={setValue}
          placeholder="What do you need?"
          className="command-input"
        />
        <Command.List className="command-list">
          <Command.Empty>
            No results found for{" "}
            <span className="command-highlight">"{value}"</span>
          </Command.Empty>

          <Command.Group heading="Team" className="command-group-heading">
            <Command.Item className="command-item">
              <FiPlus />
              Invite Member
            </Command.Item>
            <Command.Item className="command-item">
              <FiEye />
              See Org Chart
            </Command.Item>
          </Command.Group>

          <Command.Group
            heading="Integrations"
            className="command-group-heading"
          >
            <Command.Item className="command-item">
              <FiLink />
              Link Services
            </Command.Item>
            <Command.Item className="command-item">
              <FiPhone />
              Contact Support
            </Command.Item>
          </Command.Group>

          <Command.Item className="command-signout">
            <FiLogOut />
            Sign Out
          </Command.Item>
        </Command.List>
      </div>
    </Command.Dialog>
  );
};

export default CommandMenu;
