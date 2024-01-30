import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ImgSrcDirective } from './directives/img-src/img-src.directive';
import { OrganizationRolePipe } from './pipes/organization-role/organization-role.pipe';


@NgModule({
  declarations: [
    ImgSrcDirective,
    OrganizationRolePipe,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  exports : [
    CommonModule,
    ImgSrcDirective,
    OrganizationRolePipe,
  ],
})
export class CoreModule { }
