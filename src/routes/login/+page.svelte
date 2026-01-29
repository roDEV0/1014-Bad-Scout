<script lang="ts">
  import { login } from "$lib/auth.remote";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  const id = $props.id();
</script>

<Card.Root class="mx-auto w-full max-w-md mt-20">
  <Card.Header>
    <Card.Title class="text-2xl">Login</Card.Title>
    <Card.Description
      >Enter your email below to login to your account</Card.Description
    >
  </Card.Header>
  <Card.Content>
    <form {...login}>
      <FieldGroup>
        <Field>
          <FieldLabel for="email-{id}">Email</FieldLabel>
          <Input
            id="email-{id}"
            placeholder="lastname.num@dublinstudents.net"
            required
            {...login.fields.email.as("email")}
          />
        </Field>
        <Field>
          <div class="flex items-center">
            <FieldLabel for="password-{id}">Password</FieldLabel>
          </div>
          <Input
            id="password-{id}"
            required
            {...login.fields.password.as("password")}
          />
        </Field>
        <Field>
          <Button type="submit" class="w-full">Login</Button>
          <FieldDescription class="text-center">
            Don't have an account? <a href="/signup">Sign up</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  </Card.Content>
</Card.Root>
