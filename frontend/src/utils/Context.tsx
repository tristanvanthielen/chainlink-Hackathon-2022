import { createContext } from 'react';

interface IMetamaskAccountContextData {
    metamaskAccount: any|undefined
    setMetamaskAccount: any|undefined
}


export const MetamaskAccountContext = createContext<IMetamaskAccountContextData>({
    metamaskAccount: undefined,
    setMetamaskAccount: undefined
});
