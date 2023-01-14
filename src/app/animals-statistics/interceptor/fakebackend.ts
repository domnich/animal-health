import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {
  delay,
  Observable,
  of,
  tap
} from 'rxjs';
import { AnimalHelperService } from '../services/animal-helper.service';

const ANIMALS_DB_URL: string = 'assets/animals.json';

@Injectable()
export class FakeBackendHttpInterceptor implements HttpInterceptor {
  constructor(private animalHelperService: AnimalHelperService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.handleRequests(req, next);
  }

  private handleRequests(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method }: { url: string, method: string } = req;

    this.animalHelperService.requestLoaded(false);

    if (url.endsWith('/animals') && method === 'GET') {
      req = req.clone({
        url: ANIMALS_DB_URL,
      });

      return next.handle(req).pipe(
        delay(100)
      );
    }

    if (url.endsWith('/animals') && method === "POST") {
      const { body } = req.clone();

      return of(new HttpResponse({ status: 200, body })).pipe(
        delay(500),
        tap(() => this.animalHelperService.requestLoaded(true))
      );
    }

    if (url.endsWith('/animals') && method === "PUT") {
      const { body } = req.clone();
      return of(new HttpResponse({ status: 200, body })).pipe(
        delay(500),
        tap(() => this.animalHelperService.requestLoaded(true))
      );
    }

    if (url.match(/\/animals\/.*/) && method === "DELETE") {
      const id: string = this.getAnimalId(url);
      return of(new HttpResponse({ status: 200, body: id })).pipe(
        delay(500),
        tap(() => this.animalHelperService.requestLoaded(true))
      );
    }

    return next.handle(req);
  }

  private getAnimalId(url: string): string {
    const urlValues = url.split("/");
    return urlValues[urlValues.length - 1];
  }
}