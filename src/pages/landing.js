import React from 'react'
import './landing.css'
import axios from 'axios';
import Chart from "chart.js";


class App extends React.Component {
  chartRef = React.createRef();
    
    
  
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
    const resultknn = [knn.length]
    this.setState({ resultknn });
    this.setState({ knn });
    // console.log(this.state)
    this.handleMapping();
  })

}
handleMapping(){
   var i;
   var obj = {};
   var data = []
  //  console.log(this.state.resultknn)
   for (i = 0; i < this.state.resultknn; i++) { 
    obj = {}
    obj["x"] = this.state.knn[i].xvalue;
    obj["y"] = this.state.knn[i].yvalue;
    data.push(obj)
    console.log(obj)
   }
  //  console.log(data)
   this.setState({ data });
   console.log(this.state)
   this.handleChart();
 }

 handleChart(){
      const myChartRef = this.chartRef.current.getContext("2d");
      
      new Chart(myChartRef, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Scatter Dataset',
                data: this.state.data
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            }
        }
    });
  axios.get(`http://localhost:8080/api/ia-knn/v1/all`)
  .then(res => {
    const all = res.data; 
    const result = [all.length]
    this.setState({result});
    // console.log(all)
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

      <div >
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
    </div>
  )
}
}
export default App