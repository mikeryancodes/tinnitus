import React from 'react';
import Volume from './Volume';
import Pan from './Pan';

const OutputControls = ({ volumeNode, panNode, audioContext }) => (
  <div>
    <Volume volumeNode={volumeNode} audioContext={audioContext} />
    <Pan panNode={panNode} audioContext={audioContext} />
  </div>
);

export default OutputControls;
