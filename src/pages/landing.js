import React from "react";
import "./landing.css";
import Charts from "../components/Chart";
import ReactDOM from "react-dom";
import Form from "../components/Form";

// Maniana comentar

class App extends React.Component {
  chartRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      dataset: "",
      radioStatus: true,
    };
  }

  handleResponse = (knn, resultknn, xnv, ynv) => {
    // this.setState({ knn });
    // this.setState({ resultknn });
    console.log(this.state);
    ReactDOM.render(
      <Charts knn={knn} resultknn={resultknn} xnv={xnv} ynv={ynv}></Charts>,
      document.getElementById("grafico")
    );
  };
  // Cuando se hace submit al formulario guardamos los valores ingresados para poder realizar la request a la API

  render() {
    // const radioStatus  = this.state.radioStatus;
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
            <p>Integrantes</p>
            <ul className="nombres">
              <li>Cardozo, Edgar</li>
              <li>Fiz, Alan</li>
              <li>Salica, Paula</li>
              <li>Solis, Santiago</li>
            </ul>
          </div>
        </div>
        <div id="grafico"></div>
      </div>
    );
  }
}

export default App;
