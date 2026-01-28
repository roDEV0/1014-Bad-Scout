<script lang="ts">
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
  import type { HTMLAttributes } from "svelte/elements";

  const components: { title: string; href: string; description: string }[] = [
    {
      title: "Alert Dialog",
      href: "/docs/components/alert-dialog",
      description:
        "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
      title: "Hover Card",
      href: "/docs/components/hover-card",
      description:
        "For sighted users to preview content available behind a link.",
    },
    {
      title: "Progress",
      href: "/docs/components/progress",
      description:
        "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
      title: "Scroll-area",
      href: "/docs/components/scroll-area",
      description: "Visually or semantically separates content.",
    },
    {
      title: "Tabs",
      href: "/docs/components/tabs",
      description:
        "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
      title: "Tooltip",
      href: "/docs/components/tooltip",
      description:
        "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
  ];

  type ListItemProps = HTMLAttributes<HTMLAnchorElement> & {
    title: string;
    href: string;
    content: string;
  };
</script>

<div class="w-full">
  <NavigationMenu.Root class="border-b w-full max-w-full justify-between pr-5">
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <NavigationMenu.Trigger>Item One</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <NavigationMenu.Link>Link</NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>
    <NavigationMenu.List class="justify-end">
      <NavigationMenu.Item class="justify-end">hello</NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
</div>
