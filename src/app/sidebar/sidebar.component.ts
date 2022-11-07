import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { StateService } from '../state.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public heroPower = 100;
  public enemyPower = 100;
  constructor(
    public stateService: StateService
  ) { }

  ngOnInit(): void {    
    this.stateService.heroPowerUpdated$
    .subscribe(() => {
      this.heroPower = this.stateService.getHeroPower();
    })
    this.stateService.getEnemyPowerChange$()
    .subscribe(() => {
      this.enemyPower = this.stateService.getEnemyPower();
    })
  }

}
