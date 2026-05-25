// ==========================================================================
// Seleção de Elementos do DOM
// ==========================================================================
const btnNovaPostagem = document.getElementById('btnNovaPostagem');
const modalPostagem = document.getElementById('modalPostagem');
const modalVisualizacao = document.getElementById('modalVisualizacao');
const formCadastro = document.getElementById('formCadastro');
const galeriaFotos = document.getElementById('galeriaFotos');
const estadoVazio = document.getElementById('estadoVazio');
const contadorFotos = document.getElementById('contadorFotos');

// Elementos do Modal de Visualização
const viewTitulo = document.getElementById('viewTitulo');
const viewData = document.getElementById('viewData');
const viewImagem = document.getElementById('viewImagem');
const viewDescricao = document.getElementById('viewDescricao');

// Array que vai guardar os nossos posts (carrega do LocalStorage se existir)
let posts = JSON.parse(localStorage.getItem('devlog_posts')) || [];

// ==========================================================================
// Funções de Controle dos Modais
// ==========================================================================
function abrirModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
}

function fecharModais() {
    modalPostagem.classList.remove('active');
    modalVisualizacao.classList.remove('active');
    document.body.style.overflow = ''; // Libera o scroll
    formCadastro.reset();
}

// Ouvintes para fechar clicando no "X" ou fora do modal (no overlay)
document.querySelectorAll('.modal-close, .modal-overlay, #btnCancelarPost').forEach(botao => {
    botao.addEventListener('click', fecharModais);
});

btnNovaPostagem.addEventListener('click', () => abrirModal(modalPostagem));

// ==========================================================================
// Renderização do Feed (Estilo Instagram)
// ==========================================================================
function renderizarFeed() {
    galeriaFotos.innerHTML = '';
    
    // Atualiza contador e esconde/mostra o aviso de "Sem fotos"
    contadorFotos.textContent = `${posts.length} ${posts.length === 1 ? 'publicação' : 'publicações'}`;
    
    if (posts.length === 0) {
        estadoVazio.style.display = 'block';
        return;
    } else {
        estadoVazio.style.display = 'none';
    }

    // Criar os cards na tela (do mais recente para o mais antigo)
    posts.slice().reverse().forEach((post) => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        
        card.innerHTML = `
            <img src="${post.url}" alt="${post.titulo}" class="photo-card-image" onerror="this.src='https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=500&auto=format&fit=crop'">
            <div class="photo-card-content">
                <h3>${post.titulo}</h3>
                <p class="photo-card-description">${post.descricao}</p>
                <span class="photo-card-date">${post.data}</span>
            </div>
        `;

        // Evento de clique para abrir o card expandido
        card.addEventListener('click', () => mostrarPostDetalhado(post));
        
        galeriaFotos.appendChild(card);
    });
}

// Expande a foto e mostra os detalhes no segundo modal
function mostrarPostDetalhado(post) {
    viewTitulo.textContent = post.titulo;
    viewData.textContent = `Postado em: ${post.data}`;
    viewImagem.src = post.url;
    viewDescricao.textContent = post.descricao;
    abrirModal(modalVisualizacao);
}

// ==========================================================================
// Cadastro de Nova Postagem
// ==========================================================================
formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();

    const novoPost = {
        id: Date.now(),
        titulo: document.getElementById('inputTitulo').value,
        url: document.getElementById('inputURL').value,
        descricao: document.getElementById('inputDescricao').value,
        data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    };

    posts.push(novoPost);
    localStorage.setItem('devlog_posts', JSON.stringify(posts)); // Salva no navegador
    
    fecharModais();
    renderizarFeed();
});

// Inicializa o feed quando a página carrega
renderizarFeed();
