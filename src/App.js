import React, { useState, useMemo } from 'react';
import OutputControls from './OutputControls';
import SelectPitch from './SelectPitch';
import Acr from './Acr';
import getSystem from './getSystem'

function App() {
  const [pitch, setPitch] = useState(880);
  const [view, setView] = useState('selectPitch');

  const { oscillator, volumeNode, panNode } = useMemo(getSystem, []);

  return (
    <div className="App">
      <div>
        Pitch: {pitch}
      </div>
      <div>
        <OutputControls
          volumeNode={volumeNode}
          panNode={panNode}
        />
      </div>
      <span>
        <button disabled={view === 'selectPitch'} onClick={() => setView('selectPitch')}>
          Select pitch
        </button>
        <button disabled={view === 'acr'} onClick={() => setView('acr')}>
          ACR
        </button>
      </span>
      <div>
        <SelectPitch
          enabled={view === 'selectPitch'}
          pitch={pitch}
          setPitch={setPitch}
          oscillator={oscillator}
        />
      </div>
      <div>
        <Acr
          enabled={view === 'acr'}
          pitch={pitch}
          oscillator={oscillator}
        />
      </div>
    </div>
  );
}

export default App;
