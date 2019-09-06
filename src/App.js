import React from 'react'
import './App.css';
import 'antd/dist/antd.css'
import OriginDest from './components/Map/Map.js'
import Trips from './components/Trips/Trips.js'

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'


function App() {
  return (
     <Router>
       <div>
         <Route exact path="/" component={OriginDest} />
         <Route exact path="/origin-dest" component={OriginDest} />
         <Route exact path="/trips" component={Trips} />
       </div>
     </Router>
   )
}

export default App
