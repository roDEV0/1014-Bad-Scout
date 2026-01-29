<script lang="ts">
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";

  let { user }: { user: App.Locals["user"] } = $props();
</script>

<div class="w-full">
  <NavigationMenu.Root
    class="border-b border-black w-full max-w-full justify-between pr-5"
  >
    <NavigationMenu.List></NavigationMenu.List>
    <NavigationMenu.List class="justify-end">
      {#if user}
        <NavigationMenu.Item class="justify-end">
          <NavigationMenu.Link href="/profile">{user.name}</NavigationMenu.Link>
        </NavigationMenu.Item>
      {:else}
        <NavigationMenu.Item class="justify-end">
          <NavigationMenu.Link href="/login">Login</NavigationMenu.Link>
        </NavigationMenu.Item>
      {/if}
    </NavigationMenu.List>
  </NavigationMenu.Root>
</div>
