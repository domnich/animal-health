import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppButtonComponent } from './app-button/app-button.component';
import { SvgIconComponent } from './svg-icon/svg-icon.component';
import { LoaderComponent } from './loader/loader.component';
import { EditableItemComponent } from './editable-item/editable-item.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppButtonComponent,
    SvgIconComponent,
    LoaderComponent,
    EditableItemComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    AppButtonComponent,
    SvgIconComponent,
    LoaderComponent,
    EditableItemComponent,
  ]
})
export class SharedModule { }