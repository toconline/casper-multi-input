/* 
 * Copyright (C) 2020 Cloudware S.A. All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import '@cloudware-casper/casper-icons/casper-icon.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-spinner/paper-spinner.js';
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
      },
      /**
       * This flag states if the current tag contains a value which is being currently validated.
       *
       * @type {Boolean}
       */
      validating: {
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
          margin: 0 0.5rem;
        }

        paper-spinner {
          width: 0.9rem;
          height: 0.9rem;
          margin: 0 0.5rem;
          --paper-spinner-stroke-width: 2px;
          --paper-spinner-layer-1-color: var(--primary-color);
          --paper-spinner-layer-2-color: var(--primary-color);
          --paper-spinner-layer-3-color: var(--primary-color);
          --paper-spinner-layer-4-color: var(--primary-color);
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

        :host([validating]) span {
          color: #989898;
        }

        :host([invalid]) casper-icon:hover {
          color: #616161;
        }
      </style>

      <paper-ripple></paper-ripple>
      <span><slot></slot></span>

      <template is="dom-if" if="[[!validating]]">
        <casper-icon
          icon="fa-light:times"
          id="icon">
        </casper-icon>
      </template>

      <template is="dom-if" if="[[validating]]">
        <paper-spinner active></paper-spinner>
      </template>
    `;
  }

}

window.customElements.define('casper-multi-input-tag', CasperMultiInputTag);
