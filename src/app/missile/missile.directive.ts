import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[missileHost]',
})
export class MissileDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
