import React, { useContext } from "react";
import { RootStore } from "./RootStore";

interface RootStateProviderProps {
  children: React.ReactNode;
}

const RootStoreContext = React.createContext<RootStore>(new RootStore());

export const RootStateProvider: React.FC<RootStateProviderProps> = ({
  children,
}) => {
  return (
    <RootStoreContext.Provider value={new RootStore()}>
      {children}
    </RootStoreContext.Provider>
  );
};

export const useRootStore = () => useContext(RootStoreContext);
