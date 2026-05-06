// Monitora transações acima de R$ 1000,00
class BancoCentral {
  constructor() {
    this.transacoesMonitoradas = []; // Armazena transações suspeitas
  }

  // Registra transação se valor for maior que R$ 1000
  registrarTransacao(transacao) {
    if (transacao.valor > 1000) {
      this.transacoesMonitoradas.push(transacao);
      console.log(`[Banco Central] Transação monitorada: R$${transacao.valor} entre ${transacao.origem} e ${transacao.destino}`);
    }
  }

  // Retorna lista de transações monitoradas
  listarTransacoes() {
    return this.transacoesMonitoradas;
  }
}

// Representa uma conta bancária
class ContaBancaria {
  constructor(cliente) {
    this.cliente = cliente;  // Cliente dono da conta
    this.saldo = 0;          // Saldo inicial
    this.extrato = [];       // Histórico de transações
  }

  // Adiciona valor ao saldo
  depositar(valor) {
    this.saldo += valor;
    this.extrato.push({
      tipo: "Depósito",
      valor: valor,
      data: new Date(),
      saldoAtual: this.saldo
    });
  }

  // Remove valor do saldo (se houver saldo suficiente)
  sacar(valor) {
    if (valor > this.saldo) {
      throw new Error("Saldo insuficiente!");
    }
    this.saldo -= valor;
    this.extrato.push({
      tipo: "Saque",
      valor: valor,
      data: new Date(),
      saldoAtual: this.saldo
    });
  }

  // Transfere valor para outra conta
  transferir(valor, contaDestino, bancoCentral) {
    if (valor > this.saldo) {
      throw new Error("Saldo insuficiente para transferência!");
    }
    
    // Remove da conta origem
    this.saldo -= valor;
    this.extrato.push({
      tipo: "Transferência enviada",
      valor: valor,
      para: contaDestino.cliente.nome,
      data: new Date(),
      saldoAtual: this.saldo
    });

    // Adiciona na conta destino
    contaDestino.saldo += valor;
    contaDestino.extrato.push({
      tipo: "Transferência recebida",
      valor: valor,
      de: this.cliente.nome,
      data: new Date(),
      saldoAtual: contaDestino.saldo
    });

    // Registra no Banco Central se valor for alto
    bancoCentral.registrarTransacao({
      origem: this.cliente.nome,
      destino: contaDestino.cliente.nome,
      valor: valor,
      data: new Date()
    });
  }

  // Retorna o extrato da conta
  getExtrato() {
    return this.extrato;
  }
}

// Representa um cliente do banco
class ClienteBanco {
  constructor(nome, senha) {
    this.nome = nome;        // Nome do cliente
    this.senha = senha;      // Senha para login
    this.conta = null;       // Conta do cliente (será criada depois)
    this.logado = false;     // Status de login
  }

  // Cria uma conta para o cliente
  criarConta() {
    this.conta = new ContaBancaria(this);
  }

  // Verifica se a senha está correta
  login(senha) {
    if (this.senha === senha) {
      this.logado = true;
      return true;
    }
    return false;
  }

  // Faz logout do cliente
  logout() {
    this.logado = false;
  }
}

// Gerencia clientes e contas
class SistemaBancario {
  constructor(nome) {
    this.nome = nome;        // Nome do banco
    this.clientes = [];      // Lista de clientes
    this.bancoCentral = new BancoCentral(); // Instância do Banco Central
  }

  // Cadastra um novo cliente
  cadastrarCliente(nome, senha) {
    // Verifica se cliente já existe
    const clienteExistente = this.clientes.find(c => c.nome === nome);
    if (clienteExistente) {
      throw new Error("Cliente já cadastrado!");
    }
    
    // Cria novo cliente
    const novoCliente = new ClienteBanco(nome, senha);
    novoCliente.criarConta(); // Cria conta para o cliente
    this.clientes.push(novoCliente);
    
    return novoCliente;
  }

  // Busca cliente pelo nome
  buscarCliente(nome) {
    return this.clientes.find(c => c.nome === nome);
  }

  // Autentica cliente (login)
  autenticarCliente(nome, senha) {
    const cliente = this.buscarCliente(nome);
    if (!cliente) {
      throw new Error("Cliente não encontrado!");
    }
    
    if (cliente.login(senha)) {
      return cliente;
    } else {
      throw new Error("Senha incorreta!");
    }
  }

  // Retorna lista de clientes
  getClientes() {
    return this.clientes;
  }

  // Retorna instância do Banco Central
  getBancoCentral() {
    return this.bancoCentral;
  }
}

