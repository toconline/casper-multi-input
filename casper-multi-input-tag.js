import '@cloudware-casper/casper-icons/casper-icon.js';
import '@polymer/paper-ripple/paper-ripple.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class CasperMultiInputTag extends PolymerElement {

  static get properties () {
    return {

    };
  }

  static get template () {
    return html`
      <style>
        :host {
          position: relative;
          margin: 0 2px;
          padding-left: 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          border: #757575 1px solid;
          border-radius: 1rem;
        }

        :host([invalid]) {
          border-color: #FF7043;
        }

        span {
          font-size: 0.9rem;
          color: #616161;
        }

        casper-icon {
          padding-right: 0.5rem;
          color: #616161;
          transition: color 100ms ease-out;
          margin-left: 0.5rem;
          height: 0.9rem;
          width: 0.9rem;
        }

        casper-icon:hover {
          transition: color 100ms ease-in;
          color: black;
          cursor: pointer;
        }

      </style>

      <paper-ripple></paper-ripple>
      <span><slot></slot></span>
      <casper-icon 
        icon="fa-light:times" 
        id="icon">
      </casper-icon>
    `;
  }

}

window.customElements.define('casper-multi-input-tag', CasperMultiInputTag);