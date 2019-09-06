import config from '../../config.json'
import React, { Component } from 'react'
import './Destinations.css'
import ReactMapboxGl, { Layer, Source } from "react-mapbox-gl";
import input from '../../data/destinations.json'

// mapbox token
const Map = ReactMapboxGl({
  accessToken: config.MAPBOX_TOKEN
});

class Dest extends Component {
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
      <div className="marain-map marain-map-dest">
      <h2>Destinations</h2>
      <Map
        style="mapbox://styles/dmccarey/cjz3cws7e3xr71dqqpv8v2chi"  // eslint-disable-line
        center={ this.state.center }
        zoom={ this.state.zoom }
        containerStyle={{
          height: "100vh",
          width: "100%",
        }}>
        <Source
        id="source-dest"
        geoJsonSource={{
          type: "geojson",
          data: this.state.geometry
        }}
        />
        <Layer
        id="layer-dest"
        sourceId="source-dest"
        type="fill"
        paint={{
          'fill-color': '#FFB633',
          'fill-opacity': {
            'property': String(this.props.interval),
            'stops': [
              [0, 0],
              [70, 0.9]
            ]
          },
        }}
        />
        { this.props.playing === false &&
        <Layer
        id="layer-dest-count"
        sourceId="source-dest"
        type="symbol"
        layout={{
          "text-field": `{${String(this.props.interval)}}`,
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

export default Dest
