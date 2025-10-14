<script lang="ts">
  import { logOut, verifyUserExists } from "$lib/auth.remote";

	const user = await verifyUserExists();
</script>

<h1>Your name is: {user.firstName}</h1>

<form {...logOut}>
	<button>Log out!</button>
</form>