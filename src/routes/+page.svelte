<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { scale } from "svelte/transition";
  import type { PageProps } from "./$types";
  import { enhance } from "$app/forms";

  let updatingId: number | null = $state(null);
  let showModal = $state(false);

  let title = $state("");
  let description = $state("");
  let date = $state("");

  function openModal(task: Task | null = null) {
    if (task) {
      updatingId = task.id;
      title = task.title;
      description = task.description;
      date = task.date;
    } else {
      updatingId = null;
      title = "";
      description = "";
      date = "";
    }
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    updatingId = null;
  }

  function deleteTask(id: number) {
    fetch(`/api/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        invalidateAll();
      } else {
        console.error("Failed to delete task");
      }
    });

    // if (editandoId === id) fecharModal();
  }

  function toggleStatus(id: number, status: boolean) {
    fetch(`/api/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: status }),
    }).then((response) => {
      if (response.ok) {
        invalidateAll();
      } else {
        console.error("Failed to toggle task status");
      }
    });
  }

  function formatDate(date: string) {
    const d = new Date(date);
    return (
      d.toLocaleDateString("pt-BR") +
      " às " +
      d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    );
  }

  let { data, form }: PageProps = $props();
</script>

<section class="container">
  <main>
    <h1>Minhas Atividades</h1>
    <button class="nova" onclick={() => openModal()}>Nova Atividade</button>

    {#if !data.tasks || data.tasks.length === 0}
      <p class="vazio">Nenhuma atividade cadastrada.</p>
    {:else}
      <ul>
        {#each data.tasks as task (task.id)}
          <li class:done={task.completed}>
            <div class="content">
              <strong>{task.title}</strong>
              <small>Criado em {formatDate(task.created_at)}</small>
              <p>{task.description}</p>
              <p class="due-date">
                Data da atividade: {new Date(task.date).toLocaleDateString(
                  "pt-BR"
                )}
              </p>
            </div>
            <div class="buttons">
              <button
                class="btn complete"
                onclick={() => toggleStatus(task.id, !task.completed)}
              >
                {task.completed ? "Desmarcar" : "Concluir"}
              </button>
              <button class="btn edit" onclick={() => openModal(task)}
                >Editar</button
              >
              <button class="btn delete" onclick={() => deleteTask(task.id)}
                >Excluir</button
              >
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </main>
</section>

{#if showModal}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div class="overlay" role="alert">
    <div class="modal" in:scale={{ duration: 200 }}>
      <h2>{updatingId ? "Editar Atividade" : "Nova Atividade"}</h2>

      <form
        action="?/new"
        method="post"
        id="new-task-form"
        use:enhance={() =>
          async ({ update }) => {
            await update();
            closeModal();
          }}
      >
        <input
          bind:value={title}
          placeholder="Nome da atividade"
          name="title"
        />
        <textarea
          bind:value={description}
          placeholder="Descrição"
          name="description"
        ></textarea>
        <input type="date" bind:value={date} name="date" />
      </form>

      <form
        action="?/update"
        method="post"
        id="update-task-form"
        use:enhance={() =>
          async ({ update }) => {
            await update();
            closeModal();
          }}
        class="hidden"
      >
        <input type="hidden" name="id" value={updatingId} />
        <input
          bind:value={title}
          placeholder="Nome da atividade"
          name="title"
          class="hidden"
        />
        <textarea
          bind:value={description}
          placeholder="Descrição"
          name="description"
          class="hidden"
        ></textarea>
        <input type="date" bind:value={date} name="date" class="hidden" />
      </form>

      <div class="btns-modal">
        <button class="btn cancell" type="button" onclick={closeModal}
          >Cancelar</button
        >
        {#if updatingId}
          <button class="btn save" type="submit" form="update-task-form">
            Atualizar
          </button>
        {:else}
          <button class="btn save" type="submit" form="new-task-form">
            Adicionar
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
  }

  h1 {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }

  ul {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 20px;
    list-style: none;
    padding: 0;
    margin-top: 20px;
  }

  li {
    background: #2a2a2a;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #3a3a3a;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  li.done {
    opacity: 0.6;
    text-decoration: line-through;
  }

  .content {
    flex: 1;
    text-align: left;
  }

  .content strong {
    color: #ffc751;
    font-size: 1.2rem;
    display: block;
    margin-bottom: 5px;
  }

  .content small {
    color: #aaa;
    font-size: 0.8rem;
    display: block;
    margin-bottom: 8px;
  }

  .due-date {
    color: #bbb;
    font-size: 0.85rem;
    margin-top: 8px;
  }

  .buttons {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    flex-wrap: wrap;
  }

  .btn {
    padding: 6px 12px;
    border-radius: 5px;
    font-size: 0.85rem;
    color: white;
    font-weight: bold;
    border: none;
    cursor: pointer;
  }

  .btn.complete {
    background-color: #28a745;
  }
  .btn.edit {
    background-color: #007bff;
  }
  .btn.delete {
    background-color: #dc3545;
  }

  .nova {
    background: #ffc751;
    color: #000;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    margin-bottom: 25px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
  }

  .vazio {
    color: #888;
    margin-top: 20px;
  }

  /* Modal */

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .modal {
    background: #1e1e1e;
    padding: 30px;
    border-radius: 10px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    text-align: center;
  }

  .modal h2 {
    margin-bottom: 20px;
  }

  .modal input,
  .modal textarea {
    width: 100%;
    margin-bottom: 10px;
    padding: 10px;
    background: #1c1c1c;
    border: 1px solid #ffc751;
    border-radius: 5px;
    color: #ccc;
    font-size: 0.9rem;
  }

  .modal textarea {
    resize: vertical;
    min-height: 60px;
  }

  .btns-modal {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
    gap: 10px;
  }

  .btn.save {
    background: #ffc751;
    color: black;
  }
  .btn.cancell {
    background: #444;
  }
</style>
