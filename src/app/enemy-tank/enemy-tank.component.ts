import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { interval, skipUntil, Subject, switchMap, takeUntil, timeInterval, timer } from 'rxjs';
import { DIRECTION, ICoords, MISSILESOURCE } from '../app.model';
import { MissileDirective } from '../missile/missile.directive';
import { MissileService } from '../missile/missile.service';
import { StateService } from '../state.service';

@Component({
  selector: 'app-enemy-tank',
  templateUrl: './enemy-tank.component.html',
  styleUrls: ['./enemy-tank.component.scss'],
})
export class EnemyTankComponent implements OnInit, AfterViewInit {
  @Input()
  coords!: ICoords;
  @Input() enemyPower = 50;
  private maxEnemyPower = this.enemyPower;
  private readonly enemyPowerInterval = [0, 2000, 1500, 1000, 750, 500, 250];

  constructor(
    private missileService: MissileService,
    private stateService: StateService
  ) {}
  @ViewChild(MissileDirective, { static: true }) missileHost!: MissileDirective;
  sub = new Subject<void>();
  factor = -1;

  ngOnInit(): void {
    this.coords.bottom = 450;
    this.maxEnemyPower = this.enemyPower;
    this.stateService.updateEnemyPower((this.enemyPower/this.maxEnemyPower) * 100);
    this.stateService.getEnemyPowerChange$()
    .pipe(takeUntil(this.stateService.enemyDead))
    .subscribe((hit) => {
      this.enemyPower += hit;
      console.log(`Remaining Enemy Power: ${this.enemyPower}`);
      this.stateService.updateEnemyPower((this.enemyPower/this.maxEnemyPower) * 100);
      if (this.enemyPower <= 0) {
        this.stateService.enemyDead.next(true);
      }
    });
    this.fire();
    this.setMotion();
  }

  ngAfterViewInit(): void {
    this.stateService.updateEnemyCoords(this.coords);
  }

  private fire(): void {
    this.missileService.launchMissile({
      source: MISSILESOURCE.ENEMY,
      host: this.missileHost,
      sourceCoords: this.coords,
    });
  }

  private setMotion() {
    const tInterval = interval(this.enemyPowerInterval[this.stateService.getGameLevel()]);
    tInterval
      .pipe(timeInterval())
      .pipe(takeUntil(this.sub))
      .subscribe(() => {
        this.move();
        this.fire();
      });
  }

  private move() {
    this.coords.left = this.coords.left + 30 * this.factor;   
    if (this.coords.left >= 440) {
      this.factor = -1;
    } else if (this.coords.left <= 0) {
      this.factor = 1;
    } else {
      this.factor = Math.random() > 0.5 ? 1 : -1;
    }
    this.stateService.updateEnemyCoords(this.coords);
  }

  onDestroy() {
    this.sub.next();
    this.sub.complete();
  }
}
