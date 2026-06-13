// Check if the user has enabled the extension (default to true)
chrome.storage.sync.get("enabled", (result) => {
    const isEnabled = (result && result.enabled !== undefined) ? result.enabled : true;
    
    if (isEnabled) {
        startObserver();
    }
});


chrome.storage.onChanged.addListener((changes, namespace) => {
    // Only react to changes in 'sync' storage and only if 'enabled' changed
    if (namespace === 'sync' && changes.enabled) {
        if (changes.enabled.newValue) {
            startObserver();
        } else {
            stopObserver();
        }
    }
});

let observer;

function startObserver() {
    // Stop any existing observer to prevent duplicates
    if (observer) observer.disconnect();

    observer = new MutationObserver((mutations) => {
        removeAIElements();
    });

    // Start watching the entire document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Run once immediately in case it's already loaded
    removeAIElements();
}

function stopObserver() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    //Unhide elements if the user turns it off mid-page
    document.querySelectorAll('.clean-search-hidden').forEach(el => {
        el.style.display = '';
        el.classList.remove('clean-search-hidden');
    });
}

function removeAIElements() {
    const selectors = [
        '.bzXtMb.M8OgIe.dRpWwb',  // current working one for chrome and firefox
        'div[data-sncf="1"]',     // Fallback 1
        'g-scrolling-carousel'    // Fallback 2
    ].join(', ');

    document.querySelectorAll(selectors).forEach((element) => {
        if (element.dataset.cleaned === "true") return;

        // (prevents accidentally deleting normal search results)
        const text = element.innerText.toLowerCase();
        const isLikelyAI = text.includes('ai overview') || text.includes('suggested') || text.includes('sources');

        if (isLikelyAI || element.className.includes('bzXtMb')) {
            // Aggressively hide it (in case remove() is blocked)
            element.style.setProperty('display', 'none', 'important');
            element.style.setProperty('visibility', ' hidden', 'important');
            element.style.setProperty('height', '0', 'important');
            
            // remove the element
            element.remove();
            console.log('Successfully removed AI element');
        }
    });
}