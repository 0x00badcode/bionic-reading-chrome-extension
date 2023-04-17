function saveOptions() {
    const shortWordsLength = document.getElementById('shortWordsLength').value;
    const mediumWordsLength = document.getElementById('mediumWordsLength').value;
    const longWordsLength = document.getElementById('longWordsLength').value;
  
    chrome.storage.sync.set({
      shortWordsLength,
      mediumWordsLength,
      longWordsLength,
    });
  }
  
  function loadOptions() {
    chrome.storage.sync.get(
      ['enabled', 'shortWordsLength', 'mediumWordsLength', 'longWordsLength'],
      ({ enabled, shortWordsLength, mediumWordsLength, longWordsLength }) => {
        document.getElementById('toggleExtension').checked = enabled;
        document.getElementById('shortWordsLength').value = shortWordsLength || 1;
        document.getElementById('mediumWordsLength').value = mediumWordsLength || 2;
        document.getElementById('longWordsLength').value = longWordsLength || 3;
      }
    );
  }
  
  function toggleExtension() {
    const enabled = document.getElementById('toggleExtension').checked;
    chrome.storage.sync.set({ enabled }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.reload(tabs[0].id);
      });
    });
  }
  
  document.getElementById('saveOptions').addEventListener('click', saveOptions);
  document.getElementById('toggleExtension').addEventListener('change', toggleExtension);
  loadOptions();
  