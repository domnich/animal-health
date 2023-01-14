import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AnimalsStatisticsModule } from './animals-statistics/animals-statistics.module';
import { AppComponent } from './app.component';
import { FakeBackendHttpInterceptor } from './animals-statistics/interceptor/fakebackend';

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
