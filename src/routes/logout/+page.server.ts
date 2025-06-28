import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
  cookies.delete("username", {
    path: "/",
    sameSite: "strict",
    secure: true,
  });
  redirect(302, "/login");
};
