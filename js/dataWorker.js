// Web Worker for data processing

self.onmessage = function(e) {
  if (e.data.action === 'decrypt') {
    const decryptedData = decrypt(e.data.data);
    self.postMessage({ action: 'decryptResult', result: decryptedData });
  }
};

function decrypt(encodedText) {
  return atob(encodedText);
}