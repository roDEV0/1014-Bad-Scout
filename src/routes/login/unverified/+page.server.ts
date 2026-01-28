import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) return redirect(302, "/login");
  if (locals.user.verified) return redirect(302, "/");
};
