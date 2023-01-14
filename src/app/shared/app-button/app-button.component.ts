import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  AppButton,
  APP_BUTTON 
} from './app-button.type';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppButtonComponent {
  @Input() public type: AppButton = APP_BUTTON.PRIMARY;
  @Input() public disabled: boolean = false;
  @Output() public onClick: EventEmitter<void> = new EventEmitter<void>();

  public action(): void {
    this.onClick.emit();
  }
}