import React from "react";
import "../styles/css/timer.css";

class OnTimer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counterLength: 600,
      sessionLength: 25,
      breakLength: 5,
      timeLeft: "25:00",
      minutes: 25,
      seconds: 0,
      timerStatus: "",
      timerType: "Session",
      disableInput: false,
      showMessage: false,
      admin: true,
    };

    this.timerControl = this.timerControl.bind(this);
    this.reset = this.reset.bind(this);
    this.breakDecrement = this.breakDecrement.bind(this);
    this.breakIncrement = this.breakIncrement.bind(this);
    this.sessionDecrement = this.sessionDecrement.bind(this);
    this.sessionIncrement = this.sessionIncrement.bind(this);
    this.addZero = this.addZero.bind(this);
    this.breakStart = this.breakStart.bind(this);
    this.sessionStart = this.sessionStart.bind(this);
    this.breakCounter = this.breakCounter.bind(this);
    this.breakInput = this.breakInput.bind(this);
    this.sessionInput = this.sessionInput.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //   if (
  //     nextProps.sessionLength !== this.state.sessionLength ||
  //     nextProps.breakLength !== this.state.breakLength ||
  //     nextProps.admin !== this.state.admin ||
  //     nextProps.timerStatus !== this.state.timerStatus
  //   ) {
  //     this.setState({
  //       sessionLength: nextProps.sessionLength,
  //       minutes: nextProps.sessionLength,
  //       breakLength: nextProps.breakLength,
  //       admin: nextProps.admin,
  //       // timerStatus: nextProps.timerStatus,
  //     });
  //   }
  //   if (nextProps.timerStatus !== this.state) {

  //   }
  // }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.sessionLength !== prevState.sessionLength ||
      nextProps.breakLength !== prevState.breakLength ||
      nextProps.admin !== prevState.admin
    ) {
      return {
        sessionLength: nextProps.sessionLength,
        minutes: nextProps.sessionLength,
        breakLength: nextProps.breakLength,
        admin: nextProps.admin,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.syncTrigger !== this.props.syncTrigger) {
      console.log("timer started");
      this.timerControl();
    }
    if (prevProps.syncReset !== this.props.syncReset) {
      console.log("timer resetted");
      this.reset();
    }
  }

  breakDecrement() {
    if (
      this.state.timerStatus === "running" ||
      this.state.timerStatus === "paused"
    ) {
      return;
    }
    const { breakLength } = this.state;
    let newBreakLength = breakLength - 1;
    if (breakLength > 1) {
      this.setState({
        breakLength: newBreakLength,
      });
      if (this.props.currentUser) {
        this.props.handleRestUpdate(newBreakLength);
      }
    }
  }

  breakIncrement() {
    if (
      this.state.timerStatus === "running" ||
      this.state.timerStatus === "paused"
    ) {
      return;
    }
    const { breakLength } = this.state;
    let newBreakLength = breakLength + 1;
    if (breakLength < 60) {
      this.setState({
        breakLength: newBreakLength,
      });
      if (this.props.currentUser) {
        this.props.handleRestUpdate(newBreakLength);
      }
    }
  }

  breakInput(e) {
    if (e.target.value < 60 && e.target.value >= 1) {
      this.setState({
        breakLength: parseInt(e.target.value),
      });
      if (this.props.currentUser) {
        this.props.handleRestUpdate(parseInt(e.target.value));
      }
    }
  }

  sessionDecrement() {
    if (
      this.state.timerStatus === "running" ||
      this.state.timerStatus === "paused"
    ) {
      return;
    }
    const { sessionLength, minutes } = this.state;
    let newSessionLength = sessionLength - 1;
    if (sessionLength > 1) {
      this.setState({
        sessionLength: newSessionLength,
        minutes: newSessionLength,
      });
      if (this.props.currentUser) {
        this.props.handleSessionUpdate(newSessionLength);
      }
    }
  }

  sessionIncrement() {
    if (
      this.state.timerStatus === "running" ||
      this.state.timerStatus === "paused"
    ) {
      return;
    }
    const { sessionLength, minutes } = this.state;
    let newSessionLength = sessionLength + 1;
    if (sessionLength < 60) {
      this.setState({
        sessionLength: newSessionLength,
        minutes: newSessionLength,
      });
      if (this.props.currentUser) {
        this.props.handleSessionUpdate(newSessionLength);
      }
    }
  }

  sessionInput(e) {
    if (e.target.value < 60 && e.target.value >= 1) {
      this.setState({
        sessionLength: parseInt(e.target.value),
        minutes: parseInt(e.target.value),
      });
      if (this.props.currentUser) {
        this.props.handleSessionUpdate(parseInt(e.target.value));
      }
    }
  }

  timerControl() {
    if (this.state.timerStatus === "running") {
      clearInterval(this.timer);
      clearInterval(this.breakTimer);
      this.setState({
        timerStatus: "paused",
      });
      return;
    } else {
      this.setState({
        timerStatus: "running",
      });
    }

    if (this.state.timerType === "Session") {
      this.timer = setInterval(() => this.sessionStart(), 1000);
    } else if (this.state.timerType === "Break") {
    }
  }

  sessionStart() {
    const { seconds, minutes } = this.state;

    this.setState({
      disableInput: true,
    });
    if (seconds > 0) {
      this.setState(({ seconds }) => ({
        seconds: seconds - 1,
      }));
    }
    if (seconds === 0) {
      let minutesDisplay = this.addZero(minutes);
      let secondsDisplay = "00";
      if (minutes === 0) {
        // beep.play();
        clearInterval(this.timer);
        this.setState({
          timerStatus: "",
        });
        this.breakStart();
      } else {
        this.setState(({ minutes }) => ({
          minutes: minutes - 1,
          seconds: 59,
        }));
      }
    }
  }

  breakStart() {
    let minutes = this.state.breakLength;
    this.setState({
      timerType: "Break",
      timerStatus: "running",
      minutes: minutes,
      showMessage: true,
    });

    this.breakTimer = setInterval(() => this.breakCounter(), 1000);
    this.props.setDoneDeep(this.props.doneDeep + 1);
    if (this.props.currentUser) {
      this.props.addDoneDeep();
    }
    setTimeout(() => {
      this.setState({
        showMessage: false,
      });
    }, 3000);
  }

  breakCounter() {
    const { seconds, minutes } = this.state;

    if (seconds > 0) {
      this.setState(({ seconds }) => ({
        seconds: seconds - 1,
      }));
    }
    if (seconds === 0) {
      let minutesDisplay = this.addZero(minutes);
      let secondsDisplay = "00";
      if (minutes === 0) {
        // beep.play();
        clearInterval(this.breakTimer);
        let sessionLength = this.state.sessionLength;
        this.setState({
          timerType: "Session",
          seconds: 0,
          minutes: sessionLength,
          timerStatus: "",
        });

        this.timerControl();
      } else {
        this.setState(({ minutes }) => ({
          minutes: minutes - 1,
          seconds: 59,
        }));
      }
    }
  }

  reset() {
    clearInterval(this.timer);
    clearInterval(this.breakTimer);
    // beep.load();
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      minutes: 25,
      seconds: 0,
      timerStatus: "",
      timerType: "Session",
      disableInput: false,
    });
    if (this.props.admin && this.props.currentUser) {
      this.props.handleSessionUpdate(25);
      this.props.handleRestUpdate(5);
    }
  }

  addZero(value) {
    return ("0" + value).slice(-2);
  }

  render() {
    return (
      <div className="clock">
        {" "}
        {/* START of timer clock*/}
        <div>
          <h4>Timer:</h4>
        </div>
        <div className="countdown">
          {" "}
          {/* START of countdown section*/}
          <p className="timerheaders">{this.state.timerType}</p>
          <div className="timerheaders">
            {this.state.minutes < 10
              ? "0" + this.state.minutes
              : this.state.minutes}
            :
            {this.state.seconds < 10
              ? "0" + this.state.seconds
              : this.state.seconds}
          </div>
          <div>
            {/* <button disabled={!this.state.admin} onClick={this.timerControl}> */}
            <button
              className="timerbttn"
              style={{border:0}}
              disabled={!this.state.admin}
              onClick={this.props.handleSyncStart}
            >
              {/* {this.state.timerStatus === "" ? "Start" : "Pause"}{" "} */}
              {this.state.timerStatus === 
                "running" ? 
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="25" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-pause-circle"><circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line></svg>  
                : <svg xmlns="http://www.w3.org/2000/svg" width="40" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play-circle"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
              }
            </button>

            {/* <button disabled={!this.state.admin} onClick={this.reset}> */}
            <button
              className="timerbttn"
              disabled={!this.state.admin}
              onClick={this.props.handleSyncReset}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            </button>
            {this.state.showMessage && (
              <div>Congrats you completed 1 set of Deep Work!</div>
            )}

            {/* <audio
              ref="beepSound"
              id="beep"
              src="https://bobmatyas.github.io/fcc-pomodoro-clock/sounds/beep.mp3"
            /> */}
          </div>
        </div>{" "}
        {/* END of countdown section*/}
        <div className="settings">
          {" "}
          {/* START of timer settings*/}
          <div className="setbreak">
            {" "}
            {/* START of div for break settings*/}
            <p className="timerheaders">Break</p>
            <div className="timersetpanel">
              {/* START of div for break buttons*/}
              <button
                className="settingbttns"
                onClick={this.breakDecrement}
                disabled={this.state.disableInput || !this.state.admin}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="27" viewBox="0 -8 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              {/* START of div for break settings input*/}{" "}
              {/* <p id="session-length">{this.state.sessionLength}</p> */}
              <input
                className="timerinput"
                disabled={this.state.disableInput || !this.state.admin}
                type="number"
                value={this.state.breakLength}
                onChange={this.sessionInput}
              />
              <button
                className="settingbttns"
                onClick={this.breakIncrement}
                disabled={this.state.disableInput || !this.state.admin}
                
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="27" viewBox="0 -8 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>{" "}
              {/* END of div for break buttons*/}
            </div>
          </div>
          <div className="setwork">
            {" "}
            {/* START of div for work settings*/}
            <p className="timerheaders">Session</p>
            <div className="timersetpanel">
              {/* START of div for work buttons*/}
              <button
                className="settingbttns"
                onClick={this.sessionDecrement}
                disabled={this.state.disableInput || !this.state.admin}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="27" viewBox="0 -8 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              {/* START of div for work settings input*/}{" "}
              {/* <p id="session-length">{this.state.sessionLength}</p> */}
              <input
                className="timerinput"
                disabled={this.state.disableInput}
                type="number"
                value={this.state.sessionLength}
                onChange={this.sessionInput || !this.state.admin}
              />
              <button
                className="settingbttns"
                onClick={this.sessionIncrement}
                disabled={this.state.disableInput || !this.state.admin}
                
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="27" viewBox="0 -8 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>{" "}
              {/* END of div for work buttons*/}
            </div>
          </div>
        </div>{" "}
        {/* END of timer settings*/}
      </div>
    );
  }
}

export default OnTimer;
