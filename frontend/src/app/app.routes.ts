import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

/**
 * Roteamento base da aplicação.
 *
 * - Rotas PÚBLICAS: acessíveis sem autenticação (ex.: autenticação/login).
 * - Rotas PRIVADAS: protegidas pelo authGuard.
 *
 * Os componentes de cada módulo de /features serão adicionados em fases futuras
 * (placeholders comentados abaixo).
 */
export const routes: Routes = [
  // ---------- Rotas públicas ----------
  {
    path: 'auth',
    data: { public: true },
    children: [
      // { path: 'login', loadComponent: () => import('./features/autenticacao/...') },
    ]
  },

  // ---------- Rotas privadas (protegidas) ----------
  {
    path: '',
    canActivate: [authGuard],
    children: [
      // { path: 'imoveis', loadComponent: () => import('./features/imoveis/...') },
      // { path: 'contratos', loadComponent: () => import('./features/contratos/...') },
      // { path: 'locatarios', loadComponent: () => import('./features/locatarios/...') },
    ]
  },

  // ---------- Fallback ----------
  { path: '**', redirectTo: '' }
];
