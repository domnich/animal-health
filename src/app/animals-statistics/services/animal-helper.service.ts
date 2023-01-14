import { Injectable } from "@angular/core";
import { Observable, of, Subject } from "rxjs";
import { UpdateValue } from "src/app/shared/editable-item/updated-value.type";
import { Animal, AnimalKeys } from "../shared/animal";
import { AnimalButtonAttributes, ANIMAL_BUTTON_ACTIONS } from "../shared/animal-button.type";
import { GridAction } from "../shared/grid-action.type";

@Injectable()
export class AnimalHelperService {
    private intersectionObserver: IntersectionObserver;
    private gridActionsSource: Subject<GridAction> = new Subject<GridAction>();
    private dataReadySource: Subject<boolean> = new Subject<boolean>();
    public dataReady$: Observable<boolean> = this.dataReadySource.asObservable();
    public gridActions$: Observable<GridAction> = this.gridActionsSource.asObservable();

    public cancelNewItemCreation() {
        this.gridActionsSource.next({
            action: ANIMAL_BUTTON_ACTIONS.CANCEL
        });
    }

    public updateItem(animal: Animal, value: UpdateValue<AnimalKeys>) {
        const newAnimal: Animal = this.getUpdatedAnimal(animal, value);
        this.gridActionsSource.next({
            action: ANIMAL_BUTTON_ACTIONS.UPDATE,
            data: newAnimal
        });
    }

    public createNewItem(animal: Animal) {
        this.gridActionsSource.next({
            action: ANIMAL_BUTTON_ACTIONS.CREATE,
            data: animal
        });
    }

    public requestLoaded(isReady: boolean): void {
        this.dataReadySource.next(isReady);
    }

    public getButtonAttributes(event: MouseEvent): Observable<AnimalButtonAttributes | null> {
        const parent: HTMLElement | null = this.getParent(event);
        const attrs: AnimalButtonAttributes | null = this.getAttributes(parent);

        return of(attrs);
    }

    public getUpdatedList(animals: Animal[], animal: Animal): Animal[] {
        /**
         * Check done as  `animalInArray.animalId == animal.animalId || animalInArray.cowId == animal.cowId`
         * just because some animal object have animalId and not cowId, another objects have cowId and not animalId
         * I think on prod there should be some uniq id for each entity
         */
        const index: number = animals.findIndex((animalInArray: Animal) =>
            animalInArray.animalId == animal.animalId || animalInArray.cowId == animal.cowId);

        if (index >= 0) {
            animals[index] = animal;
        }

        return animals;
    }

    public deleteAnimal(animals: Animal[], id: string): Animal[] {
        return animals.filter(({ animalId, cowId }: { animalId: string, cowId: string }) => {
            /**
             * Check for animalId and cowId because some enteties has cowId and some has animalId
             */
            return animalId?.toString() !== id && cowId?.toString() !== id;
        });
    }

    public getUpdatedAnimal(animal: Animal, updatedValue: UpdateValue<AnimalKeys>): Animal {
        animal[updatedValue!.key as AnimalKeys] = updatedValue.value;
        return { ...animal };
    }

    public isEmptyObject(animal: Animal): boolean {
        return !!!Object.values(animal).filter((val: string) => val).length
    }

    public getModel(): Animal {
        return {
            type: '',
            cowId: '',
            animalId: '',
            eventId: '',
            deletable: '',
            lactationNumber: '',
            daysInLactation: '',
            ageInDays: '',
            startDateTime: '',
            reportingDateTime: '',
        };
    }

    public detectScrollBottomPosition(entry: any, callback: (bottom: boolean) => void) {
        const handleIntersection = (entries: any) => {
            entries.map((entry: any) => {
                callback(entry.isIntersecting);
            });
        }
        const config = {
            root: null, // avoiding 'root' or setting it to 'null' sets it to default value: viewport
            rootMargin: '0px',
            threshold: 0.5
        };
        this.intersectionObserver = new IntersectionObserver(handleIntersection, config);
        this.intersectionObserver.observe(entry.nativeElement);
    }

    private getParent(event: MouseEvent): HTMLElement | null {
        // Wrapped to be able to use getAttribute property
        const target: HTMLElement | null = event.target as HTMLElement;
        const parent = (<HTMLElement>(<HTMLElement>target).parentNode);

        return parent;
    }

    private getAttributes(el: HTMLElement | null): AnimalButtonAttributes | null {
        if (!el) return null;

        const action: ANIMAL_BUTTON_ACTIONS = el.getAttribute('data-animal-action') as ANIMAL_BUTTON_ACTIONS
            ?? ANIMAL_BUTTON_ACTIONS.EDIT;
        const id: string = el.getAttribute('data-animal-id') ?? '';

        return id ? { action, id } : null;
    }
}