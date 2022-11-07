import { Component, ComponentRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { interval, startWith, takeUntil, timeInterval } from 'rxjs';
import { ICoords, MISSILESOURCE } from '../app.model';
import { EnemyTankComponent } from '../enemy-tank/enemy-tank.component';
import { HeroComponent } from '../hero/hero.component';
import { MissileDirective } from '../missile/missile.directive';
import { MissileService } from '../missile/missile.service';
import { StateService } from '../state.service';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
})
export class FieldComponent implements OnInit, OnDestroy {
  public get heroCoords(): ICoords {
    return this.currentHeroCoords;
  }
  public set heroCoords(value: ICoords) {
    if (value) {
      this.currentHeroCoords = value;
    }
  }
  private readonly initialHeroCoords = {
    bottom: 50,
    left: 250,
  };
  private currentHeroCoords = this.initialHeroCoords;
  public mode: 'ON' | 'OFF' = 'OFF';
  @ViewChild(MissileDirective, { static: true }) heroHost!: MissileDirective;

  private heroRef!: ComponentRef<HeroComponent>;
  private enemyRef!: ComponentRef<EnemyTankComponent>;
  public gameOver = false;
  private readonly leveltoEnemyPowerMap = [0, 50, 70, 100, 150, 200];
  public highScore = this.stateService.getHighScore();
  public updateLevelUI = ''; 
  private timeout: any;
  constructor(public stateService: StateService, private missileService: MissileService) {}

  ngOnInit() {
    this.setUpListeners();
  }

  setUpListeners() {
    this.stateService.heroDead
    .subscribe(() => {
      this.heroRef.destroy();
      this.enemyRef.destroy();
      this.mode = 'OFF';
      this.stateService.gameOver.next(true);
      this.gameOver = true;
      this.stateService.setNewHighScore();
    });
    this.stateService.enemyDead
      .subscribe(() => {
        this.enemyRef.destroy();
        if (!this.gameOver) {
          this.stateService.updateGameLevel();
          this.notifyLevelUpdate();
          this.createEnemyTank(
            this.leveltoEnemyPowerMap[this.stateService.getGameLevel()]
          );
        }       
      });
  }

  start() {
    this.createHero();
    this.createEnemyTank();
    this.mode = 'ON';
    this.gameOver = false;
    this.stateService.resetGameLevel();
    this.stateService.resetScore();
    this.stateService.startGame.next(true);
    // this.stateService.startScoreBoard();
    this.initiateHealthRecharge();
  }

  stop() {
    this.mode = 'OFF';
    this.stateService.gameOver.next(true);
    this.heroCoords = this.initialHeroCoords;
    this.heroHost.viewContainerRef.clear();
    this.enemyRef.destroy();
    this.stateService.setNewHighScore();
  }

  createHero() {
    const viewContainerRef = this.heroHost.viewContainerRef;
    this.heroRef =
      viewContainerRef.createComponent<HeroComponent>(HeroComponent);
    this.heroRef.instance.coords = this.heroCoords;
  }

  createEnemyTank(tankPower = 50) {
    const viewContainerRef = this.heroHost.viewContainerRef;
    this.enemyRef =
      viewContainerRef.createComponent<EnemyTankComponent>(EnemyTankComponent);
    this.enemyRef.instance.coords = {
      bottom: 450,
      left: 250,
    };
    this.enemyRef.instance.enemyPower = tankPower;
  }

  getHighScore() {
    return this.stateService.getScore() > this.highScore
      ? this.stateService.getScore()
      : this.highScore;
  }

  public initiateHealthRecharge() {
    const tInterval = interval(5000);
    tInterval
      .pipe(timeInterval())
      .pipe(takeUntil(this.stateService.gameOver))
      .subscribe(() => {
        this.fire(this.heroHost, this.getHealthCoords());
      });
  }

  private fire(missileHost: MissileDirective, coords: ICoords): void {
    this.missileService.launchMissile({
      source: MISSILESOURCE.HEALTH,
      host: missileHost,
      sourceCoords: coords,
    });
  }

  private getHealthCoords(): ICoords {
    return {
     bottom: 500,
     left: Math.random() * 500
   };
  }

  private notifyLevelUpdate() {
    this.updateLevelUI = 'blink-level-update';
    this.timeout = setTimeout(() => {
      this.updateLevelUI = '';
    }, 2000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }
}
