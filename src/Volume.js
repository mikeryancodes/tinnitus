import React, { useState, useEffect } from 'react';

const Volume = ({ volumeNode, audioContext }) => {
  const [volume, setVolume] = useState(0.5);

  useEffect(() => volumeNode.gain.setValueAtTime(volume, audioContext.currentTime), [volume, volumeNode, audioContext]);

  return (
    <div>
      Volume:
      <input
        type="range"
        min="0"
        max="100"
        value={volumeToValue(volume)}
        onChange={(e) => {
          const value = Number(e.target.value);
          const newVolume = valueToVolume(value);
          setVolume(newVolume);
        }}
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
