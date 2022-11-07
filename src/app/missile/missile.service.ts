import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
} from '@angular/core';
import { interval, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import {
  DIRECTION,
  ICoords,
  IHit,
  IMissile,
  MISSILESOURCE,
} from '../app.model';
import { StateService } from '../state.service';
import { MissileComponent } from './missile.component';

@Injectable({
  providedIn: 'root',
})
export class MissileService {
  get heroCoords(): ICoords {
    return this.stateService.getHeroCoords();
  }
  get enemyCoords() {
    return this.stateService.getEnemyCoords();
  }
  get heroPower(): Observable<number> {
    return this.stateService.getHeroPowerChange$();
  }

  public triggerCheckForHit = new Subject();

  constructor(private stateService: StateService) {}

  public launchMissile(missileData: IMissile): void {
    const viewContainerRef = missileData.host.viewContainerRef;
    const componentRef =
      viewContainerRef.createComponent<MissileComponent>(MissileComponent);

    switch (missileData.source) {
      case MISSILESOURCE.HERO:
        componentRef.instance.direction = DIRECTION.UP;
        break;
      case MISSILESOURCE.ENEMY:
      case MISSILESOURCE.HEALTH:
        componentRef.instance.direction = DIRECTION.DOWN;
        break;
    }
    componentRef.instance.sourceCoords = missileData.sourceCoords;
    componentRef.instance.source = missileData.source;
    componentRef.instance.componentRef = componentRef;
  }

  public checkForHits(hit: IHit) {
    hit.sub.subscribe(() => this.destroyMissile(hit));
    this.triggerCheckForHit.pipe(takeUntil(hit.sub)).subscribe(() => {
      if (this.successfulHit(hit)) {
        this.destroyMissile(hit);
        this.registerHit(hit);
      }
    });
  }

  private successfulHit(hit: IHit) {
    return (
      ([MISSILESOURCE.ENEMY, MISSILESOURCE.HEALTH].includes(hit.source) &&
        this.checkEnemyMissileHit(hit)) ||
      (hit.source === MISSILESOURCE.HERO && this.checkHermoMissileHit(hit))
    );
  }

  private checkHermoMissileHit(hit: IHit) {
    return (
      hit.missileCoords.left >= this.enemyCoords.left &&
      hit.missileCoords.left <= this.enemyCoords.left + 60 &&
      hit.missileCoords.bottom + 30 >= this.enemyCoords.bottom
    );
  }

  private checkEnemyMissileHit(hit: IHit) {
    return (
      hit.missileCoords.left >= this.heroCoords.left &&
      hit.missileCoords.left <= this.heroCoords.left + 30 &&
      hit.missileCoords.bottom <= this.heroCoords.bottom + 30 &&
      hit.missileCoords.bottom > this.heroCoords.bottom
    );
  }

  public registerHit(hit: IHit) {
    if (hit.source === MISSILESOURCE.ENEMY) {
      this.stateService.updateHeroPowerChange$(-10);
    } else if (hit.source === MISSILESOURCE.HERO) {
      this.stateService.updateEnemyPowerChange$(-10);
    } else if (hit.source === MISSILESOURCE.HEALTH) {
      this.stateService.updateHeroPowerChange$(20);
      this.stateService.updateScore(hit.source);
    }
  }

  private destroyMissile(hit: IHit) {
    try {
      hit.componentRef.destroy();
    } catch (e) {}
  }
}
