import { CanActivateFn } from '@angular/router';

/**
 * Guard de autenticação (ponto de extensão).
 *
 * Premissa (Fase Zero): a verificação real de sessão/token será implementada
 * em fase de negócio futura. Aqui apenas estabelecemos o ponto de extensão
 * aplicado às rotas privadas — por ora libera a navegação.
 */
export const authGuard: CanActivateFn = (_route, _state) => {
  // TODO(fase de negócio): validar sessão/token e redirecionar para /login se ausente.
  return true;
};
