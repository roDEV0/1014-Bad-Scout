<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/navbar.svelte';
	let { children } = $props();
</script>

<Navbar />
<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
