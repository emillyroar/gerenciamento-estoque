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
