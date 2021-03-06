export default function getSystem() {
  const { oscillator, panNode, volumeNode, audioContext } = createSystem();
  connectSystem([oscillator, volumeNode, panNode, audioContext.destination])
  return { oscillator, volumeNode, panNode, audioContext };
}

function createSystem() {
  const audioContext = new window.AudioContext();
  const panNode = audioContext.createStereoPanner();
  const volumeNode = audioContext.createGain();
  const oscillator = audioContext.createOscillator();
  return { oscillator, panNode, volumeNode, audioContext };
}

function connectSystem(system) {
  system.forEach((node, i, array) => {
    const nextNode = array[i + 1];
    if (!nextNode) return;
    connect(node, nextNode);
  })
}

function connect(node, nextNode) {
  node.connect(nextNode);
}
