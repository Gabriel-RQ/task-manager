<script>
	let atividades = [];
	let nome = '';
	let descricao = '';
	let dataAtividade = '';
	let editandoId = null;
	let mostrarModal = false;

	let nomeInput;
	let descricaoInput;
	let dataInput;

	function abrirModal(atividade = null) {
		if (atividade) {
			editandoId = atividade.id;
			nome = atividade.nome;
			descricao = atividade.descricao;
			dataAtividade = atividade.dataAtividade;
		} else {
			editandoId = null;
			nome = '';
			descricao = '';
			dataAtividade = '';
		}
		mostrarModal = true;
		setTimeout(() => nomeInput?.focus(), 100); // foca no primeiro campo
	}

	function fecharModal() {
		mostrarModal = false;
		nome = '';
		descricao = '';
		dataAtividade = '';
		editandoId = null;
	}

	function salvar() {
		if (!nome.trim() || !descricao.trim() || !dataAtividade) return;

		if (editandoId) {
			atividades = atividades.map((a) =>
				a.id === editandoId ? { ...a, nome, descricao, dataAtividade } : a
			);
		} else {
			atividades = [
				...atividades,
				{
					id: Date.now(),
					nome,
					descricao,
					dataAtividade,
					data: new Date(),
					concluida: false
				}
			];
		}
		fecharModal();
	}

	function excluir(id) {
		atividades = atividades.filter((a) => a.id !== id);
		if (editandoId === id) fecharModal();
	}

	function alternarConclusao(id) {
		atividades = atividades.map((a) =>
			a.id === id ? { ...a, concluida: !a.concluida } : a
		);
	}

	function formatarData(data) {
		const d = new Date(data);
		return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
	}
</script>

<div class="container">
	<main>
		<h1>Minhas Atividades</h1>
		<button class="nova" on:click={() => abrirModal()}>Nova Atividade</button>

		{#if atividades.length === 0}
			<p class="vazio">Nenhuma atividade cadastrada.</p>
		{:else}
			<ul>
				{#each atividades as a (a.id)}
					<li class:concluida={a.concluida}>
						<div class="conteudo">
							<strong>{a.nome}</strong>
							<small>Criado em {formatarData(a.data)}</small>
							<p>{a.descricao}</p>
							<p class="data-prevista">Data da atividade: {new Date(a.dataAtividade).toLocaleDateString('pt-BR')}</p>
						</div>
						<div class="botoes">
							<button class="btn concluir" on:click={() => alternarConclusao(a.id)}>
								{a.concluida ? 'Desmarcar' : 'Concluir'}
							</button>
							<button class="btn editar" on:click={() => abrirModal(a)}>Editar</button>
							<button class="btn excluir" on:click={() => excluir(a.id)}>Excluir</button>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</main>
</div>

{#if mostrarModal}
	<div class="overlay" on:click={fecharModal}>
		<div class="modal" on:click|stopPropagation>
			<h2>{editandoId ? 'Editar Atividade' : 'Nova Atividade'}</h2>
			<input
				bind:this={nomeInput}
				bind:value={nome}
				placeholder="Nome da atividade"
				on:keydown={(e) => e.key === 'Enter' && descricaoInput?.focus()}
			/>
			<textarea
				bind:this={descricaoInput}
				bind:value={descricao}
				placeholder="Descrição"
				on:keydown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), dataInput?.focus())}
			></textarea>
			<input
				bind:this={dataInput}
				type="date"
				bind:value={dataAtividade}
				on:keydown={(e) => e.key === 'Enter' && salvar()}
			/>
			<div class="botoes-modal">
				<button class="btn cancelar" on:click={fecharModal}>Cancelar</button>
				<button class="btn salvar" on:click={salvar}>
					{editandoId ? 'Salvar' : 'Adicionar'}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(body) {
		background: #1c1c1c;
		color: #fff;
		font-family: sans-serif;
		margin: 0;
		padding: 0;
	}

	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 20px;
	}

	main {
		width: 100%;
		max-width: 900px;
		text-align: center;
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

	li.concluida {
		opacity: 0.6;
		text-decoration: line-through;
	}

	.conteudo {
		flex: 1;
		text-align: left;
	}

	.conteudo strong {
		color: #ffc751;
		font-size: 1.2rem;
		display: block;
		margin-bottom: 5px;
	}

	.conteudo small {
		color: #aaa;
		font-size: 0.8rem;
		display: block;
		margin-bottom: 8px;
	}

	.data-prevista {
		color: #bbb;
		font-size: 0.85rem;
		margin-top: 8px;
	}

	.botoes {
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

	.btn.concluir {
		background-color: #28a745;
	}
	.btn.editar {
		background-color: #007bff;
	}
	.btn.excluir {
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

	.botoes-modal {
		display: flex;
		justify-content: flex-end;
		margin-top: 15px;
		gap: 10px;
	}

	.btn.salvar {
		background: #ffc751;
		color: black;
	}
	.btn.cancelar {
		background: #444;
	}
</style>
