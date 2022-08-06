import { createContext } from 'react';

interface Chatcontext {
  selectId: string;
  setSelectId: Function;
}

export default createContext<Chatcontext>({
  selectId: '1',
  setSelectId: () => {},
});
