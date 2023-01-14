import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UpdateValue } from 'src/app/shared/editable-item/updated-value.type';
import { AnimalHelperService } from '../../services/animal-helper.service';
import { Animal, AnimalKeys } from '../../shared/animal';
import { ANIMAL_BUTTON_ACTIONS } from '../../shared/animal-button.type';

@Component({
  selector: 'animal-grid-item, [animal-grid-item]',
  templateUrl: './animal-grid-item.component.html',
  styleUrls: ['./animal-grid-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalGridItemComponent implements OnInit {
  public actionDelete: ANIMAL_BUTTON_ACTIONS = ANIMAL_BUTTON_ACTIONS.DELETE;
  public actionEdit: ANIMAL_BUTTON_ACTIONS = ANIMAL_BUTTON_ACTIONS.EDIT;
  public isEmptyObject: boolean;

  @Input() public animal: Animal;
  @Input() public isEditableView: boolean;
  @Output() public animalChange: EventEmitter<Animal> = new EventEmitter<Animal>();

  constructor(private animalHelperService: AnimalHelperService) { }

  ngOnInit(): void {
    this.checkIfAllAnimalValuesAreEmpty();
  }

  public onValueChange(event: any) {
    if (this.isEditableView) {
      this.animal = this.animalHelperService.getUpdatedAnimal(this.animal, event);
      this.checkIfAllAnimalValuesAreEmpty();
      this.animalChange.emit(this.animal);
    }
  }

  public updateItem(value: UpdateValue<AnimalKeys>) {
    this.animalHelperService.updateItem(this.animal, value);
  }

  public cancel() {
    this.animalHelperService.cancelNewItemCreation();
  }

  public create() {
    this.animalHelperService.createNewItem(this.animal);
  }

  private checkIfAllAnimalValuesAreEmpty(): void {
    this.isEmptyObject = this.animalHelperService.isEmptyObject(this.animal);
  }
}