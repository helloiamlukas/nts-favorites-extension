<template>
    <div style="text-align: center">
        <h1>Reset Favorites</h1>
        <div v-if="!storageDeleted">
            <p>⚠️ This will delete all saved shows/episodes and can <strong>NOT</strong> be reverted.</p>
            <label style="display:block; margin: 1em 0">
                <input type="checkbox" v-model="checkbox">
                I understand, I want to delete all my shows & episodes
            </label>
            <button type="button" @click="clearStorage" :disabled="!checkbox">Clear All</button>
        </div>
        <div v-else>Your favorites have been deleted.</div>
    </div>
</template>

<script>
    export default {
        name: "Options",
        data() {
            return {
                checkbox: false,
                storageDeleted: false
            }
        },
        methods: {
            clearStorage() {
                chrome.storage.sync.clear(() => {
                    this.storageDeleted = true;
                })
            }
        }
    };
</script>