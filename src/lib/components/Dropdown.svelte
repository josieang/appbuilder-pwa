<!--
@component
A simple dropdown menu from DaisyUI.
-->
<script lang="ts">
    import { s, convertStyle } from '$lib/data/stores';
    import { createEventDispatcher } from 'svelte';
    export let cols = 6;
    const dispatch = createEventDispatcher();
</script>

<div class="dy-dropdown ">
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <label tabindex="0" class="dy-btn dy-btn-ghost p-0.5 dy-no-animation">
        <slot name="label" />
    </label>
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div
        tabindex="0"
        class="dy-dropdown-content dy-menu drop-shadow-lg mt-2.5 bg-base-100"
        class:min-w-[21rem]={cols == 6}
        class:min-w-[17.25rem]={cols == 5}
        style={convertStyle($s['ui.background'])}
        on:blur={() => dispatch('nav-end')}
    >
        <slot name="content" />
    </div>
</div>
