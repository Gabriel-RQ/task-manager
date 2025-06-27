import { checkUserExists, insertUser, verifyLogin } from "$lib/server/db";
import { fail, redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const data = Object.fromEntries(await request.formData());
    const { username, password } = data;

    if (!username || !password) {
      return fail(400, {
        success: false,
        message: "Nome de usuário e senha são obrigatórios.",
      });
    }

    try {
      const userExists = await checkUserExists((username as string).trim());

      if (!userExists) {
        return fail(404, {
          success: false,
          message: "Usuário não encontrado.",
        });
      }

      const isValidLogin = await verifyLogin(
        (username as string).trim(),
        (password as string).trim()
      );

      if (!isValidLogin) {
        return fail(401, {
          success: false,
          message: "Nome de usuário ou senha incorretos.",
        });
      }
    } catch {
      return fail(500, {
        success: false,
        message: "Erro ao verificar usuário.",
      });
    }

    console.log("Login successful, setting cookie.");
    cookies.set("username", (username as string).trim(), {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    redirect(303, "/");
  },
  register: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const { username, password } = data;

    if (!username || !password) {
      return fail(400, {
        success: false,
        message: "Nome de usuário e senha são obrigatórios.",
      });
    }

    try {
      await insertUser(
        (username as string).trim(),
        (password as string).trim()
      );
    } catch {
      return fail(500, {
        success: false,
        message: "Erro ao registrar usuário.",
      });
    }

    return { success: true, message: "Usuário registrado com sucesso." };
  },
};
