import React from 'react'
import './landing.css'
import axios from 'axios';
import Chart from "chart.js";
import ReactDOM from 'react-dom'
// Maniana comentar

class App extends React.Component {
  chartRef = React.createRef();

 constructor() {
   super();
   this.handleSubmit = this.handleSubmit.bind(this);
  
 }

 // Cuando se hace submit al formulario guardamos los valores ingresados para poder realizar la request a la API
handleSubmit(event) {
  event.preventDefault();
  const dataxios = new FormData(event.target);
  var xnv = dataxios.get('xvalue')
  var ynv = dataxios.get('yvalue')
  this.setState({xnv}); // XNV = X del New Value, Valor ingresado para clasificar
  this.setState({ynv}); // YNF = Y del New Value, Valor ingresado para clasificar

  //Con Axios realizamos una llamada a la API que nos devuelve los K nearest neighbours 
  axios.get(`https://ia-knn.herokuapp.com/api/ia-knn/v1/calculate?xValue=${dataxios.get('xvalue')}&yValue=${dataxios.get('yvalue')}&kValue=${dataxios.get('kvalue')}`)
  .then(res => {
    const knn = res.data; //Guardamos la respuesta de la API
    const resultknn = [knn.length] //Guardamos K
    this.setState({ resultknn }); //Guardamos la respuesta de la API en el Estado
    this.setState({ knn });//Guardamos K en el Estado
    this.handleMapping(); // Llamamos a la funcion para poder realizar el mapeo de los datos obtenidos con el grafico
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


    // Se crea un arreglo Clase con las clases de los KNN
    // Se crean 2 arreglos, uno con los valores de X y otro con los valores de Y
    // Para poder armar el dataset que se le pasa al grafico.
   for (i = 0; i < this.state.resultknn; i++) { 
    clase.push(this.state.knn[i].result)
    obj = {}
    obj["x"] = this.state.knn[i].xvalue;
    datax.push(this.state.knn[i].xvalue)
    obj["y"] = this.state.knn[i].yvalue;
    datay.push(this.state.knn[i].yvalue)
    data.push(obj)
    
   }
   // Se setean estos valores en el Estado
   this.setState({datax})
   this.setState({datay})
   this.setState({ data });
   this.setState({ clase });
  //  console.log(this.state)


  // Se calcula la media de valores de X e Y de los KNN
   for (i = 0; i < this.state.resultknn; i++) { 
    avgx = avgx+this.state.datax[i]
    avgy = avgy+this.state.datax[i]
   }
   avgx = avgx/this.state.resultknn
   avgy = avgy/this.state.resultknn

   // Se almacenan las medias de ambos valores
   this.setState({avgx})
   this.setState({avgy})
   
   // Se calcula la desviacion estandar
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
   // Se almacenan las Desviaciones Estandar
   this.setState({sx})
   this.setState({sy})

   // Se crean dos arreglos con los datos ya normalizados para poder realizar el grafico
   for (i = 0; i < this.state.resultknn; i++) { 
    dataxn.push((datax[i]-avgx)/sx)
    datayn.push((datay[i]-avgx)/sx)
   }
   // Se almacenan los datos normalizados en el Estado
   this.setState({dataxn});
   this.setState({datayn});


   // Se crea el arreglo dataset con los Objetos de pares X,Y para graficar
   for (i = 0; i < this.state.resultknn; i++) { 
    obj = {}
    obj["x"] = dataxn[i];
    obj["y"] = datayn[i];
    obj["z"] = this.state.knn[i].result;
    datan.push(obj)
   }
   // Se almacena el arreglo con los pares en el Estado
   this.setState({datan});
   

   // Se calcula cual es el Vecino mas cercano entre los K vecinos mas cercanos despues de la normalizacion para realizar la clasificacion.
   for (i = 0; i < this.state.resultknn; i++) { 
    d = (Math.sqrt(Math.pow((this.state.dataxn[i]-this.state.xnv),2)+Math.pow((this.state.datayn[i]-this.state.ynv),2)));
    if (d<dmin){
      dmin = d; //Se resguarda siempre la distancia minima para comparar con la siguiente
      imin = i; //Se resguarda el indice de la distancia para luego hallar la clase de dicho elemento y asignarsela al nuevo valor
    }
   }

   //Clase 1 ==='C2' y Clase 0 === "C1"
  if (this.state.clase[imin]===0){
    nvclase = 'C1'
  }else if(this.state.clase[imin]===1){
    nvclase = 'C2'
  }
  // Se almacenan en el estado la clase del nuevo elemento, la distancia con el Vecino mas cercano y el indice del mismo
  this.setState({nvclase})
  // this.setState({dmin});
  // this.setState({imin});
  console.log(this.state)
   this.handleChart();
 }

 handleChart(){
      const myChartRef = this.chartRef.current.getContext("2d");
      var zvalues = [];
      var i;
      
      // Creamos un arreglo con las clases para mostrarlas en el tooltip del grafico
      for (i = 0; i < this.state.resultknn; i++) { 
        zvalues.push(this.state.datan[i].z)
       }

       // Se muestra la clase del nuevo elemento
      ReactDOM.render(<p className='text-center restext'>La clase del objeto introducido es {this.state.nvclase}</p>, document.getElementById('resultado'));
      
      // Se instancia el grafico con sus respectivos parametros
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
                    return ['x: ' + tooltipItems.xLabel +  ' y: ' + tooltipItems.yLabel + " clase: " + zvalues[tooltipItems.index],];
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