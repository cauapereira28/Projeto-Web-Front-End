const carros = [
  { nome: 'BMW M4 2025', imagem: 'bmw.jpg', categoria: 'esportivo', pagina: 'bmw-m4.html', preco: 1186633, referencia: 'FIPE · out/2026' },
  { nome: 'BMW 745Le 2022', imagem: 'bmw2.jpg', categoria: 'sedan', pagina: 'bmw-745le.html', preco: 470543, referencia: 'FIPE · out/2026' },
  { nome: 'Koenigsegg Jesko', imagem: 'images.jpg', categoria: 'esportivo', pagina: 'koenigsegg-jesko.html', preco: 11900000, referencia: 'Referência de lançamento · 2019' },
  { nome: 'Alfa Romeo Giulia GTA', imagem: 'ita.jpg', categoria: 'esportivo', pagina: 'alfa-romeo-giulia.html', preco: 1176750, referencia: 'Preço divulgado · 2021' },
  { nome: 'Jeep Renegade 2025', imagem: 'jeep.jpg', categoria: 'suv', pagina: 'jeep-renegade.html', preco: 109088, referencia: 'FIPE · out/2026' },
  { nome: 'Lamborghini Aventador SVJ 2022', imagem: 'lambo.jpg', categoria: 'esportivo', pagina: 'lamborghini-aventador.html', preco: 9640925, referencia: 'FIPE · out/2026' },
  { nome: 'Mercedes-AMG GT R 2019', imagem: 'mercedes.jpg', categoria: 'esportivo', pagina: 'mercedes-amg.html', preco: 1594785, referencia: 'FIPE · out/2026' },
  { nome: 'Porsche Cayenne Turbo GT 2022', imagem: 'porsche.jpg', categoria: 'suv', pagina: 'porsche-cayenne.html', preco: 860989, referencia: 'FIPE · out/2026' },
  { nome: 'Land Rover Discovery SE 2020', imagem: 'rangeRover.jpg', categoria: 'suv', pagina: 'land-rover-discovery.html', preco: 222715, referencia: 'FIPE · out/2026' },
  { nome: 'Rolls-Royce Cullinan 2022', imagem: 'rolls%20royce%20cinza.jpg', categoria: 'suv', pagina: 'rolls-royce-cullinan.html', preco: 6431307, referencia: 'FIPE · out/2026' },
  { nome: 'Ferrari 458 Italia 2014', imagem: 'main.jpg', categoria: 'esportivo', pagina: 'ferrari-458.html', preco: 2687248, referencia: 'FIPE · out/2026' },
  { nome: 'Tiger', imagem: 'download.jpg', categoria: 'moto', pagina: 'tiger.html', preco: 43012, referencia: 'Estimativa Tiger 800 2015 · FIPE nov/2026' }
];

const carrinho = [];
const listaVeiculos = document.querySelector('#lista-veiculos');
const campoBusca = document.querySelector('#busca');
const campoCategoria = document.querySelector('#categoria');
const quantidade = document.querySelector('#quantidade');
const mensagemCarrinho = document.querySelector('#mensagem-carrinho');

function formatarPreco(preco) {
  const partes = preco.toFixed(2).split('.');
  let inteiro = '';

  for (let i = 0; i < partes[0].length; i++) {
    inteiro += partes[0][i];
    const restantes = partes[0].length - i - 1;
    if (restantes > 0 && restantes % 3 === 0) inteiro += '.';
  }

  return `R$ ${inteiro},${partes[1]}`;
}

function salvarCarrinho() {
  localStorage.setItem('carrinho', carrinho.join(','));
}

function carregarCarrinho() {
  const dados = localStorage.getItem('carrinho');

  if (dados) {
    const itens = dados.split(',');

    for (let i = 0; i < itens.length; i++) {
      const indice = Number(itens[i]);
      if (indice >= 0 && indice < carros.length) carrinho.push(indice);
    }
  }
}

function mostrarQuantidade() {
  const contador = document.querySelector('#quantidade-carrinho');
  if (contador) contador.textContent = carrinho.length;
}

