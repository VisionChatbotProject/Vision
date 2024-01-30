import { NgModule } from '@angular/core';
import { TopbarHolderComponent } from './components/topbar-holder/topbar-holder.component';
import { RouterModule } from '@angular/router';
import { CoreUiModule } from '../core-ui/core-ui.module';
import { SidebarHolderComponent } from './components/sidebar-holder/sidebar-holder.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    TopbarHolderComponent,
    SidebarHolderComponent,
  ],
  imports: [
    CoreUiModule,
    RouterModule,
    NgbNavModule,
  ],
  exports: [
    TopbarHolderComponent,
    SidebarHolderComponent,
  ]
})
export class NavigationModule { }
