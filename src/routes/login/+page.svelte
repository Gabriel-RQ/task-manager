<script>
  let username = $state("");
  let password = $state("");
</script>

<section>
  <h1>Login</h1>
  <p>Faça login para acessar o sistema.</p>

  <form action="?/login" method="post">
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

  <form action="?/register" method="post">
    <input type="text" name="username" class="hidden" bind:value={username} />
    <input
      type="password"
      name="password"
      class="hidden"
      bind:value={password}
    />
    <p class="dashed">Não tem uma conta?</p>
    <button type="submit" class="outline">Fazer cadastro</button>
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
</style>
