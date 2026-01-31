<script lang="ts">
  import { source } from "sveltekit-sse";
  import type { PageProps } from "./$types";
  let { data }: PageProps = $props();
  const value = source("/events/test").select("message");
</script>

{#if !data.user?.verified}
  <h1>Not Verified</h1>
{/if}

<h1>HI: {$value}</h1>
