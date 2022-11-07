import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissileComponent } from './missile.component';

describe('MissileComponent', () => {
  let component: MissileComponent;
  let fixture: ComponentFixture<MissileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
