import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import {
  checkUserExists,
  getTasks,
  getUserId,
  insertTask,
  updateTask,
} from "$lib/server/db";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  if (!locals.user || !locals.user.isAuthenticated) {
    redirect(303, "/login");
  }

  if (!checkUserExists(locals.user.username)) {
    cookies.delete("username", {
      path: "/",
      sameSite: "strict",
      secure: true,
      httpOnly: true,
    });
  }

  try {
    const userId = await getUserId(locals.user.username);
    if (!userId) {
      throw new Error("User not found");
    }
    const tasks = await getTasks(userId);
    return { tasks, user: locals.user.username };
  } catch (error) {
    return {
      tasks: [],
      error: "Failed to load tasks.",
      user: locals.user.username,
    };
  }
};

export const actions: Actions = {
  new: async ({ request, locals }) => {
    if (!locals.user || !locals.user.isAuthenticated) {
      return { error: "Não autorizado" };
    }
    const data = Object.fromEntries(await request.formData()) as any;
    const { title, description, date }: Task = data;
    if (!title || !description || !date) {
      return { error: "Dados inválidos" };
    }

    try {
      const userId = await getUserId(locals.user.username);
      if (!userId) {
        return { error: "Usuário não encontrado" };
      }
      await insertTask({
        user_id: userId,
        title,
        description,
        date,
      });
      return { success: "Tarefa criada com sucesso" };
    } catch (error) {
      console.log(error);

      return { error: "Erro ao criar tarefa" };
    }
  },
  update: async ({ request, locals }) => {
    if (!locals.user || !locals.user.isAuthenticated) {
      return { error: "Não autorizado" };
    }
    const data = Object.fromEntries(await request.formData()) as any;
    const { id, title, description, date }: Task = data;
    if (!id || !title || !description || !date) {
      return { error: "Dados inválidos" };
    }

    try {
      const userId = await getUserId(locals.user.username);
      if (!userId) {
        return { error: "Usuário não encontrado" };
      }
      await updateTask(id, {
        title,
        description,
        date,
      });
      return { success: "Tarefa atualizada com sucesso" };
    } catch (error) {
      console.log(error);
      return { error: "Erro ao atualizar tarefa" };
    }
  },
};
