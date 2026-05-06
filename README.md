🏦 Sistema Bancário - Caixa Econômica Federal
Sistema bancário simples desenvolvido em JavaScript puro (HTML, CSS, JS) para simular operações bancárias como criação de contas, login, depósitos, saques, transferências e consulta de extrato, com monitoramento de transações suspeitas pelo Banco Central.

📋 Funcionalidades
Para o Cliente
✅ Criar nova conta (nome + senha)

✅ Fazer login na conta

✅ Consultar saldo disponível

✅ Realizar depósitos

✅ Realizar saques (com verificação de saldo)

✅ Realizar transferências entre contas

✅ Visualizar extrato completo

✅ Logout da conta


🛠️ Tecnologias Utilizadas
Tecnologia	Descrição
HTML5	Estrutura da página
CSS3	Estilização, grid layout e animações
JavaScript (ES6)	Classes, manipulação do DOM e lógica do sistema


📊 Monitoramento do Banco Central
Transações acima de R$ 1.000,00 são automaticamente registradas


🎨 Interface
Design responsivo (funciona em desktop e mobile)

Animações suaves em cards e notificações

Cores institucionais (azul e amarelo)

Notificações toast para feedback de ações

Cards de operações com cores distintas:

🟢 Depósito (verde)

🔴 Saque (vermelho)

🟡 Transferência (amarelo)

⚙️ Funcionalidades Técnicas
Funcionalidade	Implementação
Controle de sessão	clienteLogado global
Validação de saldo	Antes de saque/transferência
Evitar auto-transferência	Verificação nome ≠ destinatário
Extrato detalhado	Data, tipo, valor, saldo atual
Notificações	5 segundos visíveis
Lista de clientes	Atualizável em tempo real

🐛 Possíveis Melhorias Futuras
Persistência de dados (LocalStorage / IndexedDB)

Dashboard de transações suspeitas (interface do Banco Central)

Edição de perfil do cliente

Agendamento de transferências

Recuperação de senha

API para integração com backend real

Relatórios financeiros

📄 Licença
Este projeto é livre para uso educacional e pessoal.

👩‍💻 Autor: YASMIN
Desenvolvido como sistema de aprendizado e demonstração de conceitos de POO em JavaScript.

Versão: 1.0.0
Última atualização: 2026
