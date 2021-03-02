import { Injectable } from '@angular/core';
import { HEROES } from '../assets/mocks/mock-heroes';
import { Hero } from '../interfaces/Hero';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = 'api/heroes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getHeroes(): Observable<Hero[]> {
    this.log('Fetched heroes');
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_) => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero | undefined> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http
      .get<Hero>(url)
      .pipe(
        tap(
          (_) => this.log(`fetched hero with id: ${id}`),
          catchError(this.handleError<Hero>('getHero'))
        )
      );
  }

  putHero(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`Updated hero with id : ${hero.id}`)),
      catchError(this.handleError('updateHero'))
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(
    operation = 'operation',
    result?: T
  ): Observable<T> | any {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero with id : ${newHero.id}`)),
      catchError(this.handleError('addHero'))
    );
  }

  deleteHero(hero: Hero): Observable<Hero> {
    return this.http
      .delete<Hero>(`${this.heroesUrl}/${hero.id}`, this.httpOptions)
      .pipe(
        tap((_) => this.log(`deleted hero with id : ${hero.id}`)),
        catchError(this.handleError('deleteHero'))
      );
  }

  searchHero(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`found heroes matching ${term}`)
          : this.log(`found no heroes matching ${term}`)
      ),
      catchError(this.handleError<Hero[]>('searchHero'))
    );
  }
}
