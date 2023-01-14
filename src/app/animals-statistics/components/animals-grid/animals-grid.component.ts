import { 
  ChangeDetectionStrategy, 
  Component, 
  ElementRef, 
  OnDestroy, 
  OnInit, 
  ViewChild 
} from '@angular/core';
import { 
  BehaviorSubject, 
  map, 
  Observable, 
  Subject, 
  take, 
  takeUntil 
} from 'rxjs';
import { AnimalsService } from 'src/app/animals-statistics/services/animals.service';
import { Animal } from 'src/app/animals-statistics/shared/animal';
import { AnimalsResponse } from 'src/app/animals-statistics/shared/animals-response.type';
import { AnimalHelperService } from '../../services/animal-helper.service';
import { 
  AnimalButtonAttributes, 
  ANIMAL_BUTTON_ACTIONS 
} from '../../shared/animal-button.type';
import { GridAction } from '../../shared/grid-action.type';

@Component({
  selector: 'animals-grid',
  templateUrl: './animals-grid.component.html',
  styleUrls: ['./animals-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalsGridComponent implements OnInit, OnDestroy {
  public dataLoaded$: Observable<boolean>;
  /**
   * Really nice to use async pipes to pass data to the view especially for components which are using 
   * ChangeDetectionStrategy.OnPush... first of all because it's no need to call unsubscribe on it and also
   * there is no to detectChanges() on data change.
   * Here I used BehaviorSubject, becase I'll need to manipulate with the data from animals and form observable
   * it's not possible to get Animals array in short way, like eg it's possible with BehaviorSubject ==> BehaviorSubject.getValue()
   * and also with BehaviorSubject it's possible quit easy update it via next(...) method 
   */
  public animals$: BehaviorSubject<Animal[]> = new BehaviorSubject<Animal[]>([]);
  public newAnimal: Animal | null;
  public isEditAll: boolean = false;

  // emulation for list lazy loading on scroll to store data which isn't still rendered on the screen
  private localAnimalsList: Animal[];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @ViewChild('detectScroll', { static: false, read: ElementRef }) public detectScrollHtmlElement: ElementRef;

  constructor(
    private animalsService: AnimalsService,
    private animalHelperService: AnimalHelperService,
  ) { }

  ngOnInit(): void {
    this.initSubscriptions();
    this.getAnimalsList();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public addNewEntity(): void {
    this.newAnimal = this.animalHelperService.getModel();
  }

  /**
   * Listening only one click delete animal event (attached on tbody) instead of additing
   * click event on each delete buttonn ander animal item component...
   * In this case, we have significantly reduced the number of events listeners on the page
   * 
   * Same can be done for eg edit button event listener (pencil btn) etc.
   */
  public onDeleteAnimalClick(event: MouseEvent): void {
    this.animalHelperService.getButtonAttributes(event)
      .pipe(take(1))
      .subscribe((attrs: AnimalButtonAttributes | null) => {
        if (attrs) {
          this.deleteAnimal(attrs.id);
        }
      });
  }

  private getAnimalsList(): void {
    this.animalsService.getAnimals()
      .pipe(map((response: AnimalsResponse) => response.result))
      .subscribe((animals: Animal[]) => {
        this.animalHelperService.requestLoaded(true);
        this.loadList(animals);
        this.watchScrollPosition();
      });
  }

  private initSubscriptions(): void {
    this.dataLoaded$ = this.animalHelperService.dataReady$;

    this.animalsService.animalUpdated$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((animal: Animal) => {
        const updatedAnimalsList: Animal[] = this.animalHelperService.getUpdatedList(this.animals$.getValue(), animal);
        this.animals$.next(updatedAnimalsList);
      });

    this.animalHelperService.gridActions$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((gridAction: GridAction) => {
        const animalFromSource: Animal | undefined = gridAction.data;
        if (animalFromSource) {
          this.onAction(gridAction.action, animalFromSource);
        }
        this.newAnimal = null;
      });
  }

  private onAction(action: `${ANIMAL_BUTTON_ACTIONS}`, animal: Animal): void {
    switch (action) {
      case ANIMAL_BUTTON_ACTIONS.CREATE:
        this.createAnimal(animal);
        break;
      case ANIMAL_BUTTON_ACTIONS.UPDATE:
        this.animalsService.updateAnimal(animal).subscribe();
        break;
    }
  }

  private createAnimal(animal: Animal): void {
    this.animalsService.createAnimal(animal).subscribe(() => {
      // Just additing some random ids to be able in futere detect item for delete action...In real life BE needs to provide the unique id
      animal.animalId = this.animalHelperService.getRandomId();
      this.animals$.next([animal, ...this.animals$.getValue()]);
    });
  }

  private deleteAnimal(id: string): void {
    this.animalsService.deleteAnimal(id).subscribe((removedAnimalId: string) => {
      const animals: Animal[] = this.animalHelperService.deleteAnimal(this.animals$.getValue(), removedAnimalId);
      this.animals$.next(animals);
    });
  }

  /**
   * Rendering limited items number on the screen in case we have situation like in this code sample
   * where we have to load all 100 enteties and by some reason server cant return lazy loaded way data
   */
  private loadList(animals: Animal[]): void {
    this.localAnimalsList = [...animals];
    const splicedAnimalsList = this.localAnimalsList.splice(0, 20);
    this.animals$.next([...this.animals$.getValue(), ...splicedAnimalsList]);
  }

  private watchScrollPosition(): void {
    // lazy loading emulation
    this.animalHelperService.detectScrollBottomPosition(this.detectScrollHtmlElement, (bottom) => {
      if (bottom && this.localAnimalsList.length) {
        this.animalHelperService.requestLoaded(false);
        this.loadList(this.localAnimalsList);
        // remove loading indicator emulation
        setTimeout(() => {
          this.animalHelperService.requestLoaded(true);
        }, 1000)
      }
    });
  }
}
