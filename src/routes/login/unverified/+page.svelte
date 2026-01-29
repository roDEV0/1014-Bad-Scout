<script lang="ts">
  import { logOut, verifyUserCode } from "$lib/auth.remote";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { CircleAlert } from "lucide-svelte";
</script>

<main class="h-full max-w-md m-auto">
  <Card.Root class="mx-auto w-full max-w-md mt-20 gap-1.5">
    <Card.Header class="mb-1">
      <Card.Title class="text-2xl">Verify</Card.Title>
    </Card.Header>
    <Card.Content>
      <form {...verifyUserCode}>
        <Field.Group>
          <Field.Field>
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
              >Codes will be sent manually to you. If you don't have a code,
              please email kelbick.3@dublinstudents.net</Field.Description
            >
          </Field.Field>
          <Field.Field>
            <Button type="submit">Verify!</Button>
          </Field.Field>
        </Field.Group>
      </form>
    </Card.Content>
    <Card.Footer class="block">
      <form class="block" {...logOut}>
        <button
          class="cursor-pointer text-gray-700 underline mt-2 block"
          type="submit">Log out</button
        >
      </form>
      <div class="mt-2">
        {#each verifyUserCode.fields.allIssues() as issue}
          <CircleAlert color="#fb2c36" class="inline-block" />
          <p class="text-red-500 inline m-1">{issue.message}</p>
        {/each}
      </div>
    </Card.Footer>
  </Card.Root>
</main>
