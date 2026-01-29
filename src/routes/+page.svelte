<script lang="ts">
  import type { PageProps } from "./$types";
  let { data }: PageProps = $props();
</script>

{#if !data.user?.verified}
  <h1>Not Verified</h1>
{/if}
