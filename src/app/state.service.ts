import { Injectable } from '@angular/core';
import { interval, Observable, Subject, takeUntil, timeInterval } from 'rxjs';
import { ICoords, MISSILESOURCE } from './app.model';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor() {}

  private heroCoords!: ICoords;
  private enemyCoords!: ICoords;
  private heroPower: number = 0;
  private enemyPower: number = 0;
  private heroPowerChange = new Subject<number>();
  public heroPowerUpdated$ = new Subject<void>();
  private enemyPowerChange = new Subject<number>();
  public heroDead = new Subject<boolean>();
  public enemyDead = new Subject<boolean>();
  public gameOver = new Subject<boolean>();
  public startGame = new Subject<boolean>();
  private gameLevel = 1;
  private score = 0;

  getHeroCoords() {
    return this.heroCoords;
  }
  getEnemyCoords() {
    return this.enemyCoords;
  }

  public updateHeroCoords(newCoords: ICoords) {
    if (!!newCoords) {
      this.heroCoords = newCoords;
    }
  }

  public updateEnemyCoords(newCoords: ICoords) {
    if (!!newCoords) {
      this.enemyCoords = newCoords;
    }
  }

  public getHeroPowerChange$(): Observable<number> {
    return this.heroPowerChange.asObservable();
  }

  public updateHeroPowerChange$(factor: number) {
    if (!!factor) {
      this.heroPowerChange.next(factor);
    }
  }

  public getEnemyPowerChange$(): Observable<number> {
    return this.enemyPowerChange.asObservable();
  }

  public updateEnemyPowerChange$(factor: number) {
    if (!!factor) {
      this.enemyPowerChange.next(factor);
      this.updateScore(MISSILESOURCE.HERO);
    }
  }

  public getHeroPower() {
    return this.heroPower;
  }

  public updateHeroPower(value: number) {
    if (!!value) {
      this.heroPower = value;
      this.heroPowerUpdated$.next();
    }
  }

  public getEnemyPower() {
    return this.enemyPower;
  }

  public updateEnemyPower(value: number) {
    if (!!value) {
      this.enemyPower = value;
    }
  }

  public getGameLevel() {
    return this.gameLevel;
  }
  public updateGameLevel() {
    this.gameLevel++;
  }
  public resetGameLevel() {
    this.gameLevel = 1;
  }
  public getScore() {
    return this.score;
  }
  public updateScore(source: string) {
    if (source === MISSILESOURCE.HERO) {
      this.score += 2;
    } else if (source === MISSILESOURCE.HEALTH) {
      this.score += 10;
    }
  }
  public resetScore() {
    this.score = 0;
  }

/*   public startScoreBoard() {
    this.score = 0;
    const tInterval = interval(200);
    tInterval
      .pipe(timeInterval())
      .pipe(takeUntil(this.gameOver))
      .subscribe(() => {
        this.score += 2;
      });
  } */

  public getHighScore() { 
    return Number(localStorage.getItem('highScore'));
  }

  public setNewHighScore() {
    if (this.score > this.getHighScore()) {
      localStorage.setItem('highScore', this.score.toString());
    }    
  }
}
