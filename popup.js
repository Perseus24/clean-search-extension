const toggle = document.getElementById('toggle');

// Load saved state
chrome.storage.sync.get({ enabled: true }, (result) => {
    toggle.checked = result.enabled;
});

// Save new state when clicked
toggle.addEventListener('change', (e) => {
    chrome.storage.sync.set({ enabled: e.target.checked });
});