function mostrarCarros() {
  if (!listaVeiculos) return;

  const textoBusca = campoBusca.value.toLowerCase();
  const categoria = campoCategoria.value;
  let encontrados = [];

  for (let i = 0; i < carros.length; i++) {
    const nomeCombina = carros[i].nome.toLowerCase().includes(textoBusca);
    const categoriaCombina = categoria === 'todos' || carros[i].categoria === categoria;
    if (nomeCombina && categoriaCombina) encontrados.push(carros[i]);
  }

  quantidade.textContent = `${encontrados.length} veículos`;
  let conteudo = '';

  for (let i = 0; i < encontrados.length; i++) {
    const carro = encontrados[i];
    const indice = carros.indexOf(carro);
    const preco = carro.preco;
    const textoPreco = preco ? formatarPreco(preco) : 'Preço sob consulta';
    const botao = preco
      ? `<button class="botao adicionar" data-indice="${indice}" type="button">Adicionar ao carrinho</button>`
      : '<button class="botao botao-claro" type="button" disabled>Preço indisponível</button>';

    conteudo += `<article class="produto">
      <img src="img/${carro.imagem}" alt="${carro.nome}" loading="lazy">
      <div class="produto-texto">
        <h3>${carro.nome}</h3>
        <p class="preco-produto">${textoPreco}</p>
        ${carro.referencia ? `<p class="referencia-preco">${carro.referencia}</p>` : ''}
        <a class="botao botao-detalhes" href="${carro.pagina}">Ver detalhes</a>
        ${botao}
      </div>
    </article>`;
  }

  listaVeiculos.innerHTML = conteudo || '<p>Não encontramos esse modelo. Tente buscar por outra marc  a ou categoria.</p>';

  const botoesAdicionar = document.querySelectorAll('.adicionar');
  for (let i = 0; i < botoesAdicionar.length; i++) {
    botoesAdicionar[i].addEventListener('click', () => {
      carrinho.push(Number(botoesAdicionar[i].dataset.indice));
      salvarCarrinho();
      mostrarQuantidade();
      if (mensagemCarrinho) {
        mensagemCarrinho.innerHTML = 'Boa escolha! O veículo entrou no seu carrinho. <a class="botao botao-carrinho" href="carrinho.html">Conferir minha seleção</a>';
      }
    });
  }
}

function mostrarCarrinho() {
  const lista = document.querySelector('#itens-carrinho');
  const totalElemento = document.querySelector('#total-carrinho');
  if (!lista || !totalElemento) return;

  let total = 0;
  lista.innerHTML = '';

  for (let i = 0; i < carrinho.length; i++) {
    const indice = carrinho[i];
    const preco = carros[indice].preco;
    total += preco;
    lista.innerHTML += `<li><span>${carros[indice].nome} — ${formatarPreco(preco)}</span><button class="botao-remover" data-posicao="${i}" type="button">Remover</button></li>`;
  }

  if (carrinho.length === 0) lista.innerHTML = '<li>Sua seleção está vazia. <a href="index.html#veiculos">Explore os veículos</a></li>';
  totalElemento.textContent = formatarPreco(total);

  const botoesRemover = document.querySelectorAll('.botao-remover');
  for (let i = 0; i < botoesRemover.length; i++) {
    botoesRemover[i].addEventListener('click', () => {
      carrinho.splice(Number(botoesRemover[i].dataset.posicao), 1);
      salvarCarrinho();
      mostrarCarrinho();
      mostrarQuantidade();
    });
  }
}

carregarCarrinho();
mostrarQuantidade();
mostrarCarros();
mostrarCarrinho();

if (campoBusca) campoBusca.addEventListener('input', mostrarCarros);
if (campoCategoria) campoCategoria.addEventListener('change', mostrarCarros);

const botaoLimpar = document.querySelector('#limpar-carrinho');
if (botaoLimpar) {
  botaoLimpar.addEventListener('click', () => {
    carrinho.length = 0;
    salvarCarrinho();
    document.querySelector('#resposta-compra').textContent = '';
    mostrarCarrinho();
    mostrarQuantidade();
  });
}

const formulario = document.querySelector('#form-compra');
if (formulario) {
  formulario.addEventListener('submit', evento => {
    evento.preventDefault();
    const resposta = document.querySelector('#resposta-compra');

    if (carrinho.length === 0) {
      resposta.textContent = 'Escolha um veículo no catálogo para continuar sua simulação.';
      return;
    }

    const pagamento = document.querySelector('input[name="pagamento"]:checked').value;
    const total = document.querySelector('#total-carrinho').textContent;
    localStorage.setItem('confirmacao', `${total}|${pagamento}`);
    carrinho.length = 0;
    salvarCarrinho();
    window.location.href = 'pagamento-concluido.html';
  });
}

const resumoConfirmacao = document.querySelector('#resumo-confirmacao');
if (resumoConfirmacao) {
  const confirmacao = localStorage.getItem('confirmacao');
  if (confirmacao) {
    const dados = confirmacao.split('|');
    resumoConfirmacao.textContent = `Valor demonstrativo: ${dados[0]} · Método: ${dados[1]}. Nenhuma cobrança foi feita.`;
    localStorage.removeItem('confirmacao');
  } else {
    resumoConfirmacao.textContent = 'Não há pagamento demonstrativo recente. Nenhuma cobrança foi feita.';
  }
}

const botaoDetalhe = document.querySelector('#adicionar-detalhe');
if (botaoDetalhe) {
  botaoDetalhe.addEventListener('click', () => {
    carrinho.push(Number(botaoDetalhe.dataset.indice));
    salvarCarrinho();
    mostrarQuantidade();
    const mensagem = document.querySelector('#mensagem-detalhe');
    mensagem.innerHTML = 'Veículo adicionado. <a class="botao" href="carrinho.html">Ir para o carrinho</a>';
  });
}
