import config from '../../config.json'
import React, { Component } from 'react'
import './Origins.css'
import ReactMapboxGl, { Layer, Source } from "react-mapbox-gl";
import input from '../../data/origins.json'

// mapbox token
const Map = ReactMapboxGl({
  accessToken: config.MAPBOX_TOKEN
});


class Origins extends Component {
  constructor(props) {
  super(props)
  this.state = {
    geometry: input,
    center: [-122.44, 37.75],
    zoom: [11]
   }
  }

  render() {
    return (
      <div className="marain-map">
      <h2>Origins</h2>
      <Map
        style="mapbox://styles/dmccarey/cjz3cws7e3xr71dqqpv8v2chi" // eslint-disable-line
        center={ this.state.center }
        zoom={ this.state.zoom }
        containerStyle={{
          height: "100vh",
          width: "100%",
        }}>
        <Source
        id="source-origins"
        geoJsonSource={{
          type: "geojson",
          data: this.state.geometry
        }}
        />
        <Layer
        id="layer-origins"
        sourceId="source-origins"
        type="fill"
        paint={{
          'fill-color': '#2589DD',
          'fill-opacity': {
            'property': String(this.props.interval),
            'stops': [
              [0, 0],
              [70, 0.9]
            ]
        },
        'fill-opacity-transition': {duration: 2000}
        }}
        />
        { this.props.playing === false &&
        <Layer
        id="layer-origins-count"
        sourceId="source-origins"
        type="symbol"
        layout={{
          "text-field": `{${String(this.props.interval )}}`,
          "text-size": 11
        }}
        filter={['all', ['!=', String(this.props.interval), 0]]}
        paint={{
          "text-color": "#fff"
        }}
      />
      }
      </Map>
      </div>
    )
  }
}

export default Origins
