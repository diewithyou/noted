export type GlobalState = {
    leftDrawer: boolean;
};

export type GlobalActions = {
    setLeftDrawer: (leftDrawer: boolean) => void;
};

export type GlobalStore = GlobalState & GlobalActions;
