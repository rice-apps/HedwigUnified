import React from 'react'
import './App.css'
import { RoutesComponent } from './components/Routes'
import Header from './components/Header'

function App () {
  return (
    <React.Fragment>
      <Header />
      <RoutesComponent />
    </React.Fragment>
  )
}

export default App
