import React, { useState, useEffect } from 'react';

const Volume = ({ volumeNode }) => {
  const [volume, setVolume] = useState(0.5);

  useEffect(() => volumeNode.gain.setValueAtTime(volume, volumeNode.context.currentTime), [volume, volumeNode]);

  return (
    <div>
      Volume:
      <input
        type="range"
        min="0"
        max="100"
        value={volumeToValue(volume)}
        onChange={(e) => setVolume(valueToVolume(e.target.value))}
      />
    </div>
  )
};

function volumeToValue(volume) {
  return volume * 100;
}

function valueToVolume(value) {
  return value / 100;
}

export default Volume;
