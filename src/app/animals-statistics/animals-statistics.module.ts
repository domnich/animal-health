import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimalsGridComponent } from './components/animals-grid/animals-grid.component';
import { AnimalGridItemComponent } from './components/animal-grid-item/animal-grid-item.component';
import { AnimalsService } from './services/animals.service';
import { AnimalHelperService } from './services/animal-helper.service';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FakeBackendHttpInterceptor } from './interceptor/fakebackend';
import { SharedModule } from '../shared/shared.module';

/**
 * Shared module adds ability to use shared components in any module form the application
 */
@NgModule({
  declarations: [
    AnimalsGridComponent,
    AnimalGridItemComponent,
  ],
  exports: [
    AnimalsGridComponent
  ],
  providers: [
    AnimalsService,
    AnimalHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendHttpInterceptor, multi: true }
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ]
})
export class AnimalsStatisticsModule { }
