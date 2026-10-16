# FinanCerto Backend 🚀

Este é o repositório do backend do **FinanCerto**, um aplicativo de gestão de gastos pessoais focado em ajudar os usuários a controlarem suas finanças de forma simples e eficiente.

O projeto foi construído seguindo princípios de **Clean Architecture flexibilizada**, garantindo modularidade, manutenibilidade e separação clara de responsabilidades.

---

## 🛠 Tecnologias Utilizadas

- **Node.js com TypeScript** (ES Modules)
- **Express.js** (Roteamento e Servidor HTTP)
- **Prisma ORM** (Modelagem e manipulação do banco de dados)
- **SQLite** (Banco de dados relacional leve para desenvolvimento)
- **Swagger** (`swagger-jsdoc` e `swagger-ui-express` para documentação interativa)
- **Bcrypt** (Criptografia de senhas)
- **JWT** (JSON Web Tokens para autenticação)
- **TSX** (Execução rápida de TypeScript no ambiente de desenvolvimento)

---

## 📁 Arquitetura do Projeto

A arquitetura foi desenhada para separar as regras de negócio das ferramentas de infraestrutura (como Express e Prisma):

- 📂 **`domain/`**: Entidades e abstrações.
- 📂 **`application/`**: Casos de uso (Use Cases) e regras de negócio puras.
- 📂 **`presentation/`**: Controladores que recebem as requisições HTTP e devolvem as respostas.
- 📂 **`infra/`**: Implementações técnicas (Express, rotas, Prisma, serviços de criptografia e token).

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
Certifique-se de ter o **Node.js** (versão 18+ recomendada) e o **Git** instalados na sua máquina.

### 2. Clonando e Instalando

```bash
# Clone o repositório
git clone [https://github.com/GuilhermeAMendes/FinanCerto-backend.git](https://github.com/GuilhermeAMendes/FinanCerto-backend.git)

# Acesse a pasta do projeto
cd FinanCerto-backend

# Instale as dependências
npm install
```

### 3. Configurando as Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto baseado no .env.example (ou adicione as seguintes variáveis):

```bash
PORT="3000"
DATABASE_URL="file:./dev.db"
SECRET="sua_chave_jwt_secreta_aqui"
```

### 4. Configurando o Banco de Dados
Execute os comandos do Prisma para gerar o cliente e criar as tabelas no SQLite:

```bash
# Gera o Prisma Client
npx prisma generate

# Roda as migrações para criar o banco de dados
npx prisma migrate dev --name init
```

### 5. Rodando a Aplicação
Para iniciar o servidor em modo de desenvolvimento (com hot-reload):

```bash
npm run dev
Nota: O servidor estará rodando em http://localhost:3000.
```

📚 Documentação da API (Swagger)
Com o servidor rodando, acesse a documentação interativa das rotas através do link:

👉 Acessar Documentação Swagger http://localhost:3000/docs
