import React, { useState, useEffect, useRef, useCallback } from 'react';

const RATIOS = [0.766, 0.9, 1.1, 1.4];

export default function Acr({ enabled, show, pitch, oscillator }) {
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(false);

  const pitches = RATIOS.map((r) => (r * pitch).toFixed(2));

  const play = playing && enabled;

  const start = useCallback(async () => {
    let lastIndex;
    while (true) {
      for (let i = 1; i <= 3; i++) {
        const indexPermutation = getValidIndexPermutation(p => p[0] !== lastIndex); // eslint-disable-line no-loop-func
        for (let p = 0; p <= 3; p++) {
          const pitch = pitches[indexPermutation[p]];
          await playPitch(pitch, oscillator);
          if (!playingRef.current) return;
        }
        lastIndex = indexPermutation[3];
      }
      await delay(1333);
    }
  }, [oscillator, playingRef, pitches]);

  useEffect(() => play && start(), [play, start]);

  useEffect(() => {
    if (show) return;
    setPlaying(false);
    playingRef.current = false;
  }, [show]);

  return (
    <div style={{ display: show ? 'block' : 'none' }}>
      <div>
        Pitches: {pitches.join(', ')}
      </div>
      <div>
        <button onClick={() => {
          const newValue = !playing;
          setPlaying(newValue);
          playingRef.current = newValue;
        }}>
          {playing ? 'Stop' : 'Play'}
        </button>
      </div>
    </div>
  );
}

async function playPitch(pitch, oscillator) {
  oscillator.frequency.setValueAtTime(pitch, oscillator.context.currentTime);
  safeStartOscillator(oscillator);
  oscillator.context.resume();
  await delay(150);
  oscillator.context.suspend();
  await delay(17);
}

function safeStartOscillator(oscillator) {
  try {
    oscillator.start();
  } catch (e) {
    if (safeStartError(e)) return;
    throw e;
  }
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


function getValidIndexPermutation(predicate) {
  const allIndexPermutations = getIndexPermutations();
  const validIndexPermutations = allIndexPermutations.filter(predicate);
  const permutationIndex = Math.floor(Math.random() * validIndexPermutations.length);
  return validIndexPermutations[permutationIndex];
}

function getIndexPermutations() {
  return [
    [0, 1, 2, 3],
    [0, 1, 3, 2],
    [0, 2, 1, 3],
    [0, 2, 3, 1],
    [0, 3, 1, 2],
    [0, 3, 2, 1],
    [1, 0, 2, 3],
    [1, 0, 3, 2],
    [1, 2, 0, 3],
    [1, 2, 3, 0],
    [1, 3, 0, 2],
    [1, 3, 2, 0],
    [2, 0, 1, 3],
    [2, 0, 3, 1],
    [2, 1, 0, 3],
    [2, 1, 3, 0],
    [2, 3, 0, 1],
    [2, 3, 1, 0],
    [3, 0, 1, 2],
    [3, 0, 2, 1],
    [3, 1, 0, 2],
    [3, 1, 2, 0],
    [3, 2, 0, 1],
    [3, 2, 1, 0]
  ]
}

function safeStartError(e) {
  const message = "Failed to execute 'start' on 'AudioScheduledSourceNode': cannot call start more than once.";
  return (e.message === message);
}
