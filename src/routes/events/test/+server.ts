// src/routes/custom-event/+server.js
import { clients } from "$lib/server/clients";
import { error } from "@sveltejs/kit";
import { produce } from "sveltekit-sse";

function delay(milliseconds: number) {
  return new Promise(function run(resolve) {
    setTimeout(resolve, milliseconds);
  });
}

export function POST({ locals }) {
  if (!locals.user) error(401);
  return produce(
    async function start({ emit }) {
      if (!locals.user) return error(401);
      clients.set(locals.user, emit);
      const { error: err } = emit("message", "hi");
      if (err) {
        return;
      }
    },
    {
      stop() {
        if (!locals.user) return error(401);
        clients.delete(locals.user);
      },
    },
  );
}
