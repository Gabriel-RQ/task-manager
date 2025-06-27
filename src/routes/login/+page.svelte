<script lang="ts">
  import { enhance } from "$app/forms";
  import { fly } from "svelte/transition";
  import type { PageProps } from "./$types";

  let username = $state("");
  let password = $state("");

  let { form }: PageProps = $props();
</script>

<section>
  <h1>Login</h1>
  <p>Faça login para acessar o sistema.</p>

  <form action="?/login" method="post" use:enhance>
    <label>
      <input
        type="text"
        name="username"
        placeholder="Nome do usuário"
        bind:value={username}
        required
      />
    </label>
    <label>
      <input
        type="password"
        name="password"
        placeholder="Senha"
        bind:value={password}
        required
      />
    </label>

    <button type="submit">Entrar</button>
  </form>

  <form action="?/register" method="post" use:enhance>
    <input type="text" name="username" class="hidden" bind:value={username} />
    <input
      type="password"
      name="password"
      class="hidden"
      bind:value={password}
    />
    <p class="dashed">Não tem uma conta?</p>
    <button type="submit" class="outline">Fazer cadastro</button>

    {#if form}
      {#if form.success}
        <span in:fly={{ x: 100, duration: 450 }} class:success={form.success}
          >{form.message}</span
        >
      {:else}
        <span in:fly={{ x: 100, duration: 450 }} class:error={!form.success}
          >{form.message}</span
        >
      {/if}
    {/if}
  </form>
</section>

<style>
  section {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    justify-content: center;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 300px;
  }
  input {
    width: 100%;
  }

  .dashed {
    text-align: center;
    position: relative;

    &::before,
    &::after {
      content: "";
      background-color: var(--accent-color);
      display: inline-block;
      height: 1px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 20%;
    }

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }
  }

  span {
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.75rem;
    text-align: center;
    width: 100%;

    &.success {
      background-color: #3fac3f;
    }

    &.error {
      background-color: #d14c4c;
    }
  }
</style>
