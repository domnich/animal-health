import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject, take, takeUntil } from 'rxjs';
import { AnimalsService } from 'src/app/animals-statistics/services/animals.service';
import { Animal } from 'src/app/animals-statistics/shared/animal';
import { AnimalsResponse } from 'src/app/animals-statistics/shared/animals-response.type';
import { AnimalHelperService } from '../../services/animal-helper.service';
import { ANIMAL_BUTTON_ACTIONS } from '../../shared/animal-button.type';
import { GridAction } from '../../shared/grid-action.type';

@Component({
  selector: 'animals-grid',
  templateUrl: './animals-grid.component.html',
  styleUrls: ['./animals-grid.component.scss']
})
export class AnimalsGridComponent implements OnInit, OnDestroy {
  public dataLoaded$: Observable<boolean>;
  public animals$: BehaviorSubject<Animal[]> = new BehaviorSubject<Animal[]>([]);
  public newAnimal: Animal | null;
  public isEditAll: boolean = false;

  // emulation for list lazy loading on scroll
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
      case ANIMAL_BUTTON_ACTIONS.DELETE:
        this.deleteAnimal(animal);
       
        break;
    }
  }

  private createAnimal(animal: Animal): void {
    this.animalsService.createAnimal(animal).subscribe(() => {
      this.animals$.next([animal, ...this.animals$.getValue()]);
    });
  }

  private deleteAnimal(animal: Animal): void {
    this.animalsService.deleteAnimal(animal.animalId || animal.cowId).subscribe((removedAnimalId: string) => {
      const animals: Animal[] = this.animalHelperService.removeAnimalFromList(this.animals$.getValue(), removedAnimalId);
      this.animals$.next(animals);
    });
  }

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
