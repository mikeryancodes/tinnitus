import React, { useState, useEffect } from 'react';
import safeStartOscillator from './safeStartOscillator';

const RANGE_MAX = 1000;
const PITCH_MIN = 20;
const PITCH_MAX = 15000;

export default function SelectPitch({ enabled, pitch, setPitch, oscillator }) {
  const [playing, setPlaying] = useState(false);

  const play = enabled && playing;

  useEffect(() => play && safeStartOscillator(oscillator), [play, oscillator]);
  useEffect(() => oscillator.context[play ? 'resume' : 'suspend'](), [play, oscillator]);
  useEffect(() => !enabled && setPlaying(false), [enabled]);
  useEffect(() => play && oscillator.frequency.setValueAtTime(pitch, oscillator.context.currentTime), [pitch, oscillator, play]);

  return (
    <div style={{ display: enabled ? 'block' : 'none' }}>
      <div>
        <button onClick={() => setPlaying(!playing)}>
          {playing ? 'Stop' : 'Play'}
        </button>
      </div>
      <input
        type="range"
        min="0"
        max={RANGE_MAX}
        value={getRangePosition(pitch)}
        style={{ width: 800 }}
        onChange={(e) => setPitch(getPitch(e.target.value))}
      />
    </div>
  );
};

function getPitch(rangePosition) {
  const r = PITCH_MAX / PITCH_MIN;
  const k = Math.log(r);
  const p = Number(rangePosition) / RANGE_MAX;
  const actualPitch = PITCH_MIN * (Math.E ** (p * k));
  return Math.round(actualPitch);
}

function getRangePosition(pitch) {
  return Math.round(RANGE_MAX * Math.log(pitch / PITCH_MIN) / Math.log(PITCH_MAX / PITCH_MIN));
}
