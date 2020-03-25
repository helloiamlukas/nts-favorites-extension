global.browser = require("webextension-polyfill");

import moment from "moment";
import {
  addToFavorites,
  getFromFavorites,
  removeFromFavorites
} from "./Storage";
import {
  getPageDate,
  getPageDescription,
  getPageImageUrl,
  getPageLocation,
  getPageTitle,
  getPageType,
  renderFavoritesButton
} from "./NTS";

const loadStorageItemFromURL = async url => {
  url = new URL(url).href;

  const item = await getFromFavorites(url);

  return item
    ? { item, isFavorite: true }
    : {
        // create new storage item
        item: {
          title: getPageTitle(document),
          description: getPageDescription(document),
          image_url: getPageImageUrl(document),
          location: getPageLocation(document),
          date: getPageDate(document),
          created_at: moment().format(),
          url,
          type: getPageType(url)
        },
        isFavorite: false
      };
};

const renderExtension = () => {
  if (getPageTitle(document) == null) return; // abort if NTS page is still not fully rendered (e.g. due to an AJAX request)

  loadStorageItemFromURL(window.location).then(({ item, isFavorite }) => {
    renderFavoritesButton(
      {
        type: item.type,
        active: isFavorite,
        onPress: event => {
          isFavorite ? removeFromFavorites(item) : addToFavorites(item);
          event.stopPropagation();
        }
      },
      document
    );
  });
};

const watchDocumentChanges = () => {
  const observer = new MutationObserver(() => renderExtension());
  observer.observe(document.querySelector("body"), { attributes: true });
};

const watchStorageChanges = () => {
  chrome.storage.onChanged.addListener(
    (changes, area) => area == "sync" && renderExtension()
  );
};

const onDocumentLoad = () => {
  renderExtension();
  watchStorageChanges();
  watchDocumentChanges();
};

onDocumentLoad();
