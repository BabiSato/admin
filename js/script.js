// Receber o botão salvar do HTML
const botaoSalvar = document.getElementById('salvar')

const bk = 'http://localhost:3010/api' // URL da API

// Receber os dados do formulário
const getDadosForm = function() {
    let livroJSON = {}
    let status = true

    // Recebe as caixas do HTML os dados a serem enviados para a API
    let nomeLivro = document.getElementById('title')
    let autorLivro = document.getElementById('author') // Corrigido o id para 'author'
    let valorLivro = document.getElementById('price')

    if(nomeLivro.value == '' || autorLivro.value == '' || valorLivro.value == '') {
        alert('Todos os dados devem ser preenchidos.')
        status = false
    } else {
        // Criamos um objeto JSON com os atributos necessários
        livroJSON.title = nomeLivro.value
        livroJSON.author = autorLivro.value // Alterado 'autor' para 'author'
        livroJSON.price = parseFloat(valorLivro.value) // Garantindo que price seja um número
    }

    if(status) {
        return livroJSON
    } else {
        return false
    }
}

// Função para salvar um livro novo
const postLivro = async function(dadosLivro) {
    let url = bk

    console.log("Enviando dados:", dadosLivro)  // Adicionando log para verificar os dados

    let response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dadosLivro)
    })

    if(response.status == 201) {
        alert('Registro inserido com sucesso.')
        getLivros()
    } else {
        alert('Não foi possível inserir o livro, verifique os dados encaminhados.')
    }
}

// Função para listar todos os livros
const getLivros = async function() {
    // URL da API
    let url = bk

    // Executa a URL no servidor para trazer a lista de livros
    let response = await fetch(url)

    // Converte o retorno em JSON
    let dados = await response.json()
    console.log(dados)

    // Chama a função para criar a lista de livros
    setCardItens(dados)
}

// Função para criar a lista de itens no HTML
const setCardItens = function(dadosLivros) {
    // Recebe a caixa principal onde será criada a lista de livros
    let divListDados = document.getElementById('listDados')

    // Limpa a lista de dados antes de carregar novamente
    divListDados.innerText = ''

    dadosLivros.forEach(function(livro) {
        // Cria os elementos no HTML
        let divDados    = document.createElement('div')
        let divTitle    = document.createElement('div')  
        let divAutor    = document.createElement('div')
        let divPrice    = document.createElement('div')

        // Escrevendo os dados do ARRAY de livros nos elementos HTML
        divTitle.innerText      = livro.title
        divAutor.innerText      = livro.author // Alterado 'autor' para 'author'
        divPrice.innerText      = livro.price

        // Adiciona atributos nas tags HTML
        divDados.setAttribute('id', 'dados')
        divDados.setAttribute('class', 'linha dados')

        // Associa um elemento dentro de outro no HTML
        divListDados.appendChild(divDados)
        divDados.appendChild(divTitle)
        divDados.appendChild(divAutor)
        divDados.appendChild(divPrice)
    })
}

// Função para buscar um livro pelo ID
const getBuscarLivro = async function(id) {
    let url = `http://localhost:3010/${id}`

    let response = await fetch(url)

    let dados = await response.json()

    if(response.status == 200) {
        // Coloca os dados da API nas caixas do formulário
        document.getElementById('title').value = dados.books[0].title
        document.getElementById('author').value = dados.books[0].author // Alterado 'autor' para 'author'
        document.getElementById('price').value = dados.books[0].price

        // Guardando o ID do livro na área de sessão do navegador, para ser utilizado no put
        sessionStorage.setItem('idLivro', id)
    }
}

// Evento para o botão de salvar
botaoSalvar.addEventListener('click', function() {
    let dados = getDadosForm()

    if(dados) {
        // Validação para identificar qual requisição na API será realizada (POST ou PUT)
        if(document.getElementById('salvar').innerText == 'Salvar') {
            postLivro(dados)
        }
    }
})

// Ao carregar a página, exibe os livros
window.addEventListener('load', function() {
    getLivros()
})