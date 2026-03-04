# Inmeta Docs API

Uma API de Gestão de Documentos robusta e escalável, desenvolvida com **NestJS**, **Prisma** e **SQLite**. Este projeto oferece uma solução completa para gerenciar colaboradores, tipos de documentos e versionamento de arquivos com estatísticas automatizadas.

## 🚀 Funcionalidades

### 👥 Gestão de Colaboradores

Operações completas de CRUD com suporte a **Soft Delete**, permitindo desativar registros sem excluí-los permanentemente.

### 🏷️ Categorização de Documentos

Sistema flexível para gerenciar diferentes tipos de documentos (como RG, CPF, CNH), essencial para a organização do arquivo.

### 📄 Fluxo Avançado de Documentos

- Gerenciamento de pendências por colaborador.
- Upload de arquivos (PDF e Imagens) com versionamento automático.
- Visualização e download via link de arquivos.

### 📊 Dashboard e Estatísticas

Estatísticas em tempo real sobre a taxa de conclusão, tipos de documentos mais pendentes e histórico de envios recentes.

### 🛠️ Segurança e Qualidade

- Validação de dados (DTOs) e tipos de arquivos.
- Documentação interativa via **Swagger**.
- Cobertura de testes automatizados para garantir a estabilidade.

## 🛠️ Tecnologias

- **Framework**: [NestJS](https://nestjs.com/) (v11)
- **Banco de Dados**: [SQLite](https://sqlite.org/) + [Prisma ORM](https://www.prisma.io/)
- **Documentação**: [Swagger / OpenAPI](https://swagger.io/)
- **Testes**: [Jest](https://jestjs.io/)
- **Uploads**: [Multer](https://github.com/expressjs/multer)

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [npm](https://www.npmjs.com/)

## ⚙️ Configuração e Instalação

1. **Clonar o repositório**:

   ```bash
   git clone https://github.com/suellykarine/inmeta-docs-api
   cd inmeta-docs-api
   ```

2. **Instalar dependências**:

   ```bash
   npm install
   ```

3. **Configurar Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz do projeto:

   ```env
   DATABASE_URL="file:./dev.db"
   PORT=3000
   ```

4. **Executar Migrações do Banco de Dados**:
   ```bash
   npx prisma migrate dev --name init
   ```

## 🛠️ Como Executar

|                         |                      |
| :---------------------- | :------------------- |
| 🛠️ **Desenvolvimento**  | `npm run start:dev`  |
| 🏗️ **Produção (Build)** | `npm run build`      |
| 🚀 **Produção (Start)** | `npm run start:prod` |

> 💡 Após iniciar a aplicação, você pode testar todos os endpoints através da **Documentação Swagger** em: [http://localhost:3000/api](http://localhost:3000/api)

## 📑 Documentação da API

A API está organizada em três módulos principais. Abaixo estão os endpoints disponíveis:

### 👥 Colaboradores (`/collaborators`)

| Método     | Endpoint | Descrição                                          |
| :--------- | :------- | :------------------------------------------------- |
| **POST**   | `/`      | Cria um novo colaborador                           |
| **GET**    | `/`      | Lista todos os colaboradores ativos                |
| **GET**    | `/:id`   | Busca detalhes de um colaborador específico por ID |
| **PATCH**  | `/:id`   | Atualiza as informações de um colaborador          |
| **DELETE** | `/:id`   | Realiza a desativação lógica (Soft Delete)         |

### 🏷️ Tipos de Documentos (`/document-types`)

| Método     | Endpoint | Descrição                                            |
| :--------- | :------- | :--------------------------------------------------- |
| **POST**   | `/`      | Cadastra um novo tipo de documento                   |
| **GET**    | `/`      | Lista todos os tipos de documentos disponíveis       |
| **DELETE** | `/:id`   | Remove um tipo de documento (apenas se sem vínculos) |

### 📄 Documentos (`/documents`)

| Método    | Endpoint               | Descrição                                          |
| :-------- | :--------------------- | :------------------------------------------------- |
| **POST**  | `/requirement`         | Cria uma nova pendência de documento               |
| **GET**   | `/pending`             | Lista requisitos pendentes (com busca e paginação) |
| **GET**   | `/dashboard`           | Retorna estatísticas de conclusão e tendências     |
| **POST**  | `/upload`              | Realiza o envio de arquivo e cria nova versão      |
| **GET**   | `/collaborator/:id`    | Histórico de documentos e versões do colaborador   |
| **GET**   | `/download/:versionId` | Download ou visualização direta do arquivo         |
| **PATCH** | `/:id/deactivate`      | Inativa todas as versões de um documento           |

## 🧪 Testes

O projeto mantém padrões de qualidade com cobertura de testes extensiva em todos os módulos.

|                               |                      |
| :---------------------------- | :------------------- |
| ✅ **Rodar todos os testes**  | `npm run test`       |
| 🔄 **Modo Watch**             | `npm run test:watch` |
| 📊 **Relatório de Cobertura** | `npm run test:cov`   |

## 📂 Estrutura do Projeto

```text
src/
├── modules/
│   ├── collaborators/
│   ├── document-types/
│   └── documents/
├── prisma/
├── main.ts
└── app.module.ts
```

---

### 👤 Autora

**Suélly Araujo** - *Desenvolvedora Full-Stack*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/suellyaraujo/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/suellykarine)
[![Portfolio](https://img.shields.io/badge/Portfolio-2563EB?style=for-the-badge&logo=vercel&logoColor=white)](https://portifolio-su.vercel.app/)

## 📄 Licença

Este projeto está sob a licença de [Suélly Araujo](LICENSE).
