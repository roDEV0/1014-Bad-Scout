<script>
  import { signUp } from "$lib/auth.remote";
</script>

<!--TODO: Add client side check to make sure request follows all requirements -->
<form {...signUp}>
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
</form>
