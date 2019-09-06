import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

function Chart(props) {
  console.log(props)
  return(
    <div className="chart">
    <h2>Chart title</h2>
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        title: {
          text: ''
        },
        chart: {
          type: 'area',
          animation: false,
          style: {
            fontFamily: "Arial"
          },
          backgroundColor: 'transparent',
          height: props.height -40
        },
        legend: {
          enabled: false
        },
        yAxis: {
          title: {
            text: "KW"
          },
          min: 0,
          max: 1500,
          gridLineColor: '#444'
        },
        xAxis: {
          lineColor: '#444',
          tickColor: '#444'
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          line: {
            lineWidth: 3
          },
          series: {
            animation: false,
            enableMouseTracking: false
          }
        },
        series: [{
          color: '#555',
          marker: false,
          data: props.allData
        },{
          color: '#DD2563',
          marker: false,
          data: props.liveData
        }]
      }}
    />
    </div>
  )
}

export default Chart
