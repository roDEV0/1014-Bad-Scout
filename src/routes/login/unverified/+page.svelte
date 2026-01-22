<script lang="ts">
    import { verifyUserCode } from "$lib/auth.remote";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Field from "$lib/components/ui/field/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { CircleAlert } from "lucide-svelte";
</script>

<main class="h-full max-w-md m-auto">
    <form class="mx-auto m-20" {...verifyUserCode}>
        <Field.Group>
            <Field.Field>
                <Field.Label for="code" class="text-lg"
                    >Verification Code</Field.Label
                >
                <Input
                    id="code"
                    type="text"
                    placeholder="Code"
                    {...verifyUserCode.fields.code.as("text")}
                />
                <Field.Description class="text-sm"
                    >Enter the verification code sent to you.</Field.Description
                >
                <Field.Description class="text-xs"
                    >If you don't have a code, please email
                    kelbick.3@dublinstudents.net</Field.Description
                >
            </Field.Field>
            <Field.Field>
                <Button type="submit">Verify!</Button>
            </Field.Field>
        </Field.Group>
    </form>
    {#each verifyUserCode.fields.allIssues() as issue}
        <CircleAlert color="#fb2c36" class="inline" />
        <p class="text-red-500 inline m-1">{issue.message}</p>
    {/each}
</main>
