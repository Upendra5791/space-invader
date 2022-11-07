import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnemyTankComponent } from './enemy-tank.component';

describe('EnemyTankComponent', () => {
  let component: EnemyTankComponent;
  let fixture: ComponentFixture<EnemyTankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnemyTankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnemyTankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
