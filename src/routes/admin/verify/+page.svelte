<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import {
        generateVerificationCode,
        getUnverifiedUsers,
        verifyUserAdmin,
    } from "$lib/auth.remote";
    import Button from "$lib/components/ui/button/button.svelte";

    const user = await verifyUserAdmin();
    const unverifiedUsers = getUnverifiedUsers();
</script>

<Table.Root>
    <Table.Header>
        <Table.Row>
            <Table.Head>User Email</Table.Head>
            <Table.Head>Verification Code</Table.Head>
            <Table.Head>Generate Code</Table.Head>
            <Table.Head>Copy Email</Table.Head>
        </Table.Row>
    </Table.Header>
    <Table.Body>
        {#each unverifiedUsers.current as user}
            <Table.Row>
                <Table.Cell>{user.users.email}</Table.Cell>
                <Table.Cell>{user.unverified_users?.code ?? "None"}</Table.Cell>
                <Table.Cell
                    ><Button
                        onclick={async () => {
                            try {
                                await generateVerificationCode(user.users.id);
                                getUnverifiedUsers().refresh();
                            } catch (e) {
                                console.log(e);
                            }
                        }}>Generate</Button
                    ></Table.Cell
                >
                <Table.Cell
                    ><Button
                        onclick={() =>
                            navigator.clipboard.writeText(
                                `Dear ${user.users.firstName}, \n\nYour verification code for BadScout is ${user.unverified_users?.code}. \n\nThank you for scouting! :)`,
                            )}>Copy</Button
                    ></Table.Cell
                >
            </Table.Row>
        {/each}
    </Table.Body>
</Table.Root>
