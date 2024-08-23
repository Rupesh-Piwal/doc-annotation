import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import top100Films from "../utils/data.js";

const MAX_SELECTIONS = 1; // Limiting to one selection

const AnnotationEditor = ({ annotation, onChange, onSubmit }) => {
  const [value, setValue] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false); // State to manage input field disabling
  const [dropdownValue, setDropdownValue] = useState(""); // State to manage select dropdown value

  const handleAutocompleteChange = (event, newValue) => {
    if (newValue.length <= MAX_SELECTIONS) {
      setValue(newValue);
      if (newValue.length === MAX_SELECTIONS) {
        setInputDisabled(true); // Disable input after one selection
      }
    }
  };

  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
    onChange({
      ...annotation,
      data: {
        ...annotation.data,
        type: event.target.value, // Update the annotation data with the dropdown value
      },
    });
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 3,
        position: "absolute",
        left: `${annotation.geometry.x}%`,
        top: `${annotation.geometry.y + annotation.geometry.height}%`,
      }}
      className="p-2 rounded-[10px] mt-[5px]"
    >
      <Autocomplete
        multiple
        id="tags-filled"
        options={top100Films.map((option) => option.title)}
        value={value}
        onChange={handleAutocompleteChange}
        freeSolo
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip variant="outlined" label={option} key={key} {...tagProps} />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            label="Select Attribute"
            placeholder="classes"
            disabled={inputDisabled} // Disable the input field based on state
          />
        )}
      />

      <Select
        value={dropdownValue}
        onChange={handleDropdownChange}
        displayEmpty
        variant="filled"
        fullWidth
        className="mt-2"
      >
        <MenuItem value="" disabled>
          Select Type
        </MenuItem>
        <MenuItem value="key">Key</MenuItem>
        <MenuItem value="value">Value</MenuItem>
        <MenuItem value="key-value">Key-Value</MenuItem>
      </Select>

      {dropdownValue === "key-value" && (
        <>
          <input
            onChange={(e) =>
              onChange({
                ...annotation,
                data: {
                  ...annotation.data,
                  key: e.target.value,
                },
              })
            }
            placeholder="Key"
            className="block mt-2 p-2 focus:outline-none"
          />
          <input
            onChange={(e) =>
              onChange({
                ...annotation,
                data: {
                  ...annotation.data,
                  value: e.target.value,
                },
              })
            }
            placeholder="Value"
            className="block mt-2 p-2 focus:outline-none"
          />
        </>
      )}

      {(dropdownValue === "key" || dropdownValue === "value") && (
        <input
          onChange={(e) =>
            onChange({
              ...annotation,
              data: {
                ...annotation.data,
                [dropdownValue]: e.target.value,
              },
            })
          }
          placeholder={
            dropdownValue.charAt(0).toUpperCase() + dropdownValue.slice(1)
          }
          className="block mt-2 p-2 focus:outline-none"
        />
      )}

      <button
        onClick={onSubmit}
        className="text-[#fff] bg-[#4ca3dd] py-[2px] px-2 rounded-[5px] m-2"
      >
        Done
      </button>
    </div>
  );
};

export default AnnotationEditor;
