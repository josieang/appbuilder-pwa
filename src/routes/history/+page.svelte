<script lang="ts">
    import HistoryCard from '$lib/components/HistoryCard.svelte';
    import ScrolledContent from '$lib/components/ScrolledContent.svelte';
    import Navbar from '$lib/components/Navbar.svelte';
    import { t } from '$lib/data/stores';
    import { clearHistory } from '$lib/data/history';
    import DeleteSweepIcon from '$lib/icons/DeleteSweepIcon.svelte';

    export let data;
    async function onClearHistory() {
        await clearHistory();
        data.history = [];
    }
</script>

<div class="navbar h-16">
    <Navbar>
        <!-- Button to close the drawer/sidebar -->
        <!-- <div slot="left-buttons" /> -->
        <label for="sidebar" slot="center">
            <div class="btn btn-ghost normal-case text-xl">{$t['Menu_History']}</div>
        </label>
        <div slot="right-buttons">
            <button class="dy-btn dy-btn-ghost dy-btn-circle" on:click={onClearHistory}>
                <DeleteSweepIcon color="white" />
            </button>
        </div>
        <!-- <div slot="right-buttons" /> -->
    </Navbar>
</div>

<ScrolledContent>
    <div slot="scrolled-content" style="height: calc(100vh - 5rem);height: calc(100dvh - 5rem);">
        {#each data.history.reverse() as h}
            <HistoryCard history={h} />
        {/each}
    </div>
</ScrolledContent>
