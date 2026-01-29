<!-- <script>
  import { signUp } from "$lib/auth.remote";
</script> -->

<!--TODO: Add client side check to make sure request follows all requirements -->
<!-- <form {...signUp}>
  <h1>Login</h1>
  <label>
    <h2>Email</h2>
    <input {...signUp.fields.email.as("email")} />
  </label>
  <label>
    <h2>Password</h2>
    <input {...signUp.fields.password.as("password")} />
  </label>
  <label>
    <h2>First Name</h2>
    <input {...signUp.fields.firstName.as("text")} />
  </label>
  <label>
    <h2>Last Inital</h2>
    <input {...signUp.fields.lastInitial.as("text")} />
  </label>
  <button>Sign Up!</button>
</form> -->

<script lang="ts">
  import { signUp } from "$lib/auth.remote";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  const id = $props.id();
</script>

<Card.Root class="mx-auto w-full max-w-md mt-20">
  <Card.Header>
    <Card.Title class="text-2xl">Sign Up</Card.Title>
    <Card.Description>Ready to scout?</Card.Description>
  </Card.Header>
  <Card.Content>
    <form {...signUp}>
      <FieldGroup>
        <FieldSet>
          <div class="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel for="firstName-{id}">First Name</FieldLabel>

              <Input
                id="firstName-{id}"
                placeholder="First Name"
                required
                {...signUp.fields.firstName.as("text")}
              />
            </Field>
            <Field>
              <FieldLabel for="lastName-{id}">Last Name</FieldLabel>
              <Input
                id="lastName-{id}"
                placeholder="Last Name"
                required
                {...signUp.fields.lastName.as("text")}
              />
            </Field>
          </div>
        </FieldSet>
        <Field>
          <FieldLabel for="email-{id}">Email</FieldLabel>

          <Input
            id="email-{id}"
            placeholder="lastname.num@dublinstudents.net"
            required
            {...signUp.fields.email.as("email")}
          />
        </Field>
        <Field>
          <div class="flex items-center">
            <FieldLabel for="password-{id}">Password</FieldLabel>
          </div>
          <Input
            id="password-{id}"
            required
            {...signUp.fields.password.as("password")}
          />
          <FieldDescription class="text-center text-sm">
            8 character minimum with one letter, one number, and one special
            character.
          </FieldDescription>
        </Field>
        <Field>
          <Button type="submit" class="w-full">Sign Up</Button>
          <FieldDescription class="text-center">
            Already have an account? <a href="/login">Login</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  </Card.Content>
</Card.Root>
