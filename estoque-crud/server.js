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

// Rota para cadastrar um produto
app.post('/produtos', (req, res) => {
    const { nome, quantidade, preco, prateleira, descricao, categoria_id } = req.body;
    const query = 'INSERT INTO produtos (nome, quantidade, preco, prateleira, descricao, categoria_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [nome, quantidade, preco, prateleira, descricao, categoria_id], (err, result) => {
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
