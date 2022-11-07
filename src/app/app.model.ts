import { ApplicationRef, ComponentRef, ElementRef, ViewContainerRef } from "@angular/core"
import { Subject } from "rxjs"
import { MissileComponent } from "./missile/missile.component"
import { MissileDirective } from "./missile/missile.directive"

export interface ICoords {
    left: number;
    bottom: number;
}

export const KeyboardCode = {
    SPACE: 'Space',
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight'
}

export const DIRECTION = {
    UP: 'Up',
    DOWN: 'Down',
}

export const MISSILESOURCE = {
    HERO: 'HERO',
    ENEMY: 'ENEMY',
    HEALTH: 'HEALTH'
}

export interface IHit {
    source: string;
    missileCoords: ICoords;
    el: ElementRef;
    sub: Subject<unknown>;
    componentRef: ComponentRef<MissileComponent>;
}

export interface IMissile {
    source: string;
    host: MissileDirective;
    sourceCoords: ICoords;
}