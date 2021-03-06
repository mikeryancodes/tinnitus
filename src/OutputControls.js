import React from 'react';
import Volume from './Volume';
import Pan from './Pan';

const OutputControls = ({ volumeNode, panNode }) => (
  <div>
    <Volume volumeNode={volumeNode} />
    <Pan panNode={panNode} />
  </div>
);

export default OutputControls;
