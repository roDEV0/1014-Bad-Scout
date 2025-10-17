<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.ts"
    import { createPollSubmission } from "$lib/polls.remote.ts";
    import { writable } from 'svelte/store';

    const submissionBroadcast = writable({})

    async function submitEvent () {

    }
</script>

<Button>Button</Button>