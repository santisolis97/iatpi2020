import React from "react";
import "./landing.css";
import Charts from "../components/Chart";
import Form from "../components/Form";

class App extends React.Component {
  chartRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      dataset: "",
      radioStatus: true,
    };
    this.child = React.createRef();
  }

  handleResponse = (knn, resultknn, xnv, ynv) => {
    // Se ejecuta luego del response del Form
    // Llamamos al metodo handleMapping del componente Charts
    this.child.current.handleMapping(knn, resultknn, xnv, ynv);
    // Hace visible el grafico.
    document.getElementById("grafico").style.display = "block";
  };

  render() {
    return (
      <div className="landing">
        <div className="row static">
          <div className="col algorithm">
            <div>Knn Algorithm</div>
          </div>
          <Form onResponse={this.handleResponse}></Form>
        </div>
        <div className="row dynamic">
          <div className="col-5 integrantes">
            <p>Group members:</p>
            <ul className="nombres">
              <li>Cardozo, Edgar</li>
              <li>Fiz, Alan</li>
              <li>Salica, Paula</li>
              <li>Solis, Santiago</li>
            </ul>
          </div>
        </div>
        <div id="grafico">
          <Charts ref={this.child}></Charts>
        </div>
      </div>
    );
  }
}

export default App;
