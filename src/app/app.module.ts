import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AnimalsStatisticsModule } from './animals-statistics/animals-statistics.module';
import { AppComponent } from './app.component';

/**
 * As it's quite small app it was also possible to implement "test task" using
 * standalone components only and totaly remove all NgModules from the app.
 * Anyway decided to do it in old way just to show how Ang works with NgModules structure
 */
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AnimalsStatisticsModule,
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
