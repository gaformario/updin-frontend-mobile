# Updin Mobile

Frontend mobile do Updin, uma aplicação de educação financeira gamificada para responsáveis e adolescentes. O projeto foi construído com Expo + React Native e usa `expo-router` para organizar a navegação por rotas.

## Objetivo do app

O aplicativo conecta dois perfis:

- `Responsável`: acompanha saldo, configura mesada, cria missões e valida entregas do adolescente.
- `Adolescente`: acompanha saldo, conclui missões, responde quizzes, consulta ranking e evolui no perfil com XP e conquistas.

## Como o frontend funciona

### Fluxo público

- A tela inicial (`/home`) apresenta a entrada para os dois perfis.
- O login do responsável fica em `/login-responsavel`.
- O login do adolescente fica em `/login-adolescente`.
- A sessão fica salva em `AsyncStorage`, permitindo restaurar o acesso ao reabrir o app.

### Fluxo autenticado

- As rotas protegidas ficam dentro de `app/(protected)`.
- O `ProtectedLayout` valida se existe sessão e redireciona o usuário para a área correta conforme o tipo de perfil.
- Quando a API responde `401`, o token e a sessão são limpos automaticamente.

### Área do responsável

- Seleciona qual adolescente deseja gerenciar.
- Visualiza painel financeiro com saldo total, divisão entre mesada fixa e parte variável, extrato recente e missões.
- Configura mesada com periodicidade `Semanal`, `Quinzenal` ou `Mensal`.
- O valor da mesada é apresentado com divisão automática de `80%` para parte fixa e `20%` para parte variável.
- Cria novas missões com título, descrição, recompensa, prazo e observações.
- Valida missões concluídas pelo adolescente e pode registrar feedback na aprovação.

### Área do adolescente

- Acessa uma home com saldo disponível, missões pendentes, notificações e atalhos rápidos.
- Consulta o extrato com filtros por tipo de movimentação.
- Navega por um catálogo de quizzes públicos.
- Responde quizzes, salva progresso local automaticamente e visualiza o resultado final com pontuação e percentual de acertos.
- Consulta ranking global por período (`geral`, `semanal` e `mensal`).
- Acessa o perfil com estatísticas, conquistas, evolução semanal de XP e logout.
- Abre detalhes de missão, envia conclusão para validação e consulta notificações de missão aprovada.

## Estrutura principal

| Caminho                        | Responsabilidade                                        |
| ------------------------------ | ------------------------------------------------------- |
| `app/`                         | Rotas do app com `expo-router`                          |
| `app/(auth)/`                  | Telas públicas de entrada e login                       |
| `app/(protected)/responsavel/` | Fluxo do responsável                                    |
| `app/(protected)/adolescente/` | Fluxo do adolescente, incluindo tabs                    |
| `features/auth/`               | Contexto de autenticação e restauração de sessão        |
| `services/`                    | Cliente HTTP, integração com API e adaptadores de dados |
| `types/`                       | Tipagens de entidades, respostas da API e view models   |
| `components/`                  | Componentes reutilizáveis de UI e modais                |
| `styles/`                      | Estilos separados por tela                              |

## Integração com a API

O app depende da API do Updin e usa a variável abaixo para montar a base das requisições:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

O cliente HTTP:

- adiciona o token Bearer nas requisições autenticadas;
- trata erros de conectividade;
- normaliza mensagens vindas da API;
- encerra a sessão quando encontra resposta `401`.

Principais grupos de consumo:

- `auth`: login e recuperação do usuário autenticado.
- `responsaveis`: dados do responsável e adolescentes vinculados.
- `adolescentes`: conta, mesadas, missões, estatísticas, conquistas, notificações e XP semanal.
- `missoes`: atribuição, conclusão e validação.
- `quizzes`: catálogo público, envio de tentativa e consulta de resultado.
- `ranking`: ranking global e por período.

## Como executar o projeto

1. Instale as dependências:

```bash
npm install
```

2. Configure o arquivo `.env` com a URL da API:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

3. Inicie o projeto Expo:

```bash
npm expo start
```

4. Abra no ambiente desejado:

- `a` para Android no terminal do Expo
- `w` para Web
- escaneie o QR Code no terminal e abra o app Expo Go pelo celular
