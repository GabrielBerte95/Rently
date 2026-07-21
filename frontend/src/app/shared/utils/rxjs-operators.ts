import { Observable, debounceTime, distinctUntilChanged } from 'rxjs';

/**
 * Utilitários RxJS reutilizáveis (uso pontual — sem lógica de negócio).
 * Ex.: debounce padrão para campos de busca.
 */

/** Tempo de debounce padrão (ms) para streams de busca. */
export const DEFAULT_SEARCH_DEBOUNCE_MS = 300;

/**
 * Operador de conveniência para streams de busca:
 * aplica debounce + distinctUntilChanged.
 */
export function searchDebounce<T>(
  dueTime: number = DEFAULT_SEARCH_DEBOUNCE_MS
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) =>
    source.pipe(debounceTime(dueTime), distinctUntilChanged());
}
