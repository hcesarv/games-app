import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Game } from 'src/app/models';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  sort: string = '';
  games!: Array<Game>;
  private routeSub!: Subscription;
  private gameSub!: Subscription;

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.routeSub = this._route.params.subscribe((params: Params) => {
      if (params['game-search']) {
        this.searchGames('metacrit', params['game-search']);
      } else {
        this.searchGames('metacrit');
      }
    });
  }

  searchGames(sort: string, search?: string): void {
    this.gameSub = this._httpService.getGamesList(sort, search).subscribe((gameList: APIResponse<Game>) => {
      this.games = gameList.results;
    });
  }

  openGameDetails(id: string, slug: string): void {
    this._router.navigateByUrl( `details/${id}/${slug}`);
  }

  ngOnDestroy(): void {
    if (this.gameSub) this.gameSub.unsubscribe();
    if (this.routeSub) this.routeSub.unsubscribe();
  }

}
