import * as React from 'react';
import { MetamaskAccountContext } from './utils/Context';

export default function App() {
  const {metamaskAccount, setMetamaskAccount} = React.useContext(MetamaskAccountContext);

  return (
    <div>
      <h1>Anvil</h1>
      <h1>{metamaskAccount}</h1>
    </div>
  );
}