import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
  login: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const { username, password } = data;
    console.log("Login attempt:", { username, password });
  },
  register: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const { username, password } = data;
    console.log("Register attempt:", { username, password });
  },
};
