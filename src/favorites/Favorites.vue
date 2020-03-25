<template>
  <div class="container">
    <div class="row" style="margin-top:1rem;margin-bottom:2rem">
      <div class="col-12 col-md-6">
        <h1 style="margin-bottom: 0">Favorites</h1>
      </div>
      <div
        class="col-12 col-md-6"
        style="display: flex; justify-content: flex-end"
      >
        <div class="search-input">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 600 600"
            height="24"
          >
            <path
              fill="#fff"
              d="M413.38 392.4a169.89 169.89 0 0 0 18.19-27.4c43-83 10.73-185.28-72.09-228.39a168.63 168.63 0 0 0-227.82 72.27c-43 83-10.74 185.28 72.09 228.39a168.49 168.49 0 0 0 183.35-18L461.62 494l26.56-26.62zm-194.25 15.16C152.67 373 126.77 290.9 161.28 224.28a135.43 135.43 0 0 1 182.82-58c66.46 34.6 92.36 116.66 57.85 183.28a135.43 135.43 0 0 1-182.82 58z"
            ></path>
          </svg>
          <input
            type="search"
            v-model="searchTerm"
            autofocus
            v-debounce="filterFavorites"
          />
        </div>
      </div>
      <div class="col-12" style="margin-top:1rem" v-if="searchTerm">
        <p>
          There {{ favorites.length == 1 ? "is" : "are" }}
          <strong>{{ favorites.length }}</strong> result{{
            favorites.length == 1 ? "" : "s"
          }}
          for "{{ searchTerm }}"
        </p>
      </div>
    </div>
    <template v-if="!searchTerm || (searchTerm && shows.length)">
      <div class="row" style="margin-top:1rem">
        <div class="col-12">
          <h2>Shows</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-12" style="margin-top: 0.4rem" v-if="shows.length == 0">
          <p>
            You haven't saved any shows yet. Visit
            <a href="https://www.nts.live/explore" rel="noopener"
              >nts.live/explore</a
            >
            to discover new shows ✨
          </p>
        </div>
        <div class="col-12 col-md-6 col-lg-4" v-for="show in shows">
          <a :href="show.url" rel="noopener" class="item">
            <img
              :src="show.image_url | thumbnail"
              :alt="show.title"
              loading="lazy"
            />
            <div class="info">
              <span>{{ show.location }}</span>
            </div>
            <h3>{{ show.title }}</h3>
          </a>
        </div>
      </div>
    </template>
    <template v-if="!searchTerm || (searchTerm && episodes.length)">
      <div class="row" style="margin-top:1rem">
        <div class="col-12">
          <h2>Episodes</h2>
        </div>
      </div>
      <div class="row">
        <div
          class="col-12"
          style="margin-top: 0.4rem"
          v-if="episodes.length == 0"
        >
          <p>
            You haven't saved any epsisodes yet. Find the latest episodes at
            <a href="https://www.nts.live/latest" rel="noopener"
              >nts.live/latest</a
            >
            🌎
          </p>
        </div>
        <div class="col-12 col-md-6 col-lg-4" v-for="episode in episodes">
          <a :href="episode.url" rel="noopener" class="item">
            <img
              :src="episode.image_url | thumbnail"
              :alt="episode.title"
              loading="lazy"
            />
            <div class="info">
              <span>{{ episode.date | date }}</span
              ><span>{{ episode.location }}</span>
            </div>
            <h3>{{ episode.title }}</h3>
          </a>
        </div>
      </div>
    </template>
    <div class="row" style="text-align:center;">
      <div class="col-12" style="margin-top:4rem">
        <button type="button" @click="exportFile">EXPORT FAVORITES</button>
        <p style="margin-top: 0.8rem">
          <small
            >You can import your favorites through the
            <a href="" @click="openOptionsPage">extension options</a>.</small
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { exportFavorites, getAllFavorites, importFavorites } from "../Storage";
import { EPISODE, SHOW } from "../NTS";
import moment from "moment";
import Fuse from "fuse.js";

export default {
  name: "Favorites",
  data() {
    return {
      searchTerm: "",
      searchOptions: {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        minMatchCharLength: 1,
        keys: [
          {
            name: "title",
            weight: 0.8
          },
          {
            name: "description",
            weight: 0.4
          }
        ]
      },
      favorites: [],
      indexedFavorites: new Fuse([]),
      importReady: false
    };
  },
  methods: {
    watchStorage(changes, area) {
      if (area == "sync") this.getFavorites();
    },
    getFavorites() {
      getAllFavorites().then(items => {
        this.favorites = items;
        this.indexedFavorites = new Fuse(items, this.searchOptions);
      });
    },
    filterFavorites() {
      this.favorites = this.searchTerm
        ? this.indexedFavorites.search(this.searchTerm)
        : this.indexedFavorites.list;
    },
    openOptionsPage(e) {
      e.preventDefault();
      chrome.runtime.openOptionsPage();
    },
    exportFile() {
      exportFavorites().then(items => {
        chrome.downloads.download({
          url:
            "data:application/json;base64," +
            btoa(unescape(encodeURIComponent(JSON.stringify(items)))),
          filename: "nts-favorites.json"
        });
      });
    }
  },
  computed: {
    episodes() {
      return this.favorites
        .map(e => (e.item ? e.item : e))
        .filter(item => item.type == EPISODE);
    },
    shows() {
      return this.favorites
        .map(e => (e.item ? e.item : e))
        .filter(item => item.type == SHOW);
    }
  },
  filters: {
    date(value) {
      return moment(value).format("DD.MM.YY");
    },
    thumbnail(image_url) {
      return image_url.replace("resize/1600x1600/", "resize/400x400/");
    }
  },
  mounted() {
    chrome.storage.onChanged.addListener(this.watchStorage);
    this.getFavorites();
  },
  destroyed() {
    chrome.storage.onChanged.removeListener(this.watchStorage);
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700&display=swap&subset=latin-ext");

@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/reboot";
@import "~bootstrap/scss/grid";

h1,
h2,
h3,
h4,
h5,
h6,
.info,
input[type="file"],
button {
  font-family: "Roboto Condensed", sans-serif;
  text-transform: uppercase;
  font-weight: 700;
}

.item {
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.6rem !important;
  display: block;
  margin-bottom: 2rem;
  height: 330px;
  overflow: hidden;
  background-color: transparent;

  img {
    object-fit: cover;
    height: 200px;
    width: 100%;
  }

  .info {
    padding: 0.5rem 0 0.3rem 0;
    font-weight: 400;
    display: flex;
    font-size: 0.8rem;
    justify-content: space-between;
  }
}

a,
a.visited,
a:hover,
a:focus {
  text-decoration: underline;
  color: #fff;
}

a.item,
a.item:visited {
  text-decoration: none;
  background-color: #000;
  transition: 300ms all ease;
}

a.item:hover,
a.item:focus {
  text-decoration: none;
  border-color: rgba(255, 255, 255, 0.56);
  box-shadow: 6px 6px 0px rgba(255, 255, 255, 0.22);
}

.search-input {
  display: flex;
  align-items: center;
}

input,
button,
input:focus,
button:focus {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: #000;
  color: #fff;
  outline: none;
}

button {
  border: 1px solid #fff;
  padding: 0.4rem 1rem;
}

button:disabled {
  opacity: 0.4;
}

input[type="search"] {
  font-size: 1.2rem;
  line-height: 2.5rem;
  box-shadow: 0px 1px 0px #fff;
  border: none;
  margin-left: 0.2rem;
  width: 250px;
}
</style>
