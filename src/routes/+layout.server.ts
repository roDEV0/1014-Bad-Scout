import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ request, locals }) => {
  if (
    !locals.user &&
    !(
      request.url.endsWith("/") ||
      request.url.endsWith("/login") ||
      request.url.endsWith("/signup")
    )
  ) {
    return redirect(302, "/login");
  }

  if (
    locals.user &&
    !locals.user.verified &&
    !request.url.endsWith("/login/unverified")
  )
    return redirect(302, "/login/unverified");

  return { user: locals.user };
};
