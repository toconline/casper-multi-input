import '@cloudware-casper/casper-icons/casper-icon-button.js';
import '@polymer/paper-input/paper-input.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class CasperMultiInput extends PolymerElement {

  static get SPACE_KEY_CODE () { return 32; }
  static get COMMA_KEY_CODE () { return 188; }
  static get BACKSPACE_KEY_CODE () { return 8; }

  static get properties () {
    return {
      type: String,
      values: {
        type: Array,
        value: () => ([])
      },
      __internalValues: {
        type: Array,
        value: () => ([])
      },
      __regularExpressionsPerType: {
        type: Object,
        value: () => ({
          email: /^\S+@\S+$/
        })
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
        id="input"
        value="{{__inputValue}}"
        on-keyup="__onKeyUp"
        on-keydown="__onKeyDown">
        <div id="values-container" slot="prefix">
          <template is="dom-repeat" items="[[__internalValues]]">
            <casper-icon-button
              reverse
              with-text
              icon="fa-light:times"
              text="[[item.value]]"
              invalid$="[[item.invalid]]"
              on-click="__removeOrEditValue">
            </casper-icon-button>
          </template>
        </div>
      </paper-input>
    `;
  }

  ready () {
    super.ready();
    window.test = this;
  }

  __removeOrEditValue (event) {
    const eventComposedPath = event.composedPath();
    const valueIndex = [...event.target.parentNode.children].indexOf(event.target);

    eventComposedPath.shift().nodeName.toLowerCase() === 'casper-icon'
      ? this.__removeValue(valueIndex)
      : this.__updateValue(valueIndex);
  }

  __removeValue (valueIndex) {
    this.__internalValues = this.__internalValues.filter((_, index) => index !== valueIndex);
  }

  __updateValue (valueIndex) {
    if (this.__inputValue) this.__pushValue(this.__inputValue);

    this.__inputValue = this.__internalValues[valueIndex].value;
    this.__removeValue(valueIndex);
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
    if (this.__isCharCodeSpaceOrComma(event.keyCode)) {
      this.__spaceOrCommaKeyUp();
    }
  }

  __backspaceKeyDown () {
    // If the input contains any value, ignore the backspace.
    if (this.__inputValue) return;

    this.__internalValues.pop();
    this.__internalValues = [...this.__internalValues];
  }

  __spaceOrCommaKeyDown (event) {
    // Prevent the space and the comma if the input doesn't have any value.
    if (!this.__inputValue) event.preventDefault();
  }

  __spaceOrCommaKeyUp () {
    // Check if the last character of the input value is either a comma or a space.
    if (!this.__isCharCodeSpaceOrComma(this.__inputValue.charCodeAt(this.__inputValue.length - 1))) return;

    this.__pushValue(this.__inputValue.substring(0, this.__inputValue.length - 1));
    this.__inputValue = '';
  }

  __pushValue (value) {
    this.__internalValues = [
      ...this.__internalValues,
      { value, invalid: !this.__validateValue(value) }
    ];
  }

  __validateValue (value) {
    const regularExpression = this.__regularExpressionsPerType[this.type];

    return !regularExpression ? true : regularExpression.test(value);
  }

  __isCharCodeSpaceOrComma (charCode) {
    return [
      CasperMultiInput.COMMA_KEY_CODE,
      CasperMultiInput.SPACE_KEY_CODE
    ].includes(charCode);
  }
}

window.customElements.define('casper-multi-input', CasperMultiInput);