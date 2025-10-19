const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

class BaseEDCard extends LitElement {
  static get properties() {
    return {
      config: {},
      hass: {},
      header_title: { type: String },
      no_data_message: { type: String },
    };
  }

  getCardHeader() {
    let child_attributes = this.hass.states[this.config.entity].attributes;
    let child_name =
      typeof child_attributes["nickname"] === "string" &&
      child_attributes["nickname"].length > 0
        ? child_attributes["nickname"]
        : child_attributes["full_name"];
    return html`<div class="ed-card-header">
      ${this.header_title} ${child_name}
    </div>`;
  }

  noDataMessage() {
    return html`<div class="ed-card-no-data">${this.no_data_message}</div>`;
  }

  render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    this.initCard();

    const stateObj = this.hass.states[this.config.entity];

    if (stateObj) {
      return html` <ha-card id="${this.config.entity}-card">
        ${this.config.display_header ? this.getCardHeader() : ""}
        ${this.getCardContent()}
      </ha-card>`;
    }
    return html`<div class="ed-card-no-data">
      Veuillez choisir une autre entité
    </div>`;
  }

  // Définit la configuration de la carte
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }

    this.config = {
      ...this.getDefaultConfig(),
      ...config,
    };
  }

  getItems() {
    let items = [];
    let entity_state = this.hass.states[this.config.entity];
    items.push(...entity_state.attributes[this.items_attribute_key]);
    return items;
  }

  static get styles() {
    return css`
      .ed-card-header {
        text-align: center;
      }
      div {
        padding: 12px;
        font-weight: bold;
        font-size: 1em;
      }
      .ed-card-no-data {
        display: block;
        padding: 8px;
        text-align: center;
        font-style: italic;
      }
    `;
  }
}

export default BaseEDCard;
