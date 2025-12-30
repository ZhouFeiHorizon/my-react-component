import { createContext, useContext } from "react";

export const EmptyContext = createContext<{
  empty?: React.ReactNode;
  format?: string;
}>({
  empty: "--",
  format: "YYYY-MM-DD HH:mm:ss",
});

export const useEmpty = (empty?: React.ReactNode) => {
  const { empty: defaultEmpty } = useContext(EmptyContext);
  return empty ?? defaultEmpty;
};


// Empty 注入
export const EmptyProvider = EmptyContext.Provider;