import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';

import { errorInterceptor } from './error.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideStore, Store } from '@ngxs/store';
import { SetError } from '../../states/error/error.actions';

describe('errorInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => errorInterceptor(req, next));

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let store: Store;

  const testUrl = '/test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([interceptor])),
        provideHttpClientTesting(),
        provideStore([]),
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch'); // Espionne la méthode dispatch du store

    httpClient.get(testUrl).subscribe({
      error: () => {},
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should dispatch Network error for status 0', () => {
    const req = httpTestingController.expectOne(testUrl);
    req.flush(null, { status: 0, statusText: 'Unknown Error' });

    expect(store.dispatch).toHaveBeenCalledWith(
      new SetError({ message: 'Network error' })
    );
  });

  it('should dispatch the error message for status 401', () => {
    const mockError = { message: 'Unauthorized access' };

    const req = httpTestingController.expectOne(testUrl);
    req.flush(mockError, { status: 401, statusText: 'Unauthorized' });

    expect(store.dispatch).toHaveBeenCalledWith(new SetError(mockError));
  });

  it('should dispatch Server error for status 500 without message', () => {
    const req = httpTestingController.expectOne(testUrl);
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });

    expect(store.dispatch).toHaveBeenCalledWith(
      new SetError({ message: 'Server error' })
    );
  });

  it('should dispatch the error message for status 500 with a message', () => {
    const mockError = { message: 'Database connection failed' };

    const req = httpTestingController.expectOne(testUrl);
    req.flush(mockError, { status: 500, statusText: 'Internal Server Error' });

    expect(store.dispatch).toHaveBeenCalledWith(new SetError(mockError));
  });
});
