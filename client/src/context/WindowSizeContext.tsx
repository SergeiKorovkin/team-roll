import React, { createContext, FC, useContext } from 'react'
import { IUseWindowSize, useWindowSize } from '../hooks/useWindowSize'

export type TUseWindowSizeContextProps = IUseWindowSize;

const WindowSizeContext = createContext<TUseWindowSizeContextProps>({} as TUseWindowSizeContextProps);

export function useWindowSizeContext(): TUseWindowSizeContextProps {
  const context = useContext(WindowSizeContext);

  if (context === undefined) {
    throw new Error('useWindowSizeContext must be used within the WindowSizeContextProvider');
  }

  return context;
}
interface WindowSizeContextProviderProps {
  children: React.ReactNode;
}
export const WindowSizeContextProvider: FC<WindowSizeContextProviderProps>  = ({ children }) => {
  const contextValue = useWindowSize();
  return <WindowSizeContext.Provider value={contextValue}>{children}</WindowSizeContext.Provider>
};
