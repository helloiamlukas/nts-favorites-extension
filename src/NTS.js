import moment from "moment";

const SHOW = "Show";
const EPISODE = "Episode";

function getPathname(url) {
  return new URL(url).pathname;
}

const isEpisode = url => {
  return getPathname(url).includes("/episodes/");
};

const isShow = url => {
  return getPathname(url).includes("/shows/");
};

const getPageType = url => {
  if (isEpisode(url)) return EPISODE;
  if (isShow(url)) return SHOW;
  return null;
};

const getPageTitle = document => {
  const el = document.querySelector(".bio__title h1");
  return el ? el.textContent : null;
};

const getPageDescription = document => {
  const el = document.querySelector(".description h3");
  return el ? el.textContent : null;
};

const getPageImageUrl = document => {
  const el = document.querySelector("#bg");
  return el && el.style.backgroundImage
    ? el.style.backgroundImage.replace(/^(url\()*("|')|("|')(\))*(;)*$/g, "")
    : null;
};

const getPageLocation = document => {
  const el = document.querySelector(".bio h2");
  return el ? el.childNodes[0].textContent : null;
};

const getPageDate = document => {
  const el = document.querySelector("#episode-broadcast-date");
  return el
    ? moment(el.textContent.replace(/[^0-9.]/g, ""), "DD.MM.YY").format()
    : null;
};

const renderFavoritesButton = ({ type, active, onPress }, document) => {
  const buttonWrapper =
    document.getElementById("nts-favorites-extension") ||
    document.createElement("div");
  buttonWrapper.id = "nts-favorites-extension";
  buttonWrapper.style.display = "inline";

  buttonWrapper.innerHTML = `
        <button type="button" class="nts-app nts-link nts-link--black text-uppercase text-bold text-right" style="padding: 12px">
            <svg xmlns="http://www.w3.org/2000/svg" style="position: relative; top: -1px; margin-right: 2px" viewBox="0 0 34 30" height="14" fill="#000">
                ${active &&
                  '<path d="M17 29.7l-.6-.5C3.5 18.7 0 15 0 9c0-5 4-9 9-9 4.1 0 6.4 2.3 8 4.1C18.6 2.3 20.9 0 25 0c5 0 9 4 9 9 0 6-3.5 9.7-16.4 20.2l-.6.5z"/>'}
                <path d="M25 0c5 0 9 4 9 9 0 6-3.5 9.7-16.4 20.2l-.6.5-.6-.5C3.5 18.7 0 15 0 9c0-5 4-9 9-9 4.1 0 6.4 2.3 8 4.1C18.6 2.3 20.9 0 25 0zm-.533 3c-3.267 0-5.04 1.924-6.44 3.482L17 7.673l-1.027-1.19C14.573 4.923 12.8 3 9.533 3 5.893 3 3 5.84 3 9.414 3 14.088 5.987 17.204 17 26c11.013-8.797 14-11.912 14-16.586C31 5.841 28.107 3 24.467 3z"/>
            </svg>
            ${active ? "Unfavorite" : "Favorite"} ${type == SHOW ? "Host" : "Episode"}
        </button>
    `;

  const favoritesButton = buttonWrapper.firstElementChild;
  favoritesButton.addEventListener("click", event => onPress(event));

  const el = document.querySelector(".share-menu");
  if (el) el.insertAdjacentElement("beforebegin", buttonWrapper);
};

export {
  renderFavoritesButton,
  isEpisode,
  isShow,
  getPageType,
  getPageTitle,
  getPageDescription,
  getPageImageUrl,
  getPageLocation,
  getPageDate,
  EPISODE,
  SHOW
};
