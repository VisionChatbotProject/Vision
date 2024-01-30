import { NgModule } from '@angular/core';

import { CoreUiModule } from '../core-ui/core-ui.module';
import { OrganizationRoutingModule } from './organization-routing.module';
import { OrganizationComponent } from './components/organization/organization.component';
import { MemberTableComponent } from './components/organization/member-table/member-table.component';
import { InviteTableComponent } from './components/organization/invite-table/invite-table.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    OrganizationComponent,
    MemberTableComponent,
    InviteTableComponent,
  ],
  imports: [
    CoreUiModule,
    OrganizationRoutingModule,
    CoreModule,
  ]
})
export class OrganizationModule { }
