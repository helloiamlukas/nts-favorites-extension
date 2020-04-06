function setKey(object) {
    return new Promise((resolve, reject) =>
        chrome.storage.local.set(object, result => resolve(result))
    );
}

function getKey(keys) {
    return new Promise((resolve, reject) =>
        chrome.storage.local.get(keys, result => resolve(result))
    );
}

export {
    setKey, getKey
}