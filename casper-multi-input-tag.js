import '@cloudware-casper/casper-icons/casper-icon.js';
import '@polymer/paper-ripple/paper-ripple.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class CasperMultiInputTag extends PolymerElement {

  static get properties () {
    return {
      /**
       * This flag states if the current tag contains an invalid value.
       *
       * @type {Boolean}
       */
      invalid: {
        type: Boolean,
        reflectToAttribute: true
      }
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
          border: #BDBDBD 1px solid;
          border-radius: 1rem;
        }

        :host([invalid]) {
          border-color: var(--status-red);
          background-color: var(--status-red);
        }

        span {
          color: #616161;
          font-weight: 600;
          font-size: 0.8rem;
        }

        casper-icon {
          width: 0.9rem;
          height: 0.9rem;
          margin-left: 0.5rem;
          padding-right: 0.5rem;
          transition: color 100ms ease-out;
        }

        casper-icon:hover {
          cursor: pointer;
          transition: color 100ms ease-in;
        }

        :host(:not([invalid])) casper-icon {
          color: #616161;
        }

        :host(:not([invalid])) casper-icon:hover {
          color: black;
        }

        :host([invalid]) span,
        :host([invalid]) casper-icon {
          color: white;
        }

        :host([invalid]) casper-icon:hover {
          color: #616161;
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