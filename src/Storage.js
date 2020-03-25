function setStorage(object) {
  return new Promise((resolve, reject) =>
    chrome.storage.sync.set(object, result => resolve(result))
  );
}

function removeStorage(key) {
  return new Promise((resolve, reject) =>
    chrome.storage.sync.remove(key, result => resolve(result))
  );
}

function clearStorage() {
  return new Promise((resolve, reject) =>
    chrome.storage.sync.clear(result => resolve(result))
  );
}

function getStorage(keys) {
  return new Promise((resolve, reject) =>
    chrome.storage.sync.get(keys, result => resolve(result))
  );
}

function getIdentifierFromURL(url) {
  return new URL(url).pathname.replace("/shows/", "");
}

const importFavorites = async items => {
  await clearFavorites();
  await setStorage(items);
};

const clearFavorites = async () => {
  await clearStorage();
};

const exportFavorites = async () => {
  return await getStorage(null);
};

const addToFavorites = async item => {
  await setStorage({
    [getIdentifierFromURL(item.url)]: item
  });
};

const removeFromFavorites = async item => {
  await removeStorage(getIdentifierFromURL(item.url));
};

const getFromFavorites = async url => {
  const item = Object.values(await getStorage(getIdentifierFromURL(url)));
  return item.length == 0 ? null : item[0];
};

const getAllFavorites = async () => {
  return Object.values(await getStorage(null));
};

export {
  clearFavorites,
  importFavorites,
  exportFavorites,
  removeFromFavorites,
  addToFavorites,
  getFromFavorites,
  getAllFavorites
};
