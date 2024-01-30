import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { environment } from 'src/environments/environment';
import { CoreUiModule } from './core-ui/core-ui.module';

// This might seem hacky, and it is. But it's the only way to truly inject a dynamic configuration into an angular app.
export const config: Object | undefined = (window as any)['config']
if(config != undefined) {
  Object.keys(config).forEach(key => (environment as any)[key] = (config as any)[key]);
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    
    AppRoutingModule,
    AuthModule,
    FontAwesomeModule,
    CoreUiModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
