import React form 'react'
import { Slider } from 'antd'
import { Link } from 'react-router-dom'

function Controls(props) {
  return(
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
  )
}

export default Controls
