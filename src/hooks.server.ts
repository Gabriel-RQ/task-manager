import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  if (event.cookies.get("username")) {
    event.locals.user = {
      username: event.cookies.get("username") as string,
      isAuthenticated: true,
    };
  }

  return await resolve(event);
};
