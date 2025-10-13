<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  let name = "Guest";
</script>

<!-- Check to see whether the page is currently active to set background color -->
<div class="navbar">
  <a class={page.url.pathname === "/" ? "active" : ""} href="/">Home</a>
  <a
    class={page.url.pathname.startsWith("/search") ? "active" : ""}
    href="/search">Search</a
  >
  <a
    class={page.url.pathname.startsWith("/guides") ? "active" : ""}
    href="/guides">Guides</a
  >
  <a
    class={page.url.pathname.startsWith("/leaderboard") ? "active" : ""}
    href="/leaderboard">Leaderboard</a
  >
  <a
    class={page.url.pathname.startsWith("/login") ? "active" : ""}
    href="/login">Login</a
  >
  <button
    class={page.url.pathname.startsWith("/authtest") ? "active" : ""}
    on:click={() => goto("/authtest")}>Auth Test</button
  >
  <a class="account" href="/account">{name}</a>
</div>

<style>
  .navbar {
    background-color: black;
    overflow: hidden;
    padding: 0;
    margin: 0;
  }

  .navbar a {
    float: left;
    color: #f2f2f2;
    background-color: black;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
  }

  .navbar button {
    float: left;
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
  }

  .navbar a:hover {
    background-color: #ddd;
    color: black;
  }

  .navbar a.active {
    background-color: #a59525;
    color: white;
  }

  .navbar a.account {
    float: right;
  }
</style>
