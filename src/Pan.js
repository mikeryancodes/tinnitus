import React, { useState, useEffect } from 'react';

const Pan = ({ panNode }) => {
  const [pan, setPan] = useState(0);

  useEffect(() => panNode.pan.setValueAtTime(pan, panNode.context.currentTime), [pan, panNode]);

  return (
    <div>
      Pan:
      <input
        type="range"
        min="0"
        max="100"
        value={panToValue(pan)}
        onChange={(e) => {
          const value = Number(e.target.value);
          const newPan = valueToPan(value);
          setPan(newPan);
        }}
      />
    </div>
  );
};

function panToValue(pan) {
  return pan * 50 + 50;
}

function valueToPan(value) {
  return (value - 50) / 50;
}

export default Pan;
