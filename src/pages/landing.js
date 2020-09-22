import React from 'react'
import Chart from '../components/Chart.js'
import './landing.css'
import Form from '../components/Form'

function App() {
  return (
    <div className="App">
      <div className="row">
          <div className="col">
            <h1>Knn Algorithm</h1>
          </div>
          <div className="col">
            <Form></Form>
          </div>
      </div>
      <Chart className='d-none'/>
    </div>
  )
}

export default App
