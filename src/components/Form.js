import React from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import bulkExample from "../bulkExample.json";
import "./Form.css";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    // Inicializamos el State
    this.state = {
      dataset: JSON.stringify(bulkExample),
      radioStatus: true,
      buttonIsDisabled: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleDelete() {
    axios
      .delete("https://ia-knn.herokuapp.com/api/ia-knn/v1/data/delete")
      .then(alert("Deleted successfuly"));
  }

  handleSubmit(event) {
    // Se ejecuta al hacer submit al formulario de clasificacion.
    // Realiza la request a la API para obtener los KNN
    event.preventDefault();
    const dataxios = new FormData(event.target);
    var xnv = dataxios.get("xvalue");
    var ynv = dataxios.get("yvalue");
    this.setState({ xnv }); // XNV = X del New Value, Valor ingresado para clasificar
    this.setState({ ynv }); // YNF = Y del New Value, Valor ingresado para clasificar
    //Con Axios realizamos una llamada a la API que nos devuelve los K nearest neighbours
    axios
      .get(
        `https://ia-knn.herokuapp.com/api/ia-knn/v1/knn/calculate?xValue=${dataxios.get(
          "xvalue"
        )}&yValue=${dataxios.get("yvalue")}&kValue=${dataxios.get("kvalue")}`
      )
      .then((res) => {
        const knn = res.data; //Guardamos la respuesta de la API
        const resultknn = [knn.length]; //Guardamos K

        // Devolvemos los valores al padre (landing)
        this.props.onResponse(knn, resultknn, xnv, ynv);
        // this.handleMapping(); // Llamamos a la funcion para poder realizar el mapeo de los datos obtenidos con el grafico
      })
      .catch(() => {
        alert("The database is empty");
      });
  }
  bulkLoad(event) {
    // Se ejecuta cuando se hace submit en el formulario de upload dataset
    //Se realiza un POST a la API con los datos ingresados en el form.
    event.preventDefault();
    const databulk = new FormData(event.target);
    if (databulk.get("dataset").length !== 0) {
      console.log(JSON.parse(databulk.get("dataset")));
      axios
        .post(
          "https://ia-knn.herokuapp.com/api/ia-knn/v1/data/bulk-upload",
          JSON.parse(databulk.get("dataset"))
        )
        .then((res) => {
          ReactDOM.render(
            <div
              className="alert alert-success"
              role="alert"
              id="success-alert"
            >
              <p className="text-center">Dataset upload was successful</p>
            </div>,
            document.getElementById("bulkSuccess")
          );
          setTimeout(function () {
            document.getElementById("success-alert").style.display = "none";
          }, 3000);
        });
    }
  }

  onRadioChange = (radioStatus) => {
    //Con esto podemos elegir si queremos el layout de carga o de clasificacion
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
    //Esta funcion valida el json del formulario de carga.
    try {
      JSON.parse(json);
    } catch (e) {
      return false;
    }
    return true;
  }
  handleDatasetChange(value) {
    //Con esta funcion activamos y desactivamos el boton de carga corroborando si los datos estan o no correctos
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
            <button type="submit" className="btn classifybtn btn-primary">
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
              placeholder="Insert a valid JSON dataset"
              rows="18"
              className="col-sm-3"
              id="dataset"
              name="dataset"
            />
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-3">
                <button
                  data-tip
                  data-for="registerTip"
                  disabled={this.state.buttonIsDisabled}
                  type="submit"
                  className="btn bulkbtn btn-success"
                >
                  Load dataset
                </button>{" "}
              </div>
              <div className="col-2">
                <TooltipComponent
                  position="BottomCenter"
                  cssClass="customtooltip"
                  className="tooltip-box"
                  opensOn="Hover"
                  id="box"
                  content="Delete all registers"
                >
                  <button
                    onClick={this.handleDelete}
                    type="button"
                    className="btn deletebtn btn-danger"
                  >
                    Delete database
                  </button>
                </TooltipComponent>
              </div>
            </div>
          </div>
          <div className="bulkSuccess" id="bulkSuccess"></div>
        </form>
      </div>
    );
  }
}
