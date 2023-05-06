import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/models';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  gameRating = 0;
  gameId: string = '';
  gameSlug = '';
  game!: Game;
  routeSub!: Subscription;
  gameSub!: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.routeSub = this._route.params.subscribe((params: Params) => {
      this.gameId = params['id'];
      this.gameSlug = params['slug'];
      this.getGameDetails(this.gameId, this.gameSlug);
    });
  }

  getGameDetails(id: string, slug: string): void {
    this.gameSub = this._httpService.getGamesDetails(id, slug).subscribe((response: Game) => {
      this.game = response;

      setTimeout(() => {
        this.gameRating = this.game.metacritic;
      }, 100);
    });
  }

  getColor(value: number): string {
    if (value > 75) return '#5EE432';
    else if (value > 50) return '#FFFA50';
    else if (value > 30) return '#F7AA38';
    return '#EF4655';
  }

  ngOnDestroy(): void {
    if (this.gameSub) this.gameSub.unsubscribe();
    if (this.routeSub) this.routeSub.unsubscribe();
  }

}
