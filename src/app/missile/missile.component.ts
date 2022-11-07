import { Component, ComponentRef, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject, takeUntil, timeInterval } from 'rxjs';
import { DIRECTION, ICoords, IHit, MISSILESOURCE } from '../app.model';
import { MissileService } from './missile.service';

@Component({
  selector: 'app-missile',
  templateUrl: './missile.component.html',
  styleUrls: ['./missile.component.scss'],
})
export class MissileComponent implements OnInit, OnDestroy {
  @Input()
  sourceCoords!: ICoords;
  @Input()
  direction: string = '';
  @Input()
  source: string = '';
  @Input() componentRef!: ComponentRef<MissileComponent>;

  missileCoords: ICoords = this.sourceCoords;
  missileInterval: any;
  missileMovement = new Subject();

  constructor(private el: ElementRef, private missileService: MissileService) {}

  ngOnInit(): void {
    this.missileCoords = {
      left: this.sourceCoords.left,
      bottom: this.sourceCoords.bottom,
    };
    this.setMissilePath();
  }

  private setMissilePath() {
    const hit = {
      source: this.source,
      missileCoords: this.missileCoords,
      el: this.el,
      sub: this.missileMovement,
      componentRef: this.componentRef,
    };
    this.missileService.checkForHits(hit);
    const tInterval = interval(50);
    tInterval
      .pipe(timeInterval())
      .pipe(takeUntil(this.missileMovement))
      .subscribe(() => {
        this.move();
        this.missileService.triggerCheckForHit.next(0);
      });
  }

  private move() {
    const newCoords = this.missileCoords;
    switch (this.direction) {
      case DIRECTION.UP:
        newCoords.bottom += 5;
        break;
      case DIRECTION.DOWN:
        this.missileCoords.bottom -= 5;
        break;
    }
    if (this.missileCoords.bottom < 0 || this.missileCoords.bottom > 500) {
      this.missileMovement.next(0);
      this.missileMovement.complete();
    }
  }

  public getMissileClass() {
    return { 
      's-hero': this.source === MISSILESOURCE.HERO,
      's-enemy': this.source === MISSILESOURCE.ENEMY,
      's-health': this.source === MISSILESOURCE.HEALTH
    }
  }

  ngOnDestroy() {
    this.missileMovement.next(0);
    this.missileMovement.complete();
  }
}
