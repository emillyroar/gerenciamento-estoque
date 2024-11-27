// Função para carregar categorias no <select>
function carregarCategorias() {
    // Fazendo uma requisição GET para buscar categorias do backend
    fetch('http://localhost:3000/categorias')
        .then(response => response.json())
        .then(categorias => {
            const selectCategoria = document.getElementById('categoria');
            selectCategoria.innerHTML = ''; // Limpa o <select> antes de adicionar as categorias

            // Cria a opção padrão
            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'Selecione a Categoria';
            selectCategoria.appendChild(optionDefault);

            // Adiciona as opções de categorias
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;
                option.textContent = categoria.nome;
                selectCategoria.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Erro ao carregar categorias:', err);
        });
}

// Chama a função para carregar as categorias ao carregar a página
document.addEventListener('DOMContentLoaded', carregarCategorias);
// Função para carregar produtos na tabela
function carregarProdutos() {
    // Fazendo uma requisição GET para buscar produtos do backend
    fetch('http://localhost:3000/produtos')
        .then(response => response.json())
        .then(produtos => {
            const tableBody = document.getElementById('produtosTableBody');
            tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar os produtos

            produtos.forEach(produto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>${produto.quantidade}</td>
                    <td>${produto.preco}</td>
                    <td>${produto.categoria_id}</td>
                    <td>
                        <button onclick="excluirProduto(${produto.id})">Excluir</button>
                        <button onclick="editarProduto(${produto.id})">Editar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(err => {
            console.error('Erro ao carregar produtos:', err);
        });
}

// Chama a função para carregar os produtos ao carregar a página
document.addEventListener('DOMContentLoaded', carregarProdutos);
// Função para carregar categorias na tabela
function carregarCategorias() {
    fetch('http://localhost:3000/categorias')
        .then(response => response.json())
        .then(categorias => {
            const tableBody = document.getElementById('categoriasTableBody');
            tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar as categorias

            categorias.forEach(categoria => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${categoria.id}</td>
                    <td>${categoria.nome}</td>
                    <td>
                        <button onclick="editarCategoria(${categoria.id})">Editar</button>
                        <button onclick="excluirCategoria(${categoria.id})">Excluir</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(err => {
            console.error('Erro ao carregar categorias:', err);
        });
}

// Função para adicionar uma nova categoria
document.getElementById('categoriaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('categoriaNome').value;

    fetch('http://localhost:3000/categorias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        carregarCategorias(); // Atualiza a lista de categorias
        document.getElementById('categoriaForm').reset();
    })
    .catch(err => console.error('Erro ao cadastrar categoria:', err));
});

// Função para excluir uma categoria
function excluirCategoria(id) {
    fetch(`http://localhost:3000/categorias/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        carregarCategorias(); // Atualiza a lista de categorias
    })
    .catch(err => console.error('Erro ao excluir categoria:', err));
}

// Função para editar uma categoria (apenas preenche o campo com o nome)
function editarCategoria(id) {
    const nome = prompt("Digite o novo nome da categoria:");

    if (nome) {
        fetch(`http://localhost:3000/categorias/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome })
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            carregarCategorias(); // Atualiza a lista de categorias
        })
        .catch(err => console.error('Erro ao editar categoria:', err));
    }
}

// Chama a função para carregar categorias ao carregar a página
document.addEventListener('DOMContentLoaded', carregarCategorias);

// Função para cadastrar uma nova categoria
function cadastrarCategoria(event) {
    event.preventDefault();

    const categoriaNome = document.getElementById('categoriaNome').value;

    // Adicione a lógica para salvar a categoria no banco de dados aqui
    // Por enquanto, apenas imprimiremos a categoria no console
    console.log(`Cadastrando categoria: ${categoriaNome}`);

    // Limpar o formulário
    document.getElementById('categoriaForm').reset();
}

// Adicione um evento de envio ao formulário de categoria
document.getElementById('categoriaForm').addEventListener('submit', cadastrarCategoria);

