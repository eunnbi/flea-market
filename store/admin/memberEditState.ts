import { atom } from "recoil";

export const memberEditState = atom<{
    open: boolean;
    id: string;
    initialState: MemberTableState;
}>({
    key: "memberEditState",
    default: {
        open: false,
        id: '',
        initialState: {
            userId: '',
            firstName: '',
            lastName: '',
            role: 'ADMIN',
        },
    }
})