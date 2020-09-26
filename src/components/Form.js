import React from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import "./Form.css";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataset: "",
      radioStatus: true,
      buttonIsDisabled: true,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const dataxios = new FormData(event.target);
    var xnv = dataxios.get("xvalue");
    var ynv = dataxios.get("yvalue");
    this.setState({ xnv }); // XNV = X del New Value, Valor ingresado para clasificar
    this.setState({ ynv }); // YNF = Y del New Value, Valor ingresado para clasificar
    //Con Axios realizamos una llamada a la API que nos devuelve los K nearest neighbours
    axios
      .get(
        `https://ia-knn.herokuapp.com/api/ia-knn/v1/calculate?xValue=${dataxios.get(
          "xvalue"
        )}&yValue=${dataxios.get("yvalue")}&kValue=${dataxios.get("kvalue")}`
      )
      .then((res) => {
        const knn = res.data; //Guardamos la respuesta de la API
        const resultknn = [knn.length]; //Guardamos K
        this.setState({ resultknn }); //Guardamos la respuesta de la API en el Estado
        this.setState({ knn }); //Guardamos K en el Estado
        this.props.onResponse(
          this.state.knn,
          this.state.resultknn,
          this.state.xnv,
          this.state.ynv
        );
        // this.handleMapping(); // Llamamos a la funcion para poder realizar el mapeo de los datos obtenidos con el grafico
      });
  }
  bulkLoad(event) {
    event.preventDefault();
    const databulk = new FormData(event.target);
    if (databulk.get("dataset").length !== 0) {
      console.log(JSON.parse(databulk.get("dataset")));
      axios
        .post(
          "https://ia-knn.herokuapp.com/api/ia-knn/v1/bulk-upload",
          JSON.parse(databulk.get("dataset"))
        )
        .then((res) => {
          ReactDOM.render(
            <div className="alert alert-success" role="alert">
              <p className="text-center">Dataset upload was successful</p>
            </div>,
            document.getElementById("bulkSuccess")
          );
        });
    }
  }

  onRadioChange = (radioStatus) => {
    this.setState({ radioStatus });
    if (this.state.radioStatus) {
      var styleform = { display: "none" };
      var stylebulk = { display: "block" };
      this.setState({ styleform });
      this.setState({ stylebulk });
    } else {
      styleform = { display: "block" };
      stylebulk = { display: "none" };
      this.setState({ styleform });
      this.setState({ stylebulk });
    }
  };
  isValidJson(json) {
    try {
      JSON.parse(json);
    } catch (e) {
      return false;
    }
    return true;
  }
  handleDatasetChange(value) {
    this.setState({
      dataset: value,
    });
    if (this.isValidJson(value) && value.length > 0) {
      this.setState({
        buttonIsDisabled: false,
      });
    } else {
      this.setState({
        buttonIsDisabled: true,
      });
    }
  }

  render() {
    return (
      <div className="col form">
        <div className="radios">
          <input
            type="radio"
            name="release"
            checked={this.state.radioStatus}
            onChange={(e) => this.onRadioChange(true)}
          />{" "}
          <strong className="radio">Classify</strong>
          <input
            type="radio"
            name="release"
            checked={!this.state.radioStatus}
            onChange={(e) => this.onRadioChange(false)}
          />{" "}
          <strong className="radio">Upload dataset</strong> <br />
        </div>

        <form
          className="formulario"
          style={this.state.styleform}
          onSubmit={this.handleSubmit}
        >
          <div className="form-group row">
            <label className="col-sm-2 col-form-label" htmlFor="xvalue">
              Enter X Value
            </label>
            <input
              className="col-sm-3"
              id="xvalue"
              name="xvalue"
              step="0.0001"
              type="number"
            />
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label" htmlFor="yvalue">
              Enter Y Value
            </label>
            <input
              className="col-sm-3"
              id="yvalue"
              name="yvalue"
              step="0.0001"
              type="number"
            />
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label" htmlFor="kvalue">
              Enter K Value
            </label>
            <input
              min="1"
              className="col-sm-3"
              id="kvalue"
              name="kvalue"
              type="number"
            />
          </div>
          <div className="form-group row">
            <button type="submit" className="btn btn-primary">
              Classify
            </button>
          </div>
        </form>

        <form
          className="bulk"
          style={this.state.stylebulk}
          onSubmit={this.bulkLoad}
        >
          <div className="form-group row">
            <label className="col-sm-2 col-form-label" htmlFor="dataset">
              Enter dataset
            </label>
            <textarea
              type="text"
              onChange={(e) => this.handleDatasetChange(e.target.value)}
              value={this.state.dataset}
              rows="18"
              className="col-sm-3"
              id="dataset"
              name="dataset"
            />
          </div>
          <div className="form-group row">
            <TooltipComponent
              position="BottomCenter"
              cssClass="customtooltip"
              className="tooltip-box"
              opensOn="Hover"
              id="box"
              content="Put some valid dataset"
            >
              <button
                data-tip
                data-for="registerTip"
                disabled={this.state.buttonIsDisabled}
                type="submit"
                className="btn bulkbtn btn-primary"
              >
                Load dataset
              </button>
            </TooltipComponent>
          </div>
          <div className="bulkSuccess" id="bulkSuccess"></div>
        </form>
      </div>
    );
  }
}
