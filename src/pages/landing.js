import React from 'react'
import './landing.css'
import axios from 'axios';
import Chart from "chart.js";
import ReactDOM from 'react-dom'

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
  const dataxios = new FormData(event.target);
  var xnv = dataxios.get('xvalue')
  var ynv = dataxios.get('yvalue')
  this.setState({xnv});
  this.setState({ynv});


  axios.get(`https://ia-knn.herokuapp.com/api/ia-knn/v1/calculate?xValue=${dataxios.get('xvalue')}&yValue=${dataxios.get('yvalue')}&kValue=${dataxios.get('kvalue')}`)
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
   var data = [];
   var datax = [];
   var datay = [];
   var sqrdevx = [];
   var sqrdevy = [];
   var avgx = 0;
   var avgy = 0;
   var sx = 0;
   var sy = 0;
   var dataxn = [];
   var datayn = [];
   var datan = [];
   var d = 0;
   var dmin = 99999999999;
   var imin;
   var clase = [];
   var nvclase;
  //  console.log(this.state.resultknn)
   for (i = 0; i < this.state.resultknn; i++) { 
    clase.push(this.state.knn[i].result)
    obj = {}
    obj["x"] = this.state.knn[i].xvalue;
    datax.push(this.state.knn[i].xvalue)
    obj["y"] = this.state.knn[i].yvalue;
    datay.push(this.state.knn[i].yvalue)
    data.push(obj)
    
   }

   this.setState({datax})
   this.setState({datay})
   this.setState({ data });
   this.setState({ clase });
   console.log(this.state)

   for (i = 0; i < this.state.resultknn; i++) { 
    avgx = avgx+this.state.datax[i]
    avgy = avgy+this.state.datax[i]
   }
   avgx = avgx/this.state.resultknn
   avgy = avgy/this.state.resultknn
   this.setState({avgx})
   this.setState({avgy})

   for (i = 0; i < this.state.resultknn; i++) { 
    sqrdevx.push(Math.pow((datax[i]-avgx), 2));
    sqrdevy.push(Math.pow((datay[i]-avgx), 2));
   }
   for (i = 0; i < sqrdevx.length; i++) { 
    sx=sx+sqrdevx[i];
    sy=sy+sqrdevy[i];
   }
   sx = sx / this.state.resultknn;
   sy = sy / this.state.resultknn;
   sx = Math.sqrt(sx);
   sy = Math.sqrt(sy);
   this.setState({sx})
   this.setState({sy})
   for (i = 0; i < this.state.resultknn; i++) { 
    dataxn.push((datax[i]-avgx)/sx)
    datayn.push((datay[i]-avgx)/sx)
   }
   this.setState({dataxn});
   this.setState({datayn});



   console.log(dataxn, datayn)
   for (i = 0; i < this.state.resultknn; i++) { 
    obj = {}
    obj["x"] = dataxn[i];
    obj["y"] = datayn[i];
    obj["z"] = this.state.knn[i].result;
    datan.push(obj)
   }
   this.setState({datan});
   
   for (i = 0; i < this.state.resultknn; i++) { 
    d = (Math.sqrt(Math.pow((this.state.dataxn[i]-this.state.xnv),2)+Math.pow((this.state.datayn[i]-this.state.ynv),2)));
    if (d<dmin){
      dmin = d;
      imin = i;
    }
    
    
   }
  if (this.state.clase[imin]===0){
    nvclase = 'C1'
  }else if(this.state.clase[imin]===1){
    nvclase = 'C2'
  }
  this.setState({nvclase})
  this.setState({dmin});
  this.setState({imin});
  console.log(this.state)
   this.handleChart();
 }

 handleChart(){
      const myChartRef = this.chartRef.current.getContext("2d");
      var zvalues = [];
      var realxvalues = [];
      var realyvalues = [];
      var i;
      
      for (i = 0; i < this.state.resultknn; i++) { 
        zvalues.push(this.state.datan[i].z)
        realxvalues.push(this.state.datax[i])
        realyvalues.push(this.state.datay[i])

       }
      ReactDOM.render(<p className='text-center restext'>La clase del objeto introducido es {this.state.nvclase}</p>, document.getElementById('resultado'));
      new Chart(myChartRef, {
        type: 'scatter',
        data: {
            datasets: [
              {
                label: 'KNNs',
                data: this.state.datan,
                pointBackgroundColor: 'blue',
                pointRadius: 10,
                backgroundColor: "blue"

            },
             {
               label: 'New value',
               data: [{
                 x: (this.state.xnv-this.state.avgx)/this.state.sx,
                 y: (this.state.ynv-this.state.avgy)/this.state.sy
             }
             
           ],
           pointBackgroundColor: 'orange',
           pointRadius: 10,
           backgroundColor: "orange"
           },
           
          ]
        },
        options: {
            tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function(tooltipItems, data) { 
                    return [' x: ' + tooltipItems.xLabel +  ' y: ' + tooltipItems.yLabel + " clase: " + zvalues[tooltipItems.index],];
                    }
                }
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            }
        }
    });
  
}
  render(){ 
  return (
    <div className="landing">
      <div className="row static">
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
      <div className="row dynamic">
        <div className="col">
          <div className="resultado" id='resultado'></div>
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