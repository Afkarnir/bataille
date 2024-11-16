import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    setHeaders: {
      Authorization: `${environment.apiKey}`,
    }
  })
  return next(req);
};
