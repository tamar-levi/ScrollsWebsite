import { createContext, useContext, useRef } from 'react';

const ScrollContext = createContext();

export function ScrollProvider({ children }) {
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  return (
    <ScrollContext.Provider value={{ aboutRef, contactRef }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  return useContext(ScrollContext);
}
