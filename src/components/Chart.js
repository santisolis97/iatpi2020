import React, { Component } from 'react'
import Chart from "chart.js";

export default class Charts extends Component {
    



    chartRef = React.createRef();
    
    componentDidMount() {
        console.log(this.props)
        const myChartRef = this.chartRef.current.getContext("2d");
        
        new Chart(myChartRef, {
            type: "scatter",
            data: {

                labels: ["Jan", "Feb", "March"],
                datasets: [
                    {
                        label: "KNN",
                        data: [86, 67, 91],
                    }
                ]
            },
            options: {
                //Customize chart options
            }
        });
    }
    render() {
        return (
            <div >
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}
