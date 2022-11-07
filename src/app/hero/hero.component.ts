import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { pipe, takeUntil } from 'rxjs';
import { ICoords, KeyboardCode, MISSILESOURCE } from '../app.model';
import { MissileDirective } from '../missile/missile.directive';
import { MissileService } from '../missile/missile.service';
import { StateService } from '../state.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit, OnDestroy {
  @Input()
  coords!: ICoords;
  private readonly maxHeroPower = 50;
  @Input() heroPower = this.maxHeroPower;

  public get heroCoords(): ICoords {
    return this.coords;
  }
  public set heroCoords(value: ICoords) {
    if (value) {
      this.coords = value;
    }
  }

  public heroColorMap = ['#73b250', '#eca568', '#ddcf54', '#b43d31'];
  private unlistener!: Function;

  @ViewChild(MissileDirective, { static: true }) missileHost!: MissileDirective;

  constructor(
    private renderer: Renderer2,
    private stateService: StateService,
    private missileService: MissileService
  ) {}

  ngOnInit(): void {
    this.stateService.updateHeroCoords(this.heroCoords);
    this.stateService.updateHeroPower((this.heroPower/this.maxHeroPower) * 100);
    this.unlistener = this.renderer.listen('document', 'keyup', (e) => this.handleKeyboardEvent(e.code));

    this.stateService.getHeroPowerChange$()
    .pipe(takeUntil(this.stateService.heroDead))
    .subscribe((hit) => {
      if (this.heroPower + hit > 50 && hit > 0) {
        this.heroPower =  this.maxHeroPower;
      } else {
        this.heroPower += hit;
      }       
      console.log(`Remaining Hero Power: ${this.heroPower}`);
      this.stateService.updateHeroPower((this.heroPower/this.maxHeroPower) * 100);
      if (this.heroPower <= 0) {
        this.stateService.heroDead.next(true);
      }
    });
  }

  private moveLeft(): void {
    if (this.heroCoords.left - 30 > 0) {
      const leftUnit = this.heroCoords.left - 30;
      this.heroCoords = {
        bottom: 50,
        left: leftUnit,
      };
    }
  }

  private moveRight(): void {
    if (this.heroCoords.left < 440) {
      const leftUnit = this.heroCoords.left + 30;
      this.heroCoords = {
        bottom: 50,
        left: leftUnit,
      };
    }
  }

  public fire(): void {
    this.missileService.launchMissile({
      source: MISSILESOURCE.HERO,
      host: this.missileHost,
      sourceCoords: this.heroCoords,
    });
  }

  private handleKeyboardEvent(keyCode: string): void {
    switch (keyCode) {
      case KeyboardCode.LEFT:
        this.moveLeft();
        break;
      case KeyboardCode.RIGHT:
        this.moveRight();
        break;
      case KeyboardCode.SPACE:
        this.fire();
        break;
    }
    this.stateService.updateHeroCoords(this.heroCoords);
  }

  public getHeroColor() {
    const powerValue = (this.heroPower / this.maxHeroPower) * 100;
    if (powerValue >= 75) {
      return this.heroColorMap[0];
    } else if (powerValue < 75 && powerValue >= 50) {
      return this.heroColorMap[1];
    } else if (powerValue < 50 && powerValue >= 20) {
      return this.heroColorMap[2];
    } else if (powerValue < 20) {
      return this.heroColorMap[3];
    }
    return this.heroColorMap[3];
  }

  ngOnDestroy() {
    this.unlistener();
  }
}
