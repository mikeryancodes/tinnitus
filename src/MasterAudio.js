import React, { useState } from 'react';

export default function MasterAudio({ volume, setVolume, pan, setPan }) {
  return (
    <div>
      <div>
        Volume:
        <input
          type="range"
          min="0"
          max="100"
          onChange={(e) => setVolume(Number(e.target.value) / 10)}
          value={volume * 10}
        />
      </div>
      <div>
        Pan:
        <input
          type="range"
          min="0"
          max="100"
          onChange={(e) => {
            const newValue = Number(e.target.value - 50) / 50;
            setPan(newValue);
          }}
          value={(pan * 50) + 50}
        />
      </div>
    </div>
  )
}
