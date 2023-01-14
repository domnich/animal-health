import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UpdateValue } from './updated-value.type';

@Component({
  selector: 'editable-item',
  templateUrl: './editable-item.component.html',
  styleUrls: ['./editable-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditableItemComponent implements OnInit {
  @Input() public value: string | undefined;
  @Input() public key: string;
  @Input() public inputOnly: boolean;
  @Output() public valueChange: EventEmitter<UpdateValue<any>> = new EventEmitter<UpdateValue<any>>();
  @Output() public update: EventEmitter<UpdateValue<any>> = new EventEmitter<UpdateValue<any>>();
  public isTextView: boolean = true;
  public inputValue: string;

  constructor(private ref: ElementRef) { }

  ngOnInit(): void {
    /**
     * Adds additional class to parent element for to visualy separate
     * editanle and not editable item for user
     */
    this.ref.nativeElement.parentElement.classList.add('has-hover');
    this.setDefaultValue();
  }

  public onChange(val: any): void {
    if (this.inputOnly) {
      this.valueChange.emit(this.getUpdatedValue(val));
    }
  }

  public onEditClick(): void {
    this.isTextView = false;
  }

  public onUpdateClick(): void {
    this.update.emit(this.getUpdatedValue());
    this.isTextView = true;
  }

  public onCancelClick() {
    this.setDefaultValue();
    this.isTextView = true;
  }

  private setDefaultValue(): void {
    this.inputValue = this.value ?? '';
  }

  private getUpdatedValue(value?: string): UpdateValue<any> {
    const obj: UpdateValue<any> = {
      value: value || this.inputValue,
      key: this.key
    }
    return obj;
  }
}
