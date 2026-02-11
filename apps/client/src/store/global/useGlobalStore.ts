import { create } from "zustand";

import type { GlobalStore } from "./useGlobalStore.types";

const globalInitialState = {
    leftDrawer: true,
};

export const useGlobalStore = create<GlobalStore>()((set) => ({
    ...globalInitialState,
    setLeftDrawer: (leftDrawer) => set({ leftDrawer }),
}));
