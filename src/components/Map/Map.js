import React, { Component } from 'react'
import './Map.css'
import { Slider, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { toReadableTime } from 'seconds-since-midnight'
import Origins from '../Origins/Origins.js'
import Dest from '../Destinations/Destinations.js'


class MarainMap extends Component {
  constructor(props) {
  super(props)
   this.state = {
     currentTime: 14400,
     maxSeconds: 96400,
     interval: 900,
     playing: false,
     buttonText: 'Play'
   }
  }

  _onChange(value) {
    this.setState({
      currentTime: value
    })
  }

  _handlePlayback(e) {
    var _self = this
    if (_self.state.playing === true) {
      clearInterval(window.playing)
      _self.setState({
        playing: false,
        buttonText: 'Play'
      })
    } else {
      _self.setState({
        playing: true,
        buttonText: 'Pause'
      })
      window.playing = setInterval(function() {
      if (_self.state.currentTime > (_self.state.maxSeconds-_self.state.interval)) {
        _self.setState({
          currentTime: 0
        })
      } else {
        _self.setState({
          currentTime: _self.state.currentTime + _self.state.interval
        })
      }
    }, 200)
   }
  }

  _setTime(seconds) {
    var time = toReadableTime(seconds)
    if (time.hours === '0') {
      time.hours = '12'
    }
    return `${time.hours}:${time.minutes} ${time.meridian}`
  }

  render() {
    return (
      <div>
        <a className="logo" href="https://www.marain.com/">Marain</a>
        <Origins interval={ this.state.currentTime } playing={ this.state.playing } />
        <Dest interval={ this.state.currentTime } playing={ this.state.playing } />
        <div className="controls">
        <Slider
          defaultValue={30}
          step={this.state.interval}
          max={this.state.maxSeconds}
          min={ 0 }
          value={ this.state.currentTime }
          onChange={ this._onChange.bind(this) }
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
          to="/trips"
        >
        Trajectories
        </Link>
        </div>
        <div className="time">{ this._setTime(this.state.currentTime) }</div>
      </div>
    )
  }

}

export default MarainMap
