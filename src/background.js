import {getKey} from "./Settings";

const openFavoritesTab = (event) => {
    getKey('new_tab').then(({new_tab}) => {
        if (new_tab) {
            chrome.tabs.create({
                url: chrome.runtime.getURL("favorites/favorites.html")
            });
            return;
        }

        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => chrome.tabs.update(tabs[0].id, {
            url: chrome.runtime.getURL("favorites/favorites.html")
        }));
    })
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
    console.log('1e')
    chrome.runtime.onSuspend.addListener(() => {
        chrome.webNavigation.onCompleted.removeListener(injectContentScript)
        chrome.webNavigation.onHistoryStateUpdated.removeListener(injectContentScript)
    });
};

onDocumentLoad();
