// src/lib/clients.js

import type { Unsafe } from "sveltekit-sse";

export const clients: Map<
  NonNullable<App.Locals["user"]>,
  (eventName: string, data: string) => Unsafe<void, Error>
> = new Map();
