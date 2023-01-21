import { atom, selector } from "recoil";

export const mapState = atom({
  key: "mapState",
  default: {
    location: "",
    isError: false,
  },
});

export const locationState = selector({
  key: "locationState",
  get: ({ get }) => {
    const map = get(mapState);
    return map.location;
  },
  set: ({ get, set }, newValue) => {
    const map = get(mapState);
    if (typeof newValue === "string") {
      set(mapState, { ...map, location: newValue });
    }
  },
});

export const mapErrorState = selector({
  key: "mapErrorState",
  get: ({ get }) => {
    const map = get(mapState);
    return map.isError;
  },
});
