import { Injectable } from "@angular/core";
import { 
  HttpClient, 
  HttpErrorResponse, 
  HttpResponse 
} from "@angular/common/http";
import { 
  catchError,
  map, 
  Observable, 
  of, 
  shareReplay, 
  Subject 
} from "rxjs";
import { environment } from "src/environments/environment";
import { Animal } from "../shared/animal";
import { AnimalsResponse } from "../shared/animals-response.type";

/**
 * It's also possible to inject service directly in this file via providedIn: 'root'.
 * And it wouldn't make any difference if this service will be injected into:
 * providedIn: 'root' OR in AnimalsStatisticsModule OR in AppModule, because
 * AnimalsStatisticsModule and  AppModule are not lazy loaded so they will have one array of providers...
 * Decided to put this service into AnimalsStatisticsModule, for just additional insurance if this module
 * will be used as lazy loaded and in this case only AnimalsStatisticsModule will have instance of this service
 * 
 */
@Injectable()
export class AnimalsService {
  private animalUpdatedSource: Subject<Animal> = new Subject<Animal>();
  private dataReadySource: Subject<boolean> = new Subject<boolean>();
  public animalUpdated$: Observable<Animal> = this.animalUpdatedSource.asObservable();
  public dataReady$: Observable<boolean> = this.dataReadySource.asObservable();

  constructor(private http: HttpClient) { }

  public getAnimals(): Observable<AnimalsResponse> {
    return this.http
      .get<AnimalsResponse>(this.getUrl(), {
        observe: 'response'
      })
      .pipe(
        map((response: HttpResponse<any>) => response.body),
        catchError(this.handleError),
        shareReplay(1)
      );
  }

  public createAnimal(animal: Animal) {
    return this.http
      .post<Animal>(this.getUrl(), animal, {
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }

  public deleteAnimal(id: string): Observable<string> {
    return this.http
      .delete<string>(`${this.getUrl()}/` + id, {
        observe: 'response',
      })
      .pipe(
        map(() => id),
        catchError(this.handleError)
      );
  }

  public updateAnimal(animal: Animal): Observable<Animal> {
    return this.http
      .put<Animal>(this.getUrl(), animal, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<any>) => {
          this.animalUpdatedSource.next(response.body);
          return response.body;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return of({}) as Observable<never>;
  }

  private getUrl(): string {
    return `${environment.API_URL}/animals`;
  }
}