document.addEventListener('DOMContentLoaded', function() {
    // Get the elements from the popup
    const shortWordsLengthInput = document.getElementById('shortWordsLength');
    const mediumWordsLengthInput = document.getElementById('mediumWordsLength');
    const longWordsLengthInput = document.getElementById('longWordsLength');
    const saveOptionsButton = document.getElementById('saveOptions');
    const toggleExtensionInput = document.getElementById('toggleExtension');
    const statusIndicator = document.getElementById('statusIndicator');
  
    // Load the options from storage and update the inputs
    chrome.storage.sync.get(
      {
        shortWordsLength: 3,
        mediumWordsLength: 5,
        longWordsLength: 7,
        extensionEnabled: true,
      },
      function(data) {
        shortWordsLengthInput.value = data.shortWordsLength;
        mediumWordsLengthInput.value = data.mediumWordsLength;
        longWordsLengthInput.value = data.longWordsLength;
        toggleExtensionInput.checked = data.extensionEnabled;
        toggleExtensionInput.addEventListener('change', function() {
          chrome.storage.sync.set({
            extensionEnabled: toggleExtensionInput.checked,
          });
          toggleExtensionInput.checked
            ? enableExtension()
            : disableExtension();
        });
      }
    );
  
    // Save the options to storage when the Save button is clicked
    saveOptionsButton.addEventListener('click', function() {
      const shortWordsLength = parseInt(shortWordsLengthInput.value);
      const mediumWordsLength = parseInt(mediumWordsLengthInput.value);
      const longWordsLength = parseInt(longWordsLengthInput.value);
      if (
        shortWordsLength &&
        mediumWordsLength &&
        longWordsLength &&
        shortWordsLength <= 4 &&
        mediumWordsLength <= 6 &&
        longWordsLength > 6
      ) {
        chrome.storage.sync.set({
          shortWordsLength,
          mediumWordsLength,
          longWordsLength,
        }, function() {
          statusIndicator.textContent = 'Options saved.';
          setTimeout(function() {
            statusIndicator.textContent = '';
          }, 1000);
        });
      } else {
        statusIndicator.textContent = 'Please enter valid values.';
        setTimeout(function() {
          statusIndicator.textContent = '';
        }, 1000);
      }
    });
  
    // Enable or disable the extension based on the stored value
    chrome.storage.sync.get({ extensionEnabled: true }, function(data) {
      data.extensionEnabled ? enableExtension() : disableExtension();
      toggleExtensionInput.checked = data.extensionEnabled;
    });
  
    // Enable the extension by injecting a content script into the active tab
    function enableExtension() {
      chrome.tabs.executeScript({
        file: 'content.js',
      });
    }
  
    // Disable the extension by removing the injected content script from the active tab
    function disableExtension() {
      chrome.tabs.executeScript({
        code: 'document.querySelectorAll(".typoglycemia-bold").forEach((el) => el.outerHTML = el.innerText)',
      });
    }
  });
  