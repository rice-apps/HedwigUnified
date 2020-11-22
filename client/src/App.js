import React from 'react';

import './App.css'
import { RoutesComponent } from './components/Routes'
import Header from './components/Header'
import { faWindowRestore } from '@fortawesome/free-solid-svg-icons'

function App() {
  return (
    <>
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=1.0,
     user-scalable=0'
      />
      {/* <Header /> */}
      <RoutesComponent />
    </>
  )
}

export default App
