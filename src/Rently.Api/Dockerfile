# syntax=docker/dockerfile:1
# Contexto de build esperado: raiz do repositório (onde ficam Directory.Build.props e src/).

# ---------- Build stage ----------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /source

# Restaura dependências (camada cacheável) copiando apenas os manifests primeiro.
COPY Directory.Build.props ./
COPY src/Rently.CrossCutting/Rently.CrossCutting.csproj      src/Rently.CrossCutting/
COPY src/Rently.Domain/Rently.Domain.csproj                  src/Rently.Domain/
COPY src/Rently.Application/Rently.Application.csproj         src/Rently.Application/
COPY src/Rently.Infrastructure/Rently.Infrastructure.csproj  src/Rently.Infrastructure/
COPY src/Rently.Api/Rently.Api.csproj                        src/Rently.Api/
RUN dotnet restore src/Rently.Api/Rently.Api.csproj

# Copia o restante do código e publica.
COPY . .
RUN dotnet publish src/Rently.Api/Rently.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# ---------- Runtime stage ----------
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Rently.Api.dll"]
