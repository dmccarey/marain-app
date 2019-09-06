import config from '../../config.json'
import React, { Component } from 'react';
import {StaticMap} from 'react-map-gl'
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core'
import DeckGL from '@deck.gl/react'
import {TripsLayer} from '@deck.gl/geo-layers'
import {IconLayer} from '@deck.gl/layers'
//import CountUp from 'react-countup'
import axios from 'axios'
import {Link} from 'react-router-dom'
import {Icon, Slider, Spin} from 'antd'
import Chart from '../Chart/Chart'
import './Trips.css'
import { toReadableTime } from 'seconds-since-midnight'
import kpi from '../../data/kpis.json'
import chargers from '../../data/chargers.json'
import idle from '../../data/idle.json'
import power from '../../data/power.json'



const MAPBOX_TOKEN = config.MAPBOX_TOKEN; // eslint-disable-line

// Source data CSV
const DATA_URL = {
 KPI: kpi,
 CHARGERS: chargers,
 IDLE: idle
}

const ambientLight = new AmbientLight({
color: [255, 255, 255],
intensity: 1.0
})

const pointLight = new PointLight({
color: [255, 255, 255],
intensity: 2.0,
position: [-74.05, 40.7, 8000]
})

const lightingEffect = new LightingEffect({ambientLight, pointLight});

const INITIAL_VIEW_STATE = {
longitude: -122.44,
latitude: 37.75,
zoom: 12,
pitch: 0,
bearing: 0
}

const ICON_CHARGER = {
  marker: {x: 0, y: 0, width: 128, height: 128, mask: false}
}
const ICON_IDLE = {
  marker: {x: 0, y: 0, width: 142, height: 142, mask: false}
}

/*
const powerData = power.map(row =>
  row.chargingStationPowerKW
)
*/

const powerData1 = power.map(row =>
  row.charger_1_chargingStationPowerKW
)

const powerData2 = power.map(row =>
  row.charger_2_chargingStationPowerKW
)

class TripsMap extends Component {
  constructor(props) {
  super(props)
  this.state = {
    time: 19000,
    trajectories: [],
    maxSeconds: 96400,
    idle: [idle[0]],
    playing: false,
    trailLength: 400,
    trailOpacity: 0.4,
    trailWidth: 3,
    playbackSpeed: 20,
    powerUsed: [],
    powerDraw: [],
    powerCounter: 0,
    loading: true,
    kpi: {
      refueling: 0
    },
    power: {
      chargingStationPowerKW: 0
    }
  }
 }

 componentDidMount() {
   var _self = this

   var height = document.getElementById('kpis').offsetHeight /2.4
   this.setState({
     chartHeight: height
   })

    axios.get('/data/trajectories.json')
    .then(function(response) {
      //console.log(response)
      _self.setState({
        trajectories: response.data,
        loading: false
      })
    })
 }

