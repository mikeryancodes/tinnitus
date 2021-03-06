import React, { useState } from 'react';
import MasterAudio from './MasterAudio';
import SelectPitch from './SelectPitch';
import Acr from './Acr';

function App() {
  const [pitch, setPitch] = useState(880);
  const [view, setView] = useState('selectPitch');
  const [selectPitchEnabled, setSelectPitchEnabled] = useState(true);
  const [acrEnabled, setAcrEnabled] = useState(false);
  const [volume, setVolume] = useState(5);
  const [pan, setPan] = useState(0);

  return (
    <div className="App">
      <div>
        Pitch: {pitch} | Volume: {volume} | Pan: {pan}
      </div>
      <div>
        <MasterAudio volume={volume} setVolume={setVolume} pan={pan} setPan={setPan} />
      </div>
      <span>
        <button disabled={view === 'selectPitch'} onClick={() => {
          setView('selectPitch');
          setAcrEnabled(false);
          setSelectPitchEnabled(true);
        }}>
          Select pitch
        </button>
        <button disabled={view === 'acr'} onClick={() => {
          setView('acr');
          setSelectPitchEnabled(false);
          setAcrEnabled(true);
        }}>
          ACR
        </button>
      </span>
      <div>
        <SelectPitch
          enabled={selectPitchEnabled}
          show={view === 'selectPitch'}
          pitch={pitch}
          setPitch={setPitch}
          pan={pan}
          volume={volume}
        />
      </div>
      <div>
        <Acr
          enabled={acrEnabled}
          show={view === 'acr'}
          pitch={pitch}
          pan={pan}
          volume={volume}
        />
      </div>
    </div>
  );
}

export default App;
