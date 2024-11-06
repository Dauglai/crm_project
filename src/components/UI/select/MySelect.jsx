import React from "react";
import './MySelect.css';

const MySelect = ({ options, defaultValue, value, onChange }) => {
    return (
        <div className="select-container">
            <select
                value={value}
                onChange={event => onChange(event.target.value)}
            >
                <option disabled={true} value="">{defaultValue}</option>
                {options.map(option =>
                    <option key={option.value} value={option.value}>
                        {option.name}
                    </option>
                )}
            </select>
        </div>
    );
};

export default MySelect;
