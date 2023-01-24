import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FieldComponent } from './field/field.component';
import { HeroComponent } from './hero/hero.component';
import { MissileComponent } from './missile/missile.component';
import { EnemyTankComponent } from './enemy-tank/enemy-tank.component';
import { MissileDirective } from './missile/missile.directive';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    FieldComponent,
    HeroComponent,
    MissileComponent,
    MissileDirective,
    EnemyTankComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
