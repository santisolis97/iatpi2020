import React from 'react'
import Charts from '../components/Chart.js'
import './landing.css'
import axios from 'axios';


class App extends React.Component {

  componentDidMount() {
    axios.get(`http://localhost:8080/api/ia-knn/v1/all`)
    .then(res => {
      const all = res.data; 
      const result = [all.length]
      this.setState(result);
      console.log(this.state)
    })
  }
  state = {
    valores:[]
  }
constructor() {
  super();
  this.handleSubmit = this.handleSubmit.bind(this);
}

handleSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);



  axios.get(`http://localhost:8080/api/ia-knn/v1/calculate?xValue=${data.get('xvalue')}&yValue=${data.get('yvalue')}&kValue=${data.get('kvalue')}`)
  .then(res => {
    const knn = res.data;
    console.log(knn)
    this.setState({ knn });
  })
}
  render(){ 
  return (
    <div className="landing">
      <div className="row">
          <div className="col algorithm">
            <div>Knn Algorithm</div>
          </div>
          <div className="col form">
            <form onSubmit={this.handleSubmit}>
            <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="xvalue">Enter X Value</label>
                <input className='col-sm-3' id="xvalue" name="xvalue" type="number" />
            </div>
            <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="yvalue">Enter Y Value</label>
                <input className='col-sm-3' id="yvalue" name="yvalue" type="number" />
            </div>
            <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="kvalue">Enter K Value</label>
                <input min="1" className='col-sm-3' id="kvalue" name="kvalue" type="number" />
            </div>
            <div className="form-group row">
                <button type='submit' className='btn btn-primary'>Calculate</button>
            </div>
          
        </form>
          </div>
          
      </div>

      <Charts className='d-none'/>
    </div>
  )
}
}
export default App
