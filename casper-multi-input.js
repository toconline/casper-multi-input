import '@cloudware-casper/casper-icons/casper-icon-button.js';
import '@polymer/paper-input/paper-input.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class CasperMultiInput extends PolymerElement {

  static get SPACE_KEY_CODE () { return 32; }
  static get COMMA_KEY_CODE () { return 188; }
  static get BACKSPACE_KEY_CODE () { return 8; }

  static get properties () {
    return {
      values: {
        type: Array,
        value: () => ([])
      }
    };
  }

  static get template () {
    return html`
      <style>
        paper-input {
          width: 100%;
        }

        #values-container {
          display: flex;
          margin-bottom: 4px;
        }

        #values-container casper-icon-button {
          height: 25px;
          padding: 4px 8px;
          margin-right: 8px;
        }
      </style>

      <paper-input
        value="{{__inputValue}}"
        on-keyup="__onKeyUp"
        on-keydown="__onKeyDown">
        <div id="values-container" slot="prefix">
          <template is="dom-repeat" items="[[values]]">
            <casper-icon-button
              reverse
              with-text
              text="[[item]]"
              icon="fa-light:times"
              on-click="__removeOrEditValue">
            </casper-icon-button>
          </template>
        </div>
      </paper-input>
    `;
  }

  __removeOrEditValue (event) {
    const eventComposedPath = event.composedPath();
    const valueIndex = [...event.target.parentNode.children].indexOf(event.target);

    eventComposedPath.shift().nodeName.toLowerCase() === 'casper-icon'
      ? this.__removeValue(valueIndex)
      : this.__updateValue(valueIndex);
  }

  __removeValue (valueIndex) {
    this.values = this.values.filter((_, index) => index !== valueIndex);
  }

  __updateValue (valueIndex) {
    if (this.__isUpdatingValue && this.__inputValue) {
      this.values = [...this.values, this.__inputValue];
    }

    this.values = this.values.filter((_, index) => {
      if (index === valueIndex) this.__inputValue = this.values[index];

      this.__isUpdatingValue = true;

      return index !== valueIndex;
    });
  }

  __onKeyDown (event) {
    switch (event.keyCode) {
      case CasperMultiInput.BACKSPACE_KEY_CODE:
        return this.__backspaceKeyDown();
      case CasperMultiInput.COMMA_KEY_CODE:
      case CasperMultiInput.SPACE_KEY_CODE:
        return this.__spaceOrCommaKeyDown(event);
    }
  }

  __onKeyUp (event) {
    if ([CasperMultiInput.COMMA_KEY_CODE, CasperMultiInput.SPACE_KEY_CODE].includes(event.keyCode)) {
      this.__spaceOrCommaKeyUp();
    }
  }

  __backspaceKeyDown () {
    // If the input contains any value, ignore the backspace.
    if (this.__inputValue) return;

    this.values.pop();
    this.values = [...this.values];
  }

  __spaceOrCommaKeyDown (event) {
    // Prevent the space and the comma if the input doesn't have any value.
    if (!this.__inputValue) event.preventDefault();
  }

  __spaceOrCommaKeyUp () {
    const trimmedValue = this.__inputValue.substring(0, this.__inputValue.length - 1);
    if (!trimmedValue) return;

    this.values = [...this.values, trimmedValue];
    this.__inputValue = '';
    this.__isUpdatingValue = false;
  }
}

window.customElements.define('casper-multi-input', CasperMultiInput);