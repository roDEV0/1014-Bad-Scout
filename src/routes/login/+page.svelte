<script>
  import { login, signUp } from "$lib/auth.remote";
  import { page } from '$app/state';

	const ref = page.url.searchParams.get("ref");
</script>

<!--TODO: Add client side check to make sure request follows all requirements -->
<form {...login.enhance(async ({ submit, data }) => {
	if (ref) data.redirect_url = ref;
	await submit();
})}>
<h1>Login</h1>
	<label>
		<h2>Email</h2>
		<input {...login.fields.email.as('email')} />
	</label>
		<label>
		<h2>Password</h2>
		<input {...login.fields.password.as('password')} />
	</label>
	<button>Login</button>
</form>