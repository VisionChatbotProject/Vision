import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { CoreModule } from '../core/core.module';
import { HolderComponent } from './components/holder/holder.component';
import { NavigationModule } from '../navigation/navigation.module';
import { OrganizationCheckComponent } from './components/organization-check/organization-check.component';


@NgModule({
  declarations: [
    HolderComponent,
    OrganizationCheckComponent,
  ],
  imports: [
    NavigationModule,
    CoreModule,
    MainRoutingModule
  ]
})
export class MainModule { }
