const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '',
    database: 'estoque'
});

db.connect(err => {
    if (err) throw err;
    console.log("Conectado ao banco de dados!");
});

// Rota para buscar categorias
app.get('/categorias', (req, res) => {
    const query = 'SELECT * FROM categorias';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar categorias:', err);
            return res.status(500).send('Erro ao buscar categorias');
        }
        res.json(results);
    });
});
// Rota para cadastrar uma categoria
app.post('/categorias', (req, res) => {
    const { nome } = req.body;
    const query = 'INSERT INTO categorias (nome) VALUES (?)';
    db.query(query, [nome], (err, result) => {
        if (err) {
            console.error('Erro ao inserir categoria:', err);
            return res.status(500).send('Erro ao inserir categoria');
        }
        res.status(201).send('Categoria cadastrada com sucesso');
    });
});

// Rota para atualizar uma categoria
app.put('/categorias/:id', (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    const query = 'UPDATE categorias SET nome = ? WHERE id = ?';
    db.query(query, [nome, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar categoria:', err);
            return res.status(500).send('Erro ao atualizar categoria');
        }
        res.send('Categoria atualizada com sucesso');
    });
});

// Rota para excluir uma categoria
app.delete('/categorias/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM categorias WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir categoria:', err);
            return res.status(500).send('Erro ao excluir categoria');
        }
        res.send('Categoria excluída com sucesso');
    });
});

// Rota para cadastrar um produto
app.post('/produtos', (req, res) => {
    const { nome, quantidade, preco, marca, descricao, categoria_id } = req.body;
    const query = 'INSERT INTO produtos (nome, quantidade, preco, marca, descricao, categoria_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [nome, quantidade, preco, marca, descricao, categoria_id], (err, result) => {
        if (err) {
            console.error('Erro ao inserir produto:', err);
            return res.status(500).send('Erro ao inserir produto');
        }
        res.status(201).send('Produto cadastrado com sucesso');
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
// Rota para listar produtos
app.get('/produtos', (req, res) => {
    const query = 'SELECT * FROM produtos';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            return res.status(500).send('Erro ao buscar produtos');
        }
        res.json(results);
    });
});
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
