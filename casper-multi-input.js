import '@cloudware-casper/casper-icons/casper-icon-button.js';
import '@polymer/paper-input/paper-input.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class CasperMultiInput extends PolymerElement {

  static get BACKSPACE_KEY_CODE () { return 8; }

  static get properties () {
    return {
      /**
       * This property defines the type of the casper-multi-input which should have a specific regular expression
       * to check each value.
       *
       * @type {String}
       */
      type: String,
      /**
       * The list of valid values.
       *
       * @type {Array}
       */
      values: {
        type: Array,
        value: () => ([]),
        observer: '__valuesChanged'
      },
      /**
       * An array containing all the values, including the invalid ones.
       *
       * @type {Array}
       */
      __internalValues: {
        type: Array,
        value: () => ([]),
        observer: '__internalValuesChanged'
      },
      /**
       * An object containing the regular expressions per type of input.
       *
       * @type {Object}
       */
      __regularExpressionsPerType: {
        type: Object,
        value: () => ({
          email: /^\S+@\S+$/
        })
      },
      /**
       * The list of characters that should be used to separate values.
       *
       * @type {String}
       */
      __separatorCharacters: {
        type: String,
        value: ', '
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
        on-keydown="__onKeyDown">
        <div id="values-container" slot="prefix">
          <template is="dom-repeat" items="[[__internalValues]]">
            <casper-icon-button
              reverse
              with-text
              icon="fa-light:times"
              text="[[item.value]]"
              invalid$="[[item.invalid]]"
              on-click="__removeOrUpdateValue">
            </casper-icon-button>
          </template>
        </div>
      </paper-input>
    `;
  }

  /**
   * This method is invoked when the user clicks on one of the existing tags and evalutes
   * if the user is trying to edit or remove an existing value given the event's target.
   *
   * @param {Object} event The event's object.
   */
  __removeOrUpdateValue (event) {
    const eventComposedPath = event.composedPath();
    const valueIndex = [...event.target.parentNode.children].indexOf(event.target);

    eventComposedPath.shift().nodeName.toLowerCase() === 'casper-icon'
      ? this.__removeValue(valueIndex)
      : this.__updateValue(valueIndex);
  }

  /**
   * This method will remove the existing value in the given index.
   *
   * @param {Number} valueIndex The value's index.
   */
  __removeValue (valueIndex) {
    this.__internalValues = this.__internalValues.filter((_, index) => index !== valueIndex);
  }

  /**
   * This method will update the existing value in the given index, saving the current input content into a new value.
   *
   * @param {Number} valueIndex The value's index.
   */
  __updateValue (valueIndex) {
    if (this.__inputValue) this.__pushValue(this.__inputValue);

    this.__inputValue = this.__internalValues[valueIndex].value;
    this.__removeValue(valueIndex);
  }

  /**
   * This method handles the input's keydown events.
   *
   * @param {Object} event The event's object.
   */
  __onKeyDown (event) {
    event.keyCode === CasperMultiInput.BACKSPACE_KEY_CODE
      ? this.__backspaceKeyDown()
      : this.__remainingKeysDown(event);
  }

  /**
   * This method specifically handles the input's backspace keydown events.
   */
  __backspaceKeyDown () {
    // If the input contains any value, ignore the backspace.
    if (this.__inputValue) return;

    this.__internalValues.pop();
    this.__internalValues = [...this.__internalValues];
  }

  /**
   * This method handles the remaining input's keydown events.
   *
   * @param {Object} event The event's object.
   */
  __remainingKeysDown (event) {
    // Completely ignore this method if we're not dealing with one of the separator characters.
    if (!Array.from(this.__separatorCharacters).includes(event.key)) return;

    // Prevent the space and the comma if the input doesn't have any value.
    if (!this.__inputValue) return event.preventDefault();

    this.__pushValue(this.__inputValue);
    setTimeout(() => this.__inputValue = '', 0);
  }

  /**
   * This method returns an object containing the new value and a flag stating its validity.
   *
   * @param {String} value The value that shall be created.
   */
  __createValue (value) {
    const regularExpression = this.__regularExpressionsPerType[this.type];

    return {
      value,
      invalid: regularExpression && !regularExpression.test(value)
    };
  }

  /**
   * This method adds a new value to the list of existing ones.
   *
   * @param {String} value The new value we're adding.
   */
  __pushValue (value) {
    this.__internalValues = [...this.__internalValues, this.__createValue(value)];
  }

  /**
   * This observer is invoked when the values property changes.
   */
  __valuesChanged () {
    // This is used to avoid observer loops since the values and __internalValues properties alter each other.
    if (this.__valuesLock) return;

    this.__internalValuesLock = true;
    this.__internalValues = this.values.map(value => this.__createValue(value));
    this.__internalValuesLock = false;
  }

  /**
   * This observer is invoked when the __internalValues property changes.
   */
  __internalValuesChanged () {
    // This is used to avoid observer loops since the values and __internalValues properties alter each other.
    if (this.__internalValuesLock) return;

    this.__valuesLock = true;
    this.values = this.__internalValues
      .filter(internalValue => !internalValue.invalid)
      .map(internalValue => internalValue.value);
    this.__valuesLock = false;
  }
}

window.customElements.define('casper-multi-input', CasperMultiInput);