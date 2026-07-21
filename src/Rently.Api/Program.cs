using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Rently.Infrastructure.Persistence;
using Rently.Infrastructure.Security;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------------
// Persistência (EF Core / SQL Server)
// ---------------------------------------------------------------------------
builder.Services.AddDbContext<RentlyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ---------------------------------------------------------------------------
// Autenticação JWT (esqueleto) — exige token válido por padrão em todos os endpoints
// ---------------------------------------------------------------------------
var jwtOptions = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>() ?? new JwtOptions();
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtOptions.SigningKey.Length > 0
                    ? jwtOptions.SigningKey
                    : new string('0', 32)))
        };
    });

// Política de fallback: qualquer endpoint sem [AllowAnonymous] exige usuário autenticado.
builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});

var app = builder.Build();

// ---------------------------------------------------------------------------
// Pipeline HTTP
// ---------------------------------------------------------------------------
app.UseAuthentication();
app.UseAuthorization();

// Endpoint de liveness público (não exige token) — usado por health checks/compose.
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }))
   .AllowAnonymous();

// Endpoint protegido de smoke test: sem token válido retorna 401.
app.MapGet("/", () => Results.Ok(new { service = "Rently.Api", authenticated = true }));

app.Run();
