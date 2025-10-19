import BaseEDCardEditor from "./base-editor";

const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);

const html = LitElement.prototype.html;

class EDHomeworkCardEditor extends BaseEDCardEditor {
  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      ${this.buildEntityPickerField(
        "Homework entity",
        "entity",
        this._config.entity,
        "homework_([1-3]|today|tomorrow|next_day)"
      )}
      ${this.buildSwitchField(
        "Display header",
        "display_header",
        this._config.display_header
      )}
      ${this.buildSwitchField(
        "Reduce done homework",
        "reduce_done_homework",
        this._config.reduce_done_homework
      )}
      ${this.buildSwitchField(
        "Display done homework",
        "display_done_homework",
        this._config.display_done_homework
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

customElements.define(
  "ecole_directe-homework-card-editor",
  EDHomeworkCardEditor
);
