{ this.state.power.chargingStationPowerKW.toFixed(2) }KW<br/>
{ (this.state.power.chargingStationPowerKW / parseFloat(this.state.kpi.Refueling) || 0).toFixed(2) }KW per bay


<table>
  <tr className="row-utilization" style={{ background: `rgba(255, 182, 51, ${this.state.previousKpi.Utilization})` }}>
    <td><Icon type="rise" /></td>
    <td>Utilization</td>
    <td><CountUp start={this.state.previousKpi.Utilization * 100} duration={1} end={(this.state.kpi.Utilization * 100)} />%</td>
  </tr>
  <tr>
    <td><div className="swatch swatch-driving"></div></td>
    <td>Driving Passengers</td>
    <td><CountUp start={this.state.previousKpi.DrivingPassenger.toFixed()} end={this.state.kpi.DrivingPassenger.toFixed()} /></td>
  </tr>
  <tr>
    <td><div className="swatch swatch-pickup"></div></td>
    <td>Driving To Pickup</td>
    <td><CountUp start={this.state.previousKpi.DrivingToPickup.toFixed()} end={this.state.kpi.DrivingToPickup.toFixed()} /></td>
  </tr>
  <tr>
    <td><div className="swatch swatch-idle"></div></td>
    <td>Idle</td>
    <td><CountUp start={this.state.previousKpi.Idle.toFixed()} end={this.state.kpi.Idle.toFixed()} /></td>
  </tr>
  <tr>
    <td><div className="swatch swatch-refuel"></div></td>
    <td>Driving To Charge</td>
    <td><CountUp start={this.state.previousKpi.DrivingToRefuel.toFixed()} end={this.state.kpi.DrivingToRefuel.toFixed()} /></td>
  </tr>
  <tr>
    <td><div className="swatch swatch-refueling"></div></td>
    <td>Charging</td>
    <td><CountUp start={this.state.previousKpi.Refueling.toFixed()} end={this.state.kpi.Refueling.toFixed()} /></td>
  </tr>
  <tr>
  <td colspan="3">
