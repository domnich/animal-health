import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconName } from './icon-name.type';


@Component({
  selector: 'app-svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgIconComponent implements OnInit {
  @Input() public icon: IconName;
  @Output() public onClick: EventEmitter<void> = new EventEmitter<void>();
  public url: string;
  constructor() { }

  ngOnInit(): void {
    this.url = this.setPath();
  }

  public onButtonClick(): void {
    this.onClick.emit();
  }

  private setPath(): string {
    return `/assets/icon-${this.icon}.svg`;
  }
}