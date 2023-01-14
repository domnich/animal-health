import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimalsGridComponent } from './components/animals-grid/animals-grid.component';
import { AnimalGridItemComponent } from './components/animal-grid-item/animal-grid-item.component';
import { AppButtonComponent } from '../shared/app-button/app-button.component';
import { AnimalsService } from './services/animals.service';
import { AnimalHelperService } from './services/animal-helper.service';
import { EditableItemComponent } from '../shared/editable-item/editable-item.component';
import { SvgIconComponent } from '../shared/svg-icon/svg-icon.component';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../shared/loader/loader.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FakeBackendHttpInterceptor } from './interceptor/fakebackend';

@NgModule({
  declarations: [
    AnimalsGridComponent,
    AnimalGridItemComponent,
    AppButtonComponent,
    EditableItemComponent,
    SvgIconComponent,
    LoaderComponent
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
    FormsModule
  ]
})
export class AnimalsStatisticsModule { }
