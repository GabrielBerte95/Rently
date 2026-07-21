import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Recupera o token JWT armazenado.
 * Premissa (Fase Zero): o armazenamento/gestão de sessão será implementado em
 * fase futura; por ora retorna null (ponto de extensão).
 */
function getAccessToken(): string | null {
  // TODO(fase de negócio): obter o token da camada de sessão.
  return null;
}

/**
 * Interceptor HTTP que:
 *  - anexa o token JWT (Authorization: Bearer ...) quando presente;
 *  - trata respostas 401/403 de forma centralizada.
 */
export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const token = getAccessToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        // TODO(fase de negócio): efetuar logout / redirecionar para /login.
      }
      return throwError(() => error);
    })
  );
};
