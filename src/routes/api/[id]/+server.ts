import { deleteTask, toggleTaskCompletion } from "$lib/server/db";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({ locals, params }) => {
  if (!locals.user || !locals.user.isAuthenticated) {
    return new Response("Não autorizado", { status: 401 });
  }

  const taskId = parseInt(params.id);
  if (isNaN(taskId)) {
    return new Response("Tarefa inválida", { status: 400 });
  }

  try {
    await deleteTask(taskId);
    return new Response("Tarefa excluída com sucesso", { status: 200 });
  } catch (error) {
    return new Response("Erro ao excluir tarefa", { status: 500 });
  }
};

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
  if (!locals.user || !locals.user.isAuthenticated) {
    return new Response("Não autorizado", { status: 401 });
  }

  const taskId = parseInt(params.id);
  if (isNaN(taskId)) {
    return new Response("Tarefa inválida", { status: 400 });
  }

  const data = await request.json();

  if (data.completed === null) {
    return new Response("Dados inválidos", { status: 400 });
  }

  try {
    console.log("aq");

    await toggleTaskCompletion(taskId, data.completed);
    return new Response("Tarefa atualizada com sucesso", { status: 200 });
  } catch (error) {
    return new Response("Erro ao atualizar tarefa", { status: 500 });
  }
};
