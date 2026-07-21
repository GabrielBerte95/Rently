# Visão de Implantação em Kubernetes — Rently

> **Escopo (Fase Zero):** este documento registra apenas **premissas** para orientar
> decisões futuras de orquestração em nuvem. Nenhum manifesto Kubernetes
> (Deployment, Service, Ingress, ConfigMap, Secret), Helm chart ou Kustomize é
> criado nesta fase.

## Premissas de implantação futura

### 1. Escalabilidade horizontal do backend

O backend (`Rently.Api`) deve ser projetado para escalar horizontalmente — múltiplas
réplicas atrás de um balanceador de carga. Isso exige que a API permaneça
**stateless**: nenhuma sessão em memória local, estado compartilhado delegado ao
banco de dados (SQL Server) e, quando necessário, a um cache distribuído. O JWT
(autocontido) já favorece esse modelo, pois a validação do token não depende de
estado de servidor. Em Kubernetes, isso se traduz em um `Deployment` com `replicas > 1`
e, futuramente, `HorizontalPodAutoscaler`.

### 2. Separação de imagens Docker por serviço

Cada serviço mantém sua própria imagem e ciclo de build/versionamento independente:

- `rently-api` — imagem .NET (build multi-stage já definido em `src/Rently.Api/Dockerfile`).
- `rently-web` — imagem Angular/Nginx (build multi-stage em `frontend/Dockerfile`).
- Banco de dados — imagem oficial do SQL Server (ou serviço gerenciado em nuvem).

Essa separação permite escalar, atualizar e reverter cada componente isoladamente,
mapeando cada imagem para um `Deployment`/`Service` próprio no cluster.

### 3. Secrets e ConfigMaps para configuração sensível

As configurações sensíveis — **connection strings** e **chaves JWT** — não devem
ser versionadas nem embutidas nas imagens. Em Kubernetes serão fornecidas via:

- **Secrets**: `ConnectionStrings__DefaultConnection`, `Jwt__SigningKey`.
- **ConfigMaps**: parâmetros não sensíveis por ambiente (issuer/audience do JWT,
  URLs base, níveis de log).

Isso dá continuidade ao padrão já adotado na Fase Zero (valores injetados por
variáveis de ambiente, `appsettings` sem segredos reais e `.env.example` com
placeholders).

## Fora de escopo (fases futuras)

- Manifests Kubernetes (Deployment, Service, Ingress, ConfigMap, Secret).
- Empacotamento com Helm charts ou Kustomize.
- Estratégias de rollout, probes (readiness/liveness), autoscaling e políticas de rede.
