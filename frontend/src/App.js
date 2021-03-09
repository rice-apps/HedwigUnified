import './App.css'
import { RoutesComponent } from './components/Routes'
import ErrorBoundary from '../src/components/ErrorBoundary.js'

function App () {
  return (
    <>
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=1.0,
     user-scalable=0'
      />
      <ErrorBoundary>
        <RoutesComponent />
      </ErrorBoundary>
    </>
  )
}

export default App
