const openFavoritesTab = () => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("favorites/favorites.html")
    });
};

const injectContentScript = ({url}) => {
    if (url.match(/(?!(.*)guests$)https:\/\/(www\.)?nts\.live\/shows\/(.*)/g)) {
        chrome.tabs.executeScript({
            file: "nts-favorites.js"
        });
    }
};

const onDocumentLoad = () => {
    chrome.browserAction.onClicked.addListener(openFavoritesTab);
    chrome.webNavigation.onCompleted.addListener(injectContentScript);
    chrome.webNavigation.onHistoryStateUpdated.addListener(injectContentScript);

    chrome.runtime.onSuspend.addListener(() => {
        chrome.webNavigation.onCompleted.removeListener(injectContentScript)
        chrome.webNavigation.onHistoryStateUpdated.removeListener(injectContentScript)
    });
};

onDocumentLoad();
