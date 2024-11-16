import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetError } from '../../states/error/error.actions';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 0:
          store.dispatch(new SetError({message: 'Network error'}));
          break;
        case 401:
          store.dispatch(new SetError(error.error));
          break;
        case 500:
          if (error.error?.message) {
            store.dispatch(new SetError(error.error));
            break;
          }
          store.dispatch(new SetError({message: 'Server error'}));
          break;
      }
      
      return throwError(() => error);
    })
  );
};
