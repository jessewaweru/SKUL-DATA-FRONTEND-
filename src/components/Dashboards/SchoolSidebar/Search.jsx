import { FiCommand, FiSearch } from "react-icons/fi";
import { useState } from "react";
import CommandMenu from "./CommandMenu";

const Search = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="search-container">
        <FiSearch className="search-icon" />
        <input
          onFocus={(e) => {
            e.target.blur();
            setOpen(true);
          }}
          type="text"
          placeholder="search"
          className="search-input"
        />
        <span className="shortcut-badge">
          <FiCommand />K
        </span>
      </div>

      <CommandMenu open={open} setOpen={setOpen} />
    </>
  );
};

export default Search;
