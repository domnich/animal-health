import { Animal } from "./animal";

export type AnimalsResponse = {
    offset: number;
    limit: number;
    total: number;
    result: Animal[];
}