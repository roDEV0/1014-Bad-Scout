<script lang="ts">
  import { logOut } from "$lib/auth.remote";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<h1>
  {data.user ? `Your name is ${data.user.name}!` : "You are not logged in!"}
</h1>

<form {...logOut}>
  <button>Log out!</button>
</form>
