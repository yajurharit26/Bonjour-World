const Input = ({ label, options, value, onChange }) => {
  const enhancedOptions = ["All Languages", ...options];

  return (
    <div id="filter-form">
        <div className="select-btn">
        <select value={value} onChange={onChange} >
          {enhancedOptions.map((option) => (
            <option key={option} value={option === "All Languages" ? "" : option}>
              {option}
            </option>
          ))}
        </select>
        </div>
    </div>
  );
};

export default Input;
