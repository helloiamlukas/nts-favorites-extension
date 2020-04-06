<template>
    <div style="text-align: center">
        <h1>NTS Favorites</h1>
        <label style="display:block; margin: 1em 0">
            <input type="checkbox" v-model="newTab"/>
            Open Favorites in new tab
        </label>
        <button type="button" @click="saveNewTab" :disabled="newTabSaved">
            Save
        </button>
        <hr/>
        <h1>Import Favorites</h1>
        <div v-if="!importFinished">
            <input
                    type="file"
                    ref="file"
                    accept="application/json"
                    @change="importReady = true"
            /><br/>
            <p>
                ⚠️ This will overwrite all previously saved shows/episodes and can
                <strong>NOT</strong> be reverted.
            </p>
            <button type="button" @click="importFile" :disabled="!importReady">
                {{ importReady ? "Import" : "Select file..." }}
            </button>
        </div>
        <div v-else>
            Your favorites have been imported.
        </div>
        <hr/>
        <h1>Reset Favorites</h1>
        <div v-if="!storageDeleted">
            <p>
                ⚠️ This will delete all saved shows/episodes and can
                <strong>NOT</strong> be reverted.
            </p>
            <label style="display:block; margin: 1em 0">
                <input type="checkbox" v-model="checkbox"/>
                I understand, I want to delete all my shows & episodes
            </label>
            <button type="button" @click="clearStorage" :disabled="!checkbox">
                Clear All
            </button>
        </div>
        <div v-else>Your favorites have been deleted.</div>
    </div>
</template>

<script>
    import {clearFavorites, importFavorites} from "../Storage";
    import {getKey, setKey} from "../Settings";

    export default {
        name: "Options",
        data() {
            return {
                checkbox: false,
                storageDeleted: false,
                importReady: false,
                importFinished: false,
                newTabSaved: false,
                newTab: false
            };
        },
        methods: {
            clearStorage() {
                clearFavorites().then(() => (this.storageDeleted = true));
            },
            importFile() {
                const reader = new FileReader();
                reader.onload = ({target: {result}}) =>
                    importFavorites(JSON.parse(result)).then(
                        () => (this.importFinished = true)
                    );
                reader.readAsText(this.$refs.file.files[0]);
            },
            saveNewTab() {
                setKey({'new_tab': this.newTab}).then(() => this.newTabSaved = true)
            }
        },
        mounted() {
            getKey('new_tab').then(({new_tab}) => (this.newTab = new_tab || false));
        }
    };
</script>
<style>
    hr {
        margin: 1rem 0;
    }
</style>
