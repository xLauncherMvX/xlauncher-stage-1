import React from 'react';
import '../styles.css';

const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <div className={isDanger ? 'countdown danger' : 'countdown'}>
      <p>{value}</p>
      <span className='date-time-text'>{type}</span>
    </div>
  );
};

export default DateTimeDisplay;
