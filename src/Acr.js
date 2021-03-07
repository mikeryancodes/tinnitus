import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import safeStartOscillator from './safeStartOscillator';

const RATIOS = [0.766, 0.9, 1.1, 1.4];

export default function Acr({ enabled, pitch, oscillator }) {
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(false);

  const pitches = useMemo(() => RATIOS.map((r) => (r * pitch).toFixed(2)), [pitch]);

  const play = useMemo(() => playing && enabled, [playing, enabled]);

  const updatePlaying = useCallback((newValue) => {
    setPlaying(newValue);
    playingRef.current = newValue;
  }, [setPlaying]);

  const start = useCallback(async () => {
    ensureOscillator(oscillator);
    while (playingRef.current) {
      await playMultiCycle(oscillator, playingRef, pitches);
    }
  }, [oscillator, playingRef, pitches]);

  useEffect(() => play ? start() : updatePlaying(false), [play, updatePlaying, start]);

  return (
    <div style={{ display: enabled ? 'block' : 'none' }}>
      <div>
        Pitches: {pitches.join(', ')}
      </div>
      <div>
        <button onClick={() => updatePlaying(!playing)}>
          {playing ? 'Stop' : 'Play'}
        </button>
      </div>
    </div>
  );
}

async function playMultiCycle(oscillator, playingRef, pitches) {
  const startTime = oscillator.context.currentTime;
  const [abort, toneCyclesSeconds] = await playToneCycles(oscillator, startTime, playingRef, pitches);
  if (abort) return;
  await audioContextDelay(startTime + toneCyclesSeconds + 1.333, oscillator.context, playingRef)
}

async function playToneCycles(oscillator, startTime, playingRef, pitches) {
  const toneCyclesSeconds = scheduleToneCycles(oscillator, playingRef, pitches);
  const abort = await waitForToneCycles(startTime + toneCyclesSeconds, oscillator, playingRef);
  return [abort, toneCyclesSeconds];
}

function scheduleToneCycles(oscillator, playingRef, pitches) {
  let lastIndex;
  const delay = 0.667;
  const iterations = 3;
  for (let i = 0; i <= iterations - 1; i++) {
    lastIndex = scheduleCycle(oscillator, playingRef, pitches, lastIndex, 0.667 * i);
  }
  return delay * iterations;
}

async function waitForToneCycles(targetTime, oscillator, playingRef) {
  const abort = await audioContextDelay(targetTime, oscillator.context, playingRef);
  if (abort) {
    oscillator.frequency.cancelScheduledValues(oscillator.context.currentTime);
    oscillator.frequency.setValueAtTime(null, oscillator.context.currentTime);
    return;
  }
  return abort;
}

async function audioContextDelay(targetTime, audioContext, playingRef) {
  while(audioContext.currentTime < targetTime) {
    await delay(2);
    if (playingRef.current) continue;
    return true;
  }
  return false;
}

function scheduleCycle(oscillator, playingRef, pitches, lastIndex, baseOffset) {
  const indexPermutation = getValidIndexPermutation(p => p[0] !== lastIndex); // eslint-disable-line no-loop-func
  indexPermutation.forEach((index, i) => {
    const pitch = pitches[index];
    const time = oscillator.context.currentTime + baseOffset + 0.167 * i;
    oscillator.frequency.setValueAtTime(pitch, time);
    oscillator.frequency.setValueAtTime(null, time + 0.150);
  });
  return indexPermutation[3];
}

function ensureOscillator(oscillator) {
  safeStartOscillator(oscillator);
  oscillator.context.resume();
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
