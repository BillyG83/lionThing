import { LitElement, html, css } from "lit-element"
import '@lion/button/lion-button.js';

class Timer extends LitElement {
  static get properties() {
		return {
      id: { type: Number },
			timerTitle: { type: String },
      secondsToCount: { type: Number },
      isCountingDown: { type: Boolean },
      isCountComplete: { type: Boolean }
		}
	}

	constructor() {
    super()
    this.isCountingDown = true
    this.isCountComplete = false
    this.isActive = true
  }

  connectedCallback() {
    super.connectedCallback()
    this.updateCount()
  }

  disconnectedCallback() {
    this.isCountingDown = false
    this.isCountComplete = true
  }
  
  static get styles() {
    return css`
      .timer {
          background-color: #F2CD0D;
          display: block;
          margin: 0 10px 20px;
          padding: 20px;
      }
      .timer.timer--active {
        background-color: #1BD90B;
      }
      .timer.timer--ended {
        background-color: #EF0B0C;
      }
      .timer h2 {
        color: white;
        font-size: 14px;
        font-weight: 300;
        letter-spacing: 1px;
      }
      .timer p {
        color: white;
        font-size: 74px;
        font-weight: 100;
        margin: 20px 0;
        text-align: center;
      }
    `
  }

  render() {
    return html`
      <div class="timer ${this.isCountComplete ? 'timer--ended' : ''} ${this.isCountingDown ? 'timer--active' : ''}">
        <h2>${this.timerTitle}</h2>
        <p>${this.convertSecondsUI()}</p>

        <lion-button @click=${this.removeTimer}>Delete</lion-button>
        <lion-button @click=${this.toggleCountDown}>Pause</lion-button>
      </div>
    `
  }

  // returns seconds as HH-MM-SS user friendly format
  convertSecondsUI() {
    const date = new Date(null);
    date.setSeconds(this.secondsToCount);
    const timeUI = date.toISOString().substr(11, 8);
    return timeUI
  }

  removeTimer() {
    // this custom event is passed from timer-maker to remove it from the array
    this.isCountingDown = true
    this.dispatchEvent(new CustomEvent("timer-deleted", { detail: this.timerID }));
  }

  toggleCountDown() {
    // this pauses the timer
    this.isCountingDown = !this.isCountingDown
  }

  updateCount() {
    // timer tick will be a variable so it can be cleared when completed
    let timerTick
    
    if(!this.isCountComplete) {
      timerTick = setInterval(() => {
        
        // stop counter going below 0
        if (this.isCountingDown) {
          this.secondsToCount = this.secondsToCount > 1 ? this.secondsToCount - 1 : 0;
        }

        // when counter hit 0 it stops counting down
        if (this.secondsToCount === 0) {
          this.isCountComplete = true
          clearInterval(timerTick)
        }
      }, 1000);
    }
  }
  
}

customElements.define("timer-item", Timer)