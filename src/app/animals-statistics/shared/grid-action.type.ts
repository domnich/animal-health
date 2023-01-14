import { Animal } from "./animal";
import { ANIMAL_BUTTON_ACTIONS } from "./animal-button.type";

export type GridAction = {
    action: `${ANIMAL_BUTTON_ACTIONS}`;
    data?: Animal;
}