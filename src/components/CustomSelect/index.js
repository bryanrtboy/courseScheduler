import React, { useState } from "react";
import "./customselect.css";

function CustomSelect(props) {
  const [data] = useState(props.data);
  const name = useState(props.name);
  // eslint-disable-next-line
  const [selectedData, updateSelectedData] = useState("");

  function handleChange(event) {
    updateSelectedData(event.target.value);
    if (props.onSelectChange) props.onSelectChange(event.target.value);
  }

  let options = data.map(data => (
    <option key={data.id} value={data.id} name={data.name}>
      {data.name}
    </option>
  ));

  return (
    <select name="customSearch" className="select-css" onChange={handleChange}>
      <option>{name}</option>
      {options}
    </select>
  );
}

export default CustomSelect;
