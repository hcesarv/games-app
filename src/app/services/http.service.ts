import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { APIResponse, Game } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getGamesList(ordering: string, search?: string): Observable<APIResponse<Game>> {
    let params = new HttpParams().set('ordering', ordering);
    if (search) params = new HttpParams().set('ordering', ordering).set('search', search);
    return this.http.get<APIResponse<Game>>(`${environment.url}/games`, {
      params: params
    });
  }

  getGamesDetails(id: string): Observable<Game> {
    const gameInfoRequest = this.http.get(`${environment.url}/games/${id}`);
    const gameTrailerRequest = this.http.get(`${environment.url}/games/${id}/movies`);
    const gameScreenshotsRequest = this.http.get(`${environment.url}/games/${id}/screenshots`);

    return forkJoin({ gameInfoRequest, gameTrailerRequest, gameScreenshotsRequest }).pipe(
      map((res: any) => {
        return {
          ...res['gameInfoRequest'],
          screenshots: res['gameScreenshotsRequest']?.results,
          trailers: res['gameTrailersRequest']?.results
        };
      })
    );
  }
}
