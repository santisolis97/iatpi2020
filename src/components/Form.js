import React from 'react'
import axios from 'axios';
import './Form.css'

export default class MyForm extends React.Component {
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
        const persons = res.data;
        console.log(persons)
        this.setState({ persons });
      })
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
            <div className="form-group row">
                <label className="col-sm-4 col-form-label" htmlFor="xvalue">Enter X Value</label>
                <input id="xvalue" name="xvalue" type="number" />
            </div>
            <div className="form-group row">
                <label className="col-sm-4 col-form-label" htmlFor="yvalue">Enter Y Value</label>
                <input id="yvalue" name="yvalue" type="number" />
            </div>
            <div className="form-group row">
                <label className="col-sm-4 col-form-label" htmlFor="kvalue">Enter K Value</label>
                <input id="kvalue" name="kvalue" type="number" />
            </div>
          <button className='btn btn-primary'>Send data!</button>
        </form>
      );
    }
  }