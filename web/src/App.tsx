import React from 'react';
import Routes from './routes';

import './assets/styles/globals.css'
import Provider from './components/tools/Provider';

function App() {
  return (
    <Provider>
      <Routes/>
    </Provider>
  );
}

export default App;
