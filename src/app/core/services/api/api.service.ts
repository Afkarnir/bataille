import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Game, GamePayload } from '../../models/game';
import { Player, PlayerPayload } from '../../models/player';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  ping() {
    return this.http.get(`${this.apiUrl}/ping`);
  }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players`);
  }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/games`);
  }

  postPlayer(player: PlayerPayload): Observable<Player> {
    return this.http.post<Player>(`${this.apiUrl}/players`, player);
  }

  postGame(game: GamePayload): Observable<Game> {
    return this.http.post<Game>(`${this.apiUrl}/games`, game);
  }
}
