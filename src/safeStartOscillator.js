export default function safeStartOscillator(oscillator) {
    try {
      oscillator.start();
    } catch (e) {
      if (safeStartError(e)) return;
      throw e;
    }
}

function safeStartError(e) {
  const message = "Failed to execute 'start' on 'AudioScheduledSourceNode': cannot call start more than once.";
  return (e.message === message);
}
