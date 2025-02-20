import { useState } from "react";

const PurposeDropdown = ({ item, index, handleUpdateUserField }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Ensure item.purpose is always an array
  const purposes = Array.isArray(item?.purpose)
    ? item.purpose
    : (() => {
        try {
          return JSON.parse(item?.purpose || "[]");
        } catch {
          return [];
        }
      })();

  return (
    <td className="relative">
      {/* Select-like input */}
      <div
      style={{height:'42px'}}
        className="w-48 border border-[black] border-solid  flex items-center justify-between px-3 cursor-pointer bg-white"
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        <span 
        style={{fontSize:16}}
        className="truncate text-inherit">
            Purposes
          {/* {purposes.length > 0 ? purposes.join(", ") : "Purposes"} */}
        </span>
        <svg style={{transform:"scale(1.5)"}}
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg p-2">
          <div className="flex flex-col space-y-1">
            {[
              { label: "Depression", value: "depression" },
              { label: "PTSD", value: "ptsd" },
              { label: "Anxiety", value: "anxiety" },
              { label: "Chronic Pain", value: "chronicPain" },
              { label: "Other", value: "other" },
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={purposes.includes(option.value)}
                  onChange={(e) => {
                    let newSelection;
                    if (e.target.checked) {
                      newSelection = [...purposes, option.value];
                    } else {
                      newSelection = purposes.filter((val) => val !== option.value);
                    }

                    // Update the state properly
                    handleUpdateUserField(index, "purpose", newSelection);
                  }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </td>
  );
};

export default PurposeDropdown;