// INSTÂNCIA DO SISTEMA BANCÁRIO E VARIÁVEIS GLOBAIS
const sistemaBancario = new SistemaBancario("Caixa Econômica Federal");
let clienteLogado = null; // Armazena o cliente atualmente logado

// Mostra mensagem de notificação
function mostrarNotificacao(mensagem, tipo = "sucesso") {
  const container = document.getElementById("container-notificacoes");
  const notificacao = document.createElement("div");
  notificacao.className = `notificacao ${tipo}`;
  notificacao.innerHTML = mensagem;
  
  container.appendChild(notificacao);
  
  // Remove após 5 segundos
  setTimeout(() => {
    notificacao.remove();
  }, 5000);
}

// Cria uma nova conta
function criarNovaConta() {
  const nome = document.getElementById("nome-criar-conta").value.trim();
  const senha = document.getElementById("senha-criar-conta").value.trim();
  
  if (!nome || !senha) {
    mostrarNotificacao("Preencha todos os campos!", "erro");
    return;
  }
  
  try {
    sistemaBancario.cadastrarCliente(nome, senha);
    mostrarNotificacao(`Conta criada com sucesso para ${nome}!`);
    
    // Limpa campos
    document.getElementById("nome-criar-conta").value = "";
    document.getElementById("senha-criar-conta").value = "";
    
    // Atualiza lista de clientes
    atualizarListaClientes();
    
  } catch (error) {
    mostrarNotificacao(error.message, "erro");
  }
}

// Faz login
function fazerLogin() {
  const nome = document.getElementById("nome-login").value.trim();
  const senha = document.getElementById("senha-login").value.trim();
  
  if (!nome || !senha) {
    mostrarNotificacao("Preencha todos os campos!", "erro");
    return;
  }
  
  try {
    clienteLogado = sistemaBancario.autenticarCliente(nome, senha);
    mostrarNotificacao(`Bem-vindo, ${clienteLogado.nome}!`);
    
    // Limpa campos
    document.getElementById("nome-login").value = "";
    document.getElementById("senha-login").value = "";
    
    // Mostra painel da conta
    abrirPainelConta();
    
  } catch (error) {
    mostrarNotificacao(error.message, "erro");
  }
}

// Faz logout
function fazerLogout() {
  if (clienteLogado) {
    clienteLogado.logout();
    clienteLogado = null;
    mostrarNotificacao("Você saiu da conta.");
    fecharPainelConta();
  }
}

// Abre o painel da conta
function abrirPainelConta() {
  if (!clienteLogado) return;
  
  const painel = document.getElementById("painel-conta");
  painel.classList.remove("oculto");
  
  atualizarInformacoesConta();
  atualizarExtrato();
}

// Fecha o painel da conta
function fecharPainelConta() {
  const painel = document.getElementById("painel-conta");
  painel.classList.add("oculto");
}

// Atualiza informações da conta na tela
function atualizarInformacoesConta() {
  if (!clienteLogado) return;
  
  document.getElementById("info-nome-cliente").textContent = clienteLogado.nome;
  document.getElementById("info-saldo-conta").textContent = clienteLogado.conta.saldo.toFixed(2);
}

// Faz depósito
function realizarDeposito() {
  if (!clienteLogado) {
    mostrarNotificacao("Faça login primeiro!", "erro");
    return;
  }
  
  const valorInput = document.getElementById("valor-deposito");
  const valor = parseFloat(valorInput.value);
  
  if (isNaN(valor) || valor <= 0) {
    mostrarNotificacao("Digite um valor válido!", "erro");
    return;
  }
  
  try {
    clienteLogado.conta.depositar(valor);
    mostrarNotificacao(`Depósito de R$ ${valor.toFixed(2)} realizado!`);
    
    // Atualiza interface
    valorInput.value = "";
    atualizarInformacoesConta();
    atualizarExtrato();
    
  } catch (error) {
    mostrarNotificacao(error.message, "erro");
  }
}

// Faz saque
function realizarSaque() {
  if (!clienteLogado) {
    mostrarNotificacao("Faça login primeiro!", "erro");
    return;
  }
  
  const valorInput = document.getElementById("valor-saque");
  const valor = parseFloat(valorInput.value);
  
  if (isNaN(valor) || valor <= 0) {
    mostrarNotificacao("Digite um valor válido!", "erro");
    return;
  }
  
  try {
    clienteLogado.conta.sacar(valor);
    mostrarNotificacao(`Saque de R$ ${valor.toFixed(2)} realizado!`);
    
    // Atualiza interface
    valorInput.value = "";
    atualizarInformacoesConta();
    atualizarExtrato();
    
  } catch (error) {
    mostrarNotificacao(error.message, "erro");
  }
}

