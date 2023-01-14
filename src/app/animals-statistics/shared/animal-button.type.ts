export enum ANIMAL_BUTTON_ACTIONS {
    DELETE = 'delete',
    EDIT = 'edit',
    CREATE = 'create',
    CANCEL = 'cancel',
    UPDATE = 'update'
}

export type AnimalButtonAttributes = {
    action: `${ANIMAL_BUTTON_ACTIONS}`;
    id: string;
}