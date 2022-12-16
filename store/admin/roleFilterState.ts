import { atom } from "recoil";

type State = {
    admin: boolean;
    seller: boolean;
    buyer: boolean;
}

export type Key = keyof State;

export const roleFilterState = atom<State>({
    key: "roleFilterState",
    default: {
        admin: true,
        seller: true,
        buyer: true,
    }
})