// Faz transferência
function realizarTransferencia() {
  if (!clienteLogado) {
    mostrarNotificacao("Faça login primeiro!", "erro");
    return;
  }
  
  const valorInput = document.getElementById("valor-transferencia");
  const destinatarioInput = document.getElementById("nome-destinatario");
  
  const valor = parseFloat(valorInput.value);
  const nomeDestinatario = destinatarioInput.value.trim();
  
  if (isNaN(valor) || valor <= 0) {
    mostrarNotificacao("Digite um valor válido!", "erro");
    return;
  }
  
  if (!nomeDestinatario) {
    mostrarNotificacao("Digite o nome do destinatário!", "erro");
    return;
  }
  
  try {
    // Busca conta do destinatário
    const destinatario = sistemaBancario.buscarCliente(nomeDestinatario);
    if (!destinatario) {
      throw new Error("Destinatário não encontrado!");
    }
    
    if (destinatario.nome === clienteLogado.nome) {
      throw new Error("Não pode transferir para si mesmo!");
    }
    
    // Faz transferência
    const bancoCentral = sistemaBancario.getBancoCentral();
    clienteLogado.conta.transferir(valor, destinatario.conta, bancoCentral);
    
    mostrarNotificacao(`Transferência de R$ ${valor.toFixed(2)} para ${nomeDestinatario} realizada!`);
    
    // Atualiza interface
    valorInput.value = "";
    destinatarioInput.value = "";
    atualizarInformacoesConta();
    atualizarExtrato();
    
  } catch (error) {
    mostrarNotificacao(error.message, "erro");
  }
}

// Atualiza extrato na tela
function atualizarExtrato() {
  if (!clienteLogado) return;
  
  const container = document.getElementById("lista-extrato");
  const extrato = clienteLogado.conta.getExtrato();
  
  if (extrato.length === 0) {
    container.innerHTML = '<p class="texto-centro texto-secundario">Nenhuma transação realizada</p>';
    return;
  }
  
  let html = "";
  extrato.forEach(transacao => {
    const data = transacao.data.toLocaleString();
    let classe = "item-extrato ";
    
    if (transacao.tipo.includes("Depósito")) {
      classe += "deposito";
    } else if (transacao.tipo.includes("Saque")) {
      classe += "saque";
    } else if (transacao.tipo.includes("Transferência")) {
      classe += "transferencia";
    }
    
    html += `
      <div class="${classe}">
        <div class="info-transacao">
          <div class="tipo-transacao">${transacao.tipo}</div>
          <div class="data-transacao">${data}</div>
          ${transacao.de ? `<small>De: ${transacao.de}</small>` : ""}
          ${transacao.para ? `<small>Para: ${transacao.para}</small>` : ""}
        </div>
        <div class="valor-transacao">
          ${transacao.tipo.includes("Saque") || transacao.tipo.includes("enviada") ? "-" : "+"} R$ ${transacao.valor.toFixed(2)}
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html; 
}

// Lista clientes cadastrados
function atualizarListaClientes() {
  const container = document.getElementById("lista-clientes");
  const clientes = sistemaBancario.getClientes();
  
  if (clientes.length === 0) {
    container.innerHTML = '<p class="texto-centro texto-secundario">Nenhum cliente cadastrado</p>';
    return;
  }
  
  let html = '<div class="lista-clientes">';
  clientes.forEach(cliente => {
    html += `
      <div class="item-cliente">
        <strong>${cliente.nome}</strong><br>
        Saldo: R$ ${cliente.conta.saldo.toFixed(2)}<br>
        Transações: ${cliente.conta.extrato.length}
      </div>
    `;
  });
  html += '</div>';
  
  container.innerHTML = html;
}

// Cria alguns clientes de exemplo
function criarClientesExemplo() {
  try {
    sistemaBancario.cadastrarCliente("Raiany Mendes", "123");
    sistemaBancario.cadastrarCliente("Sara Mendes", "123");
    
    // Faz depósito inicial
    const raiany = sistemaBancario.buscarCliente("Raiany Mendes")
    raiany.conta.depositar(1000);

    const sara = sistemaBancario.buscarCliente("Sara Mendes");
    sara.conta.depositar(1000);
    
    console.log("Exemplos criados com sucesso!");
    atualizarListaClientes();
    
  } catch (error) {
    console.log("Erro ao criar exemplos:", error.message);
  }
}

// Inicializa o sistema quando a página carrega
window.onload = function() {
  criarClientesExemplo();
};