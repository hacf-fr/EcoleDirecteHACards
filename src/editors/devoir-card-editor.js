import BaseEDCardEditor from "./base-editor";

const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);

const html = LitElement.prototype.html;

class EDDevoirCardEditor extends BaseEDCardEditor {
  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      ${this.buildEntityPickerField(
        "Devoir entity",
        "entity",
        this._config.entity,
        "devoirs_([1-3]|today|tomorrow|next_day)"
      )}
      ${this.buildSwitchField(
        "Display header",
        "display_header",
        this._config.display_header
      )}
      ${this.buildSwitchField(
        "Reduce done devoir",
        "reduce_done_devoir",
        this._config.reduce_done_devoir
      )}
      ${this.buildSwitchField(
        "Display done devoir",
        "display_done_devoir",
        this._config.display_done_devoir
      )}
      ${this.buildSwitchField(
        "Enable slider",
        "enable_slider",
        this._config.enable_slider,
        false
      )}
    `;
  }
}

customElements.define("ecole_directe-devoir-card-editor", EDDevoirCardEditor);
