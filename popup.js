document.getElementById('toggleExtension').addEventListener('click', () => {
    chrome.storage.sync.get('enabled', ({ enabled }) => {
        chrome.storage.sync.set({ enabled: !enabled }, () => {
            chrome.tabs.reload();
        });
    });
});
