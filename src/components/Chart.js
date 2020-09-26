import React from "react";
import ReactDOM from "react-dom";
import Chart from "chart.js";
import "./Chart.css";

export default class Charts extends React.Component {
  chartRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      datan: {},
    };
  }
  componentDidMount(props) {
    this.handleMapping(props);
  }
  handleMapping(props) {
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
    for (i = 0; i < this.props.resultknn; i++) {
      clase.push(this.props.knn[i].result);
      obj = {};
      obj["x"] = this.props.knn[i].xvalue;
      datax.push(this.props.knn[i].xvalue);
      obj["y"] = this.props.knn[i].yvalue;
      datay.push(this.props.knn[i].yvalue);
      data.push(obj);
    }

    // Se calcula la media de valores de X e Y de los KNN
    for (i = 0; i < this.props.resultknn; i++) {
      avgx = avgx + datax[i];
      avgy = avgy + datay[i];
    }
    avgx = avgx / this.props.resultknn;
    avgy = avgy / this.props.resultknn;

    // Se calcula la desviacion estandar
    for (i = 0; i < this.props.resultknn; i++) {
      sqrdevx.push(Math.pow(datax[i] - avgx, 2));
      sqrdevy.push(Math.pow(datay[i] - avgx, 2));
    }
    for (i = 0; i < sqrdevx.length; i++) {
      sx = sx + sqrdevx[i];
      sy = sy + sqrdevy[i];
    }
    sx = sx / this.props.resultknn;
    sy = sy / this.props.resultknn;
    sx = Math.sqrt(sx);
    sy = Math.sqrt(sy);

    // Se crean dos arreglos con los datos ya normalizados para poder realizar el grafico
    for (i = 0; i < this.props.resultknn; i++) {
      dataxn.push((datax[i] - avgx) / sx);
      datayn.push((datay[i] - avgx) / sx);
    }

    // Se crea el arreglo dataset con los Objetos de pares X,Y para graficar
    for (i = 0; i < this.props.resultknn; i++) {
      obj = {};
      obj["x"] = dataxn[i];
      obj["y"] = datayn[i];
      obj["z"] = this.props.knn[i].result;
      datan.push(obj);
    }

    // Se calcula cual es el Vecino mas cercano entre los K vecinos mas cercanos despues de la normalizacion para realizar la clasificacion.
    for (i = 0; i < this.props.resultknn; i++) {
      d = Math.sqrt(
        Math.pow(dataxn[i] - this.props.xnv, 2) +
          Math.pow(datayn[i] - this.props.ynv, 2)
      );
      if (d < dmin) {
        dmin = d; //Se resguarda siempre la distancia minima para comparar con la siguiente
        imin = i; //Se resguarda el indice de la distancia para luego hallar la clase de dicho elemento y asignarsela al nuevo valor
      }
    }

    //Clase 1 ==='C2' y Clase 0 === "C1"
    if (clase[imin] === 0) {
      nvclase = "C1";
    } else if (clase[imin] === 1) {
      nvclase = "C2";
    }
    // Se almacenan en el estado la clase del nuevo elemento, la distancia con el Vecino mas cercano y el indice del mismo
    this.setState({ nvclase });
    console.log("se seteo esto: " + this.state.nvclase);

    this.handleChart(
      datan,
      nvclase,
      this.props.xnv,
      avgx,
      sx,
      this.props.ynv,
      avgy,
      sy
    );
  }

  handleChart(datan, nvclase, xnv, avgx, sx, ynv, avgy, sy) {
    const myChartRef = this.chartRef.current.getContext("2d");
    var zvalues = [];
    var i;

    // Creamos un arreglo con las clases para mostrarlas en el tooltip del grafico
    for (i = 0; i < this.props.resultknn; i++) {
      zvalues.push(datan[i].z);
    }

    // Se muestra la clase del nuevo elemento
    ReactDOM.render(
      <div className="gris">
        <p className="text-center restext">
          La clase del objeto introducido es {nvclase}
        </p>
      </div>,
      document.getElementById("resultado")
    );
    document.getElementById("myChart").classList.add("canvas");
    // Se instancia el grafico con sus respectivos parametros
    new Chart(myChartRef, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "KNNs",
            data: datan,
            pointBackgroundColor: "blue",
            pointRadius: 10,
            backgroundColor: "blue",
          },
          {
            label: "New value",
            data: [
              {
                x: (xnv - avgx) / sx,
                y: (ynv - avgy) / sy,
              },
            ],
            pointBackgroundColor: "orange",
            pointRadius: 10,
            backgroundColor: "orange",
          },
        ],
      },
      options: {
        tooltips: {
          enabled: true,
          mode: "single",
          callbacks: {
            label: function (tooltipItems, data) {
              return [
                "x: " +
                  tooltipItems.xLabel +
                  " y: " +
                  tooltipItems.yLabel +
                  " clase: " +
                  zvalues[tooltipItems.index],
              ];
            },
          },
        },
        scales: {
          xAxes: [
            {
              type: "linear",
              position: "bottom",
            },
          ],
        },
      },
    });
  }
  render() {
    return (
      <div className="grafico">
        <div className="resultado" id="resultado"></div>
        <canvas id="myChart" ref={this.chartRef} />
      </div>
    );
  }
}