  componentWillUnmount() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  _animate() {
    console.log('animate...')
    var time = this.state.time
    time = time + this.state.playbackSpeed
    if (time > 87000) {
      time = 19000
    }
    var idleVehicles = idle.filter(row => row.idleStart < this.state.time && row.idleEnd > this.state.time)
    var currentKpis = kpi.filter(row => row.time < this.state.time).reverse()
    var currentKpi = currentKpis[0]
    var previousKpi = currentKpis[1]
    var powerUsed = power.filter(row => row.time < this.state.time).reverse()
    var currentPower = powerUsed[0]

    this.setState({
      time: time,
      idle: idleVehicles,
      idleCount: idleVehicles.length,
      kpi: currentKpi,
      previousKpi: previousKpi,
      power: currentPower,
      playing: true
    })

    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this))
  }


  _renderLayers() {
    const { trips = this.state.trajectories, trailLength = this.state.trailLength } = this.props;
    const { chargers = DATA_URL.CHARGERS } = this.props;
    const { idleVehicles = this.state.idle } = this.props;

    return [
      new IconLayer({
        id: 'idle-layer',
        data: idleVehicles,
        pickable: true,
        iconAtlas: '/assets/idle.png',
        iconMapping: ICON_IDLE,
        billboard: false,
        getIcon: d => 'marker',
        sizeUnits: 'meters',
        sizeScale: 10,
        getPosition: d => [d.xCoordinate, d.yCoordinate],
        getSize: d => 20,
        getColor: d => [255, 282, 51],
      }),
      new IconLayer({
        id: 'icon-layer',
        data: chargers,
        pickable: true,
        iconAtlas: '/assets/charger.png',
        iconMapping: ICON_CHARGER,
        billboard: false,
        getIcon: d => 'marker',
        sizeUnits: 'meters',
        sizeScale: 5,
        getPosition: d => [d.xCoordinate, d.yCoordinate],
        getSize: d => 60,
        getColor: d => [255, 282, 51]
      }),
      new TripsLayer({
        id: 'trips',
        data: trips,
        getPath: d => this._getPath(d),
        getTimestamps: d => d.vehicleStates.map(p => p.time),
        getColor: d => this._setColor(d.movementType),
        opacity: this.state.trailOpacity,
        widthMinPixels: this.state.trailWidth,
        rounded: true,
        trailLength,
        currentTime: this.state.time
      })
    ];
  }

  _getPowerDraw1() {
    var array = power.map(item => {
      if (item.time < this.state.time) {
        return item.charger_1_chargingStationPowerKW
      } else {
        return false
      }
    })
    return array
  }

  _getPowerDraw2() {
    var array = power.map(item => {
      if (item.time < this.state.time) {
        return item.charger_2_chargingStationPowerKW
      } else {
        return false
      }
     })
    return array
  }

  _setColor(p) {
      if (p === 'DrivingPassenger') {
        return [255, 182, 51]
      }
      if (p === 'DrivingToPickup') {
        return [37, 137, 221]
      }
      if (p === 'DrivingToRefuel') {
        return [221, 37, 99]
      }
      if (p === 'Idle') {
        return [255, 255, 255]
      }
  }

  _getPath(d) {
    return d.vehicleStates.map(p => [p.xCoordinate, p.yCoordinate])
  }

  _setTime(seconds) {
    var time = toReadableTime(seconds)
    if (time.hours === '0') {
      time.hours = '12'
    }
    return `${time.hours}:${time.minutes} ${time.meridian}`
  }

  _handlePlayback(e) {
    if (this.state.playing) {
      window.cancelAnimationFrame(this._animationFrame);
      this.setState({
        playing: false
      })
    } else {
      this._animate()
    }
  }

  _onChange(value) {
    this.setState({
      time: value
    })
  }

  _handleTrailLength(value) {
    this.setState({
      trailLength: value
    })
  }

  _handleTrailOpacity(value) {
    this.setState({
      trailOpacity: value
    })
  }

  _handleTrailWidth(value) {
    this.setState({
      trailWidth: value
    })
  }

  _handlePlaybackSpeed(value) {
    this.setState({
      playbackSpeed: value
    })
  }

  _getChartHeight() {
    var height = 400
    return height
  }

  render() {
    // eslint-disable-line
    const {viewState, mapStyle = 'mapbox://styles/dmccarey/cjz3cws7e3xr71dqqpv8v2chi'} = this.props;


    return (
      <div>
      { this.state.loading &&
        <div className="loading">
         <div className="loader">
          <Spin size="large" />
         </div>
        </div>
      }
      <a className="logo" href="https://www.marain.com/">Marain</a>
      <div className="map">
      <DeckGL
        layers={this._renderLayers()}
        effects={[lightingEffect]}
        initialViewState={INITIAL_VIEW_STATE}
        viewState={viewState}
        controller={true}
      >
        <StaticMap
          reuseMaps
          mapStyle={mapStyle}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
      </DeckGL>
      </div>

      <div className="kpi" id="kpis">
          <Chart
            height={ this.state.chartHeight }
            allData={ powerData1 }
            liveData={ this._getPowerDraw1() }
          />
          <Chart
            height={ this.state.chartHeight }
            allData={ powerData2 }
            liveData={ this._getPowerDraw2() }
          />
      </div>

      {/* @todo: move to controls component */}
      <div className="controls">
          <Slider
            defaultValue={30}
            step={this.state.interval}
            max={this.state.maxSeconds}
            min={ 0 }
            onChange={ this._onChange.bind(this) }
            value={this.state.time}
            tipFormatter={ this._setTime }
          />
          <button
            className="btn-play"
            onClick={ this._handlePlayback.bind(this) }
          >
          { this.state.playing ? (
            <Icon type="pause" />
          ) : (
            <Icon type="caret-right" />
          )}
          </button>
          <Link
            className="btn-layer"
            to="/origin-dest"
          >
          Origin & Destinations
          </Link>
          <div className="advanced">
          <h3>Trail Length</h3>
          <Slider
            step={ 10 }
            max={ 10000 }
            min={ 0 }
            onChange={ this._handleTrailLength.bind(this) }
            value={this.state.trailLength}
          />
          <h3>Trail Opacity</h3>
          <Slider
            step={ 0.001 }
            max={ 1 }
            min={ 0.005 }
            onChange={ this._handleTrailOpacity.bind(this) }
            value={this.state.trailOpacity}
          />
          <h3>Trail Width</h3>
          <Slider
            step={ 0.5 }
            max={ 10 }
            min={ 0.5 }
            onChange={ this._handleTrailWidth.bind(this) }
            value={this.state.trailWidth}
          />
          <h3>Playback Speed</h3>
          <Slider
            step={ 1 }
            max={ 100 }
            min={ 1 }
            onChange={ this._handlePlaybackSpeed.bind(this) }
            value={this.state.playbackSpeed}
          />
          </div>
          </div>

       <div className="time">{ this._setTime(this.state.time) }</div>
      </div>
    )
  }

}

/*
"origins": 163,
"destinations": 167,
"DrivingPassenger": 12.878888888888888,
"DrivingToPickup": 7.6688888888888895,
"DrivingToReposition": 0,
"DrivingToRefuel": 9.298888888888891,
"Refueling": 15.076666666666663,
"Idle": 5.076666666666671,
"Utilization": 0.8984666666666666,
"VTTR": 0.28668595879399467,
"inquiredRides": 93,
"quotedRides": 29,
"servicedRides": 18,
"quotingRate": 0.3118279569892473,
"bookingRate":
*/

export default TripsMap
