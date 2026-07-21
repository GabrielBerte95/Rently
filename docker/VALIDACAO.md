# Validação do ambiente local (P05.03)

## Validações estáticas já executadas

- `docker-compose.yml` é YAML válido e define os três serviços: `sqlserver`, `rently-api`, `rently-web`.
- Todos os serviços compartilham a rede `rently-net` (bridge).
- Volume `mssql-data` configurado para persistência do SQL Server.
- Rede/host coerentes:
  - `rently-api` conecta ao banco pelo host `sqlserver` (nome do serviço na rede do compose).
  - `rently-web` (Nginx) faz proxy de `/api/` para `http://rently-api:8080`.
  - `rently-api` escuta em `http://+:8080`.
- `depends_on` com `condition: service_healthy` garante que a API só suba após o healthcheck do SQL Server.

## Validação em runtime (executar na máquina com Docker)

> O ambiente do assistente não possui Docker; os passos abaixo devem ser executados
> localmente para produzir a evidência de subida completa exigida pela SPEC P05.03.

```bash
cd docker
cp .env.example .env          # ajuste SA_PASSWORD e JWT_SIGNING_KEY
docker compose up --build
```

Checklist de aceite:

- [ ] `docker compose up` sobe os três serviços sem erros.
- [ ] Backend conecta ao SQL Server (aplicar migração: `dotnet ef database update --project src/Rently.Infrastructure --startup-project src/Rently.Api`, ou verificar logs de conexão da API).
- [ ] `GET http://localhost:8080/health` responde `200` (liveness público).
- [ ] `GET http://localhost:8080/` sem token responde `401` (autorização por padrão ativa).
- [ ] Frontend acessível em `http://localhost:4200` e `http://localhost:4200/api/health` alcança o backend pela rede do compose.
