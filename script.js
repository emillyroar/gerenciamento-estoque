document.getElementById('categoriaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('categoriaNome').value;

    fetch('http://localhost:3000/categoria', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        carregarCategoria(); // Atualiza a lista de categorias
        document.getElementById('categoriaForm').reset();
    })
    .catch(err => console.error('Erro ao cadastrar categoria:', err));
});

// Função para carregar categorias no <select> e na tabela
function carregarCategoria() {
    fetch('http://localhost:3000/categoria')
        .then(response => response.json())
        .then(categorias => {
            const selectCategoria = document.getElementById('categoria');
            selectCategoria.innerHTML = '<option value="">Selecione a Categoria</option>'; // Limpa o select antes de adicionar as opções

            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id; // A chave de ID da categoria
                option.textContent = categoria.nome; // O nome da categoria
                selectCategoria.appendChild(option); // Adiciona ao select
            });
        })
        .catch(err => {
            console.error('Erro ao carregar categorias:', err);
        });
}

// Chama a função para carregar categorias ao carregar a página
document.addEventListener('DOMContentLoaded', carregarCategoria);

// Função para carregar os produtos na tabela
function carregarProduto() {
    fetch('http://localhost:3000/produto')
        .then(response => response.json())
        .then(produto => {
            const produtoTableBody = document.getElementById('produtoTableBody');
            produtoTableBody.innerHTML = '';

            produto.forEach(produto => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>${produto.quantidade}</td>
                    <td>${produto.preco}</td>
                    <td>${produto.categoria_nome}</td>
                    <td>
                        <button onclick="editarProduto(${produto.id})">Editar</button>
                        <button onclick="excluirProduto(${produto.id})">Excluir</button>
                    </td>
                `;
                produtoTableBody.appendChild(tr);
            });
        })
        .catch(err => console.error('Erro ao carregar produtos:', err));
}

// Função para cadastrar ou editar produto
document.getElementById('produtoForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const quantidade = document.getElementById('quantidade').value;
    const preco = document.getElementById('preco').value;
    const marca = document.getElementById('marca').value;
    const descricao = document.getElementById('descricao').value;
    const categoria_id = document.getElementById('categoria').value;

    const produto = { nome, quantidade, preco, marca, descricao, categoria_id };

    fetch('http://localhost:3000/produto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        carregarProduto();
    })
    .catch(err => console.error('Erro ao cadastrar produto:', err));
});

// Função para excluir produto
function excluirProduto(id) {
    if (confirm('Deseja realmente excluir este produto?')) {
        fetch(`http://localhost:3000/produto/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            carregarProduto();
        })
        .catch(err => console.error('Erro ao excluir produto:', err));
    }
}

// Função para editar produto
function editarProduto(id) {
    fetch(`http://localhost:3000/produto/${id}`)
        .then(response => response.json())
        .then(produto => {
            document.getElementById('nome').value = produto.nome;
            document.getElementById('quantidade').value = produto.quantidade;
            document.getElementById('preco').value = produto.preco;
            document.getElementById('marca').value = produto.marca;
            document.getElementById('descricao').value = produto.descricao;
            document.getElementById('categoria').value = produto.categoria_id;
        })
        .catch(err => console.error('Erro ao editar produto:', err));
}

// Carregar categorias e produtos na inicialização
window.onload = function() {
    carregarCategoria();
    carregarProduto();
};
// Rota para cadastrar um produto
app.post('/produto', (req, res) => {
    const { nome, quantidade, preco, marca, descricao, categoria_id } = req.body;
    const query = 'INSERT INTO produto (nome, quantidade, preco, marca, descricao, categoria_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [nome, quantidade, preco, marca, descricao, categoria_id], (err, result) => {
        if (err) {
            console.error('Erro ao inserir produto:', err);
            return res.status(500).send('Erro ao inserir produto');
        }
        res.status(201).send('Produto cadastrado com sucesso');
    });
});

// Rota para listar produtos
app.get('/produto', (req, res) => {
    const query = 'SELECT * FROM produto';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            return res.status(500).send('Erro ao buscar produtos');
        }
        res.json(results);
    });
});

// Rota para atualizar um produto
app.put('/produto/:id', (req, res) => {
    const { id } = req.params;
    const { nome, quantidade, preco, marca, descricao, categoria_id } = req.body;
    const query = 'UPDATE produto SET nome = ?, quantidade = ?, preco = ?, marca = ?, descricao = ?, categoria_id = ? WHERE id = ?';
    db.query(query, [nome, quantidade, preco, marca, descricao, categoria_id, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar produto:', err);
            return res.status(500).send('Erro ao atualizar produto');
        }
        res.send('Produto atualizado com sucesso');
    });
});

// Rota para excluir um produto
app.delete('/produto/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM produto WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir produto:', err);
            return res.status(500).send('Erro ao excluir produto');
        }
        res.send('Produto excluído com sucesso');
    });
});
