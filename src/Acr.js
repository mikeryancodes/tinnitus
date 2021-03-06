import React, { useState, useEffect, useMemo, useRef } from 'react';

const RATIOS = [0.766, 0.9, 1.1, 1.4];

export default function Acr({ enabled, show, pitch, volume, pan }) {
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(false);

  const pitches = RATIOS.map((r) => (r * pitch).toFixed(2));

  const play = playing && enabled;

  const audioContext = useMemo(() => new window.AudioContext(), []);

  const panNode = useMemo(() => {
    const pn = audioContext.createStereoPanner();
    pn.pan.setValueAtTime(pan, audioContext.currentTime);
    pn.connect(audioContext.destination);
    return pn;
  }, []);

  const volumeNode = useMemo(() => {
    const vn = audioContext.createGain();
    vn.gain.setValueAtTime(volume, audioContext.currentTime);
    vn.connect(panNode);
    return vn;
  }, []);

  const oscillator = useMemo(() => {
    const o = audioContext.createOscillator();
    o.type = 'sine';
    o.connect(volumeNode);
    return o;
  }, []);

  useEffect(() => volumeNode.gain.setValueAtTime(volume, audioContext.currentTime), [volume, audioContext]);

  useEffect(() => panNode.pan.setValueAtTime(pan, audioContext.currentTime), [pan, audioContext]);

  useEffect(() => play && start(), [play]);

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

  async function start() {
    let lastIndex;
    while (true) {
      for (let i = 1; i <= 3; i++) {
        const indexPermutation = getValidIndexPermutation(p => p[0] !== lastIndex);
        for (let p = 0; p <= 3; p++) {
          const pitch = pitches[indexPermutation[p]];
          await playPitch(pitch, oscillator, audioContext);
          if (!playingRef.current) return;
        }
        lastIndex = indexPermutation[3];
      }
      await delay(1333);
    }
  }
}

async function playPitch(pitch, oscillator, audioContext) {
  oscillator.frequency.setValueAtTime(pitch, audioContext.currentTime);
  safeStartOscillator(oscillator);
  audioContext.resume();
  await delay(150);
  audioContext.suspend();
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