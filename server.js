const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');


// Verificar se já existem categorias na tabela
db.query('SELECT COUNT(*) AS count FROM categoria', (err, result) => {
    if (err) {
        console.error('Erro ao verificar categorias:', err);
    } else {
        if (result[0].count === 0) {
            // Se não houver categorias, insira as categorias padrão
            categoriasPadrao.forEach(categoria => {
                db.query('INSERT INTO categoria (nome) VALUES (?)', [categoria.nome], (err, result) => {
                    if (err) {
                        console.error('Erro ao inserir categoria:', err);
                    } else {
                        console.log('Categoria inserida:', categoria.nome);
                    }
                });
            });
        }
    }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve arquivos estáticos (como script.js e imagens)

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '',
    database: 'estoque2'
});

db.connect(err => {
    if (err) throw err;
    console.log("Conectado ao banco de dados!");
});

const categoriasPadrao = [
    { nome: 'Eletrônicos' },
    { nome: 'Acessórios' }
];

// Rota para buscar categorias
app.get('/categoria', (req, res) => {
    const query = 'SELECT * FROM categoria';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar categorias:', err);
            return res.status(500).send('Erro ao buscar categorias');
        }
        res.json(results);
    });
});
// Rota para cadastrar uma categoria
app.post('/categoria', (req, res) => {
    const { nome } = req.body;
    const query = 'INSERT INTO categoria (nome) VALUES (?)';
    db.query(query, [nome], (err, result) => {
        if (err) {
            console.error('Erro ao inserir categoria:', err);
            return res.status(500).send('Erro ao inserir categoria');
        }
        res.status(201).send('Categoria cadastrada com sucesso');
    });
});

// Rota para atualizar uma categoria
app.put('/categoria/:id', (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    const query = 'UPDATE categoria SET nome = ? WHERE id = ?';
    db.query(query, [nome, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar categoria:', err);
            return res.status(500).send('Erro ao atualizar categoria');
        }
        res.send('Categoria atualizada com sucesso');
    });
});
        app.listen(3000, () => {
        console.log("Servidor rodando na porta 3000");
});

// Rota para excluir uma categoria
app.delete('/categoria/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM categoria WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir categoria:', err);
            return res.status(500).send('Erro ao excluir categoria');
        }
        res.send('Categoria excluída com sucesso');
    });
});

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
// Função para carregar categorias na tabela
function carregarCategoria() {
    fetch('http://localhost:3000/categoria')
        .then(response => response.json())
        .then(categoria => {
            const tableBody = document.getElementById('categoriaTableBody');
            tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar as categorias

            categoria.forEach(categoria => {
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

// Função para excluir uma categoria
function excluirCategoria(id) {
    fetch(`http://localhost:3000/categoria/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        carregarCategoria(); // Atualiza a lista de categorias
    })
    .catch(err => console.error('Erro ao excluir categoria:', err));
}

// Função para editar uma categoria (apenas preenche o campo com o nome)
function editarCategoria(id) {
    const nome = prompt("Digite o novo nome da categoria:");

    if (nome) {
        fetch(`http://localhost:3000/categoria/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome })
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            carregarCategoria(); // Atualiza a lista de categorias
        })
        .catch(err => console.error('Erro ao editar categoria:', err));
    }
}

// Rota para listar categorias
app.get('/categoria', (req, res) => {
    const query = 'SELECT * FROM categoria';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar categorias:', err);
            return res.status(500).send('Erro ao buscar categorias');
        }
        res.json(results);
    });
});

