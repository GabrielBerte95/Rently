# Rently

Plataforma de gestão de locação de imóveis. Monorepo contendo o backend (API .NET) e o frontend (SPA Angular), orquestrados localmente via Docker Compose com banco de dados SQL Server.

## Stack

| Camada        | Tecnologia                                   |
| ------------- | -------------------------------------------- |
| Backend       | .NET 10 (C#), ASP.NET Core Web API           |
| Arquitetura   | Monolito modular (DDD + CQRS)                |
| Persistência  | Entity Framework Core (code-first) + SQL Server |
| Autenticação  | JWT Bearer                                    |
| Frontend      | Angular 22 (standalone components, SCSS)     |
| Containers    | Docker / Docker Compose                       |

## Estrutura do repositório

```
Rently/
├── Rently.slnx  # Solution única (na raiz) com os 5 projetos .NET
├── Directory.Build.props  # convenções de compilação compartilhadas
├── src/         # Projetos .NET (Api, Application, Domain, Infrastructure, CrossCutting)
├── tests/       # Reservado para projetos de teste futuros
├── frontend/    # Workspace Angular 22 (projeto "rently")
├── docker/      # docker-compose e artefatos de orquestração local
└── docs/        # Documentação e especificações
```

## Pré-requisitos

- [.NET SDK 10](https://dotnet.microsoft.com/) (`dotnet --version`)
- [Node.js 22+](https://nodejs.org/) e npm (`node --version`)
- [Angular CLI 22](https://angular.dev/) (`npm install -g @angular/cli@22`)
- [Docker Desktop](https://www.docker.com/) (para o ambiente local completo)
- SQL Server (fornecido via container no Docker Compose)

## Setup local

### Backend

A solution única fica na raiz (`Rently.slnx`) e agrega todos os projetos .NET (em `src/`).

```bash
dotnet restore Rently.slnx
dotnet build Rently.slnx
dotnet run --project src/Rently.Api
```

A configuração da connection string e da chave JWT é feita por variáveis de ambiente / user-secrets (ver `appsettings.json`). Nenhum segredo real é versionado.

### Frontend

```bash
cd frontend
npm install
npm start          # ng serve — http://localhost:4200
```

A URL base da API é parametrizada em `src/environments/environment.ts`.

### Ambiente completo (Docker Compose)

```bash
cd docker
cp .env.example .env      # ajuste os placeholders antes de subir
docker compose up --build
```

Sobe três serviços: `rently-api` (backend), `rently-web` (frontend/Nginx) e `sqlserver` (banco), em uma rede compartilhada.

## Documentação

Consulte a pasta [`docs/`](./docs) para as especificações da Fase Zero e a visão de implantação em Kubernetes.
