import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';

import { authenticationInterceptor } from './authentication.interceptor';
import { environment } from '../../../../environments/environment';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('authenticationInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => authenticationInterceptor(req, next));

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([interceptor])),
        provideHttpClientTesting(),
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add api key', () => {
    const testUrl = '/test';
    const mockApiKey = environment.apiKey;

    // Make a dummy HTTP request
    httpClient.get(testUrl).subscribe();

    // Expect a single request
    const req = httpTestingController.expectOne(testUrl);

    // Assert that the Authorization header is correctly set
    expect(req.request.headers.get('Authorization')).toBe(mockApiKey);

    // Respond to the request
    req.flush(null);
  });
});
