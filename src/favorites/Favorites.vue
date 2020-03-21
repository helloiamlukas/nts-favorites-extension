<template>
    <div class="container">
        <div class="row" style="margin-top:1rem">
            <div class="col-12">
                <h1>Favorites</h1>
            </div>
        </div>
        <div class="row" style="margin-top:1rem">
            <div class="col-12">
                <h2>Shows</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-12" style="margin-top: 0.4rem" v-if="shows.length == 0">
                <p>
                    You haven't saved any shows yet. Visit
                    <a href="https://www.nts.live/explore" rel="noopener">nts.live/explore</a> to discover new shows ✨
                </p>
            </div>
            <div class="col-12 col-md-6 col-lg-4" v-for="show in shows">
                <a :href="show.url" rel="noopener" class="item">
                    <img :src="show.image_url|thumbnail" :alt="show.title" loading="lazy">
                    <div class="info">
                        <span>{{ show.location }}</span>
                    </div>
                    <h3>{{ show.title }}</h3>
                </a>
            </div>
        </div>
        <div class="row" style="margin-top:1rem">
            <div class="col-12">
                <h2>Episodes</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-12" style="margin-top: 0.4rem" v-if="episodes.length == 0">
                <p>
                    You haven't saved any epsisodes yet. Find the latest episodes at
                    <a href="https://www.nts.live/latest" rel="noopener">nts.live/latest</a> 🌎
                </p>
            </div>
            <div class="col-12 col-md-6 col-lg-4" v-for="episode in episodes">
                <a :href="episode.url" rel="noopener" class="item">
                    <img :src="episode.image_url|thumbnail" :alt="episode.title" loading="lazy">
                    <div class="info">
                        <span>{{ episode.date|date }}</span><span>{{ episode.location }}</span>
                    </div>
                    <h3>{{ episode.title }}</h3>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    import {getAllFavorites} from '../Storage'
    import {EPISODE, SHOW} from '../NTS'
    import moment from 'moment'

    export default {
        name: "Favorites",
        data() {
            return {
                favorites: []
            }
        },
        methods: {
            watchStorage(changes, area) {
                if (area == 'sync') this.getFavorites()
            },
            getFavorites() {
                getAllFavorites().then(items => this.favorites = items);
            }
        },
        computed: {
            episodes() {
                return this.favorites.filter(item => item.type == EPISODE)
            },
            shows() {
                return this.favorites.filter(item => item.type == SHOW)
            }
        },
        filters: {
            date(value) {
                return moment(value).format('DD.MM.YY')
            },
            thumbnail(image_url) {
                return image_url.replace('resize/1600x1600/', 'resize/400x400/')
            }
        },
        mounted() {
            chrome.storage.onChanged.addListener(this.watchStorage)
            this.getFavorites();
        },
        destroyed() {
            chrome.storage.onChanged.removeListener(this.watchStorage)
        }
    };
</script>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700&display=swap&subset=latin-ext');

    @import "~bootstrap/scss/functions";
    @import "~bootstrap/scss/variables";
    @import "~bootstrap/scss/mixins";
    @import "~bootstrap/scss/reboot";
    @import "~bootstrap/scss/grid";

    h1, h2, h3, h4, h5, h6, .info {
        font-family: 'Roboto Condensed', sans-serif;
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

    a, a.visited, a:hover, a:focus {
        text-decoration: underline;
        color: #fff;
    }

    a.item, a.item:visited {
        text-decoration: none;
        background-color: #000;
        transition: 300ms all ease;
    }

    a.item:hover, a.item:focus {
        text-decoration: none;
        border-color: rgba(255, 255, 255, 0.56);
        box-shadow: 6px 6px 0px rgba(255, 255, 255, 0.22);
    }
</style>