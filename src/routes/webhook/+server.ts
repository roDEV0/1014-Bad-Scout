import { HMAC_KEY } from "$env/static/private";
import { clients } from "$lib/server/clients";
import { error } from "@sveltejs/kit";
import { ArkErrors } from "arktype";
import { createHmac } from "crypto";
import { notification } from "tbarequest";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const hash = request.headers.get("X-TBA-HMAC");

  const data = notification(await request.clone().json());
  if (data instanceof ArkErrors) error(400);

  const hmac = createHmac("sha256", HMAC_KEY);
  const payload = Buffer.from(await request.text());
  const hmacResult = hmac.update(payload).digest("hex");

  if (hmacResult !== hash) error(403);

  switch (data.message_type) {
    //   case "verification":
    //   case "ping": {
    //     break;
    //   }
    // }
    case "ping": {
      clients.forEach((emit) => {
        emit("message", `Webhook: ${Date.now()}`);
      });
      break;
    }
  }
  return new Response();
};
