<script>
    import Poll from '$lib/components/submissions/form.svelte';
    import Box from '$lib/components/info/infoBlock.svelte';
</script>

<main>
    <div>
        <div>
            <div>
                <h1>Team 1014 | Easy Scout</h1>
                <p>Created by Gianmichael R. and Michael K.</p>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-5 w-full content-center p-5">
            <div class="grid grid-cols-4 gap-5 w-full content-center">
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
            </div>
            <Box/>
        </div>
    </div>

</main>

<style>
    main {
        background-image: linear-gradient(#000000, #0c0c0c);
        background-repeat: no-repeat;
        min-height: 100vh;
    }

    .container {
        margin: 8px
    }

    .container .header {
        justify-content: center;
        align-items: center;
        text-align: center;
        margin: 4px;
    }
    .container .header-text {
        padding: 10px;
        background-color: black;
        color: white;
    }

</style>

