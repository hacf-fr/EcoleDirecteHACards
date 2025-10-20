import BaseEDCard from "./base-card";

const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

Date.prototype.getWeekNumber = function () {
  var d = new Date(+this);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  return Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7);
};

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

class EDTimetableCard extends BaseEDCard {
  lunchBreakRendered = false;

  initCard() {}

  getBreakRow(label, ended) {
    return html` <tr class="lunch-break ${ended ? "lesson-ended" : ""}">
      <td></td>
      <td><span></span></td>
      <td colspan="2">
        <span class="lesson-name">${label}</span>
      </td>
    </tr>`;
  }

  getTimetableRow(lesson) {
    let currentDate = new Date();
    let startAt = Date.parse(lesson.start_at);
    let endAt = Date.parse(lesson.end_at);

    let prefix = html``;
    if (
      this.config.display_lunch_break &&
      lesson.is_afternoon &&
      !this.lunchBreakRendered
    ) {
      prefix = this.getBreakRow(
        "Repas",
        this.config.dim_ended_lessons && startAt < currentDate
      );
      this.lunchBreakRendered = true;
    }

    let content = html`
      <tr
        class="${lesson.is_annule ? "lesson-canceled" : ""} ${this.config
          .dim_ended_lessons && endAt < currentDate
          ? "lesson-ended"
          : ""}"
      >
        <td>
          ${lesson.start_time}<br />
          ${lesson.end_time}
        </td>
        <td>
          <span style="background-color:${lesson.background_color}"></span>
        </td>
        <td>
          <span class="lesson-name">${lesson.lesson}</span>
          ${this.config.display_classroom
            ? html`<span class="lesson-classroom">
                ${lesson.salle ? "Salle " + lesson.salle : ""}
                ${lesson.salle && this.config.display_teacher ? ", " : ""}
              </span>`
            : ""}
          ${this.config.display_teacher
            ? html`<span class="lesson-teacher"> ${lesson.prof} </span>`
            : ""}
        </td>
        <td>
          ${lesson.dispense
            ? html`<span class="lesson-status">${lesson.dispense}</span>`
            : ""}
        </td>
      </tr>
    `;
    return html`${prefix}${content}`;
  }

  getFormattedDate(lesson) {
    return new Date(lesson.start_at)
      .toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
      })
      .replace(/^(.)/, (match) => match.toUpperCase());
  }

  getFormattedTime(time) {
    return new Intl.DateTimeFormat("fr-FR", {
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(time));
  }

  getDayHeader(firstLesson, dayStartAt, dayEndAt, daysCount) {
    return html`<div class="ed-timetable-header">
      ${this.config.enable_slider
        ? html`<span
            class="ed-timetable-header-arrow-left ${daysCount === 0
              ? "disabled"
              : ""}"
            @click=${(e) => this.changeDay("previous", e)}
            >←</span
          >`
        : ""}
      <span class="ed-timetable-header-date"
        >${this.getFormattedDate(firstLesson)}</span
      >
      ${this.config.display_day_hours && dayStartAt && dayEndAt
        ? html`<span class="ed-timetable-header-hours">
            ${this.getFormattedTime(dayStartAt)} -
            ${this.getFormattedTime(dayEndAt)}
          </span>`
        : ""}
      ${this.config.enable_slider
        ? html`<span
            class="ed-timetable-header-arrow-right"
            @click=${(e) => this.changeDay("next", e)}
            >→</span
          >`
        : ""}
    </div>`;
  }

  changeDay(direction, e) {
    e.preventDefault();
    if (e.target.classList.contains("disabled")) {
      return;
    }

    const activeDay = e.target.parentElement.parentElement;
    let hasPreviousDay =
      activeDay.previousElementSibling &&
      activeDay.previousElementSibling.classList.contains(
        "ed-timetable-day-wrapper"
      );
    let hasNextDay =
      activeDay.nextElementSibling &&
      activeDay.nextElementSibling.classList.contains(
        "ed-timetable-day-wrapper"
      );
    let newActiveDay = null;

    if (direction === "previous" && hasPreviousDay) {
      newActiveDay = activeDay.previousElementSibling;
    } else if (direction === "next" && hasNextDay) {
      newActiveDay = activeDay.nextElementSibling;
    }

    if (newActiveDay) {
      activeDay.classList.remove("active");
      newActiveDay.classList.add("active");

      hasPreviousDay =
        newActiveDay.previousElementSibling &&
        newActiveDay.previousElementSibling.classList.contains(
          "ed-timetable-day-wrapper"
        );
      hasNextDay =
        newActiveDay.nextElementSibling &&
        newActiveDay.nextElementSibling.classList.contains(
          "ed-timetable-day-wrapper"
        );

      if (!hasPreviousDay) {
        newActiveDay
          .querySelector(".ed-timetable-header-arrow-left")
          .classList.add("disabled");
      }

      if (!hasNextDay) {
        newActiveDay
          .querySelector(".ed-timetable-header-arrow-right")
          .classList.add("disabled");
      }
    }
  }

  // we override the render method to return the card content
  render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    const stateObj = this.hass.states[this.config.entity];

    const lessons =
      this.hass.states[this.config.entity].attributes["Emploi du temps"];

    if (stateObj) {
      this.lunchBreakRendered = false;

      const itemTemplates = [];
      let dayTemplates = [];
      let daysCount = 0;

      let dayStartAt = null;
      let dayEndAt = null;

      let now = new Date();
      let activeDay = 0;

      for (let index = 0; index < lessons.length; index++) {
        let lesson = lessons[index];
        let currentFormattedDate = this.getFormattedDate(lesson);
        let endOfDay = new Date(lesson.end_at);

        if (!lesson.isAnnule) {
          if (dayStartAt === null) {
            dayStartAt = lesson.start_at;
          }
          dayEndAt = lesson.end_at;
        }

        if (lesson.isAnnule && index < lessons.length - 1) {
          let nextLesson = lessons[index + 1];
          if (lesson.start_at === nextLesson.start_at && !nextLesson.isAnnule) {
            continue;
          }
        }

        dayTemplates.push(this.getTimetableRow(lesson));

        // checking if next lesson is on another day
        if (
          index + 1 >= lessons.length ||
          (index + 1 < lessons.length &&
            currentFormattedDate !== this.getFormattedDate(lessons[index + 1]))
        ) {
          if (
            this.config.enable_slider &&
            this.config.switch_to_next_day &&
            isSameDay(endOfDay, now) &&
            endOfDay < now
          ) {
            activeDay = daysCount + 1;
          }

          itemTemplates.push(html`
            <div
              class="${this.config.enable_slider
                ? "slider-enabled"
                : ""} ed-timetable-day-wrapper ${daysCount === activeDay
                ? "active"
                : ""}"
            >
              ${this.getDayHeader(lesson, dayStartAt, dayEndAt, daysCount)}
              <table>
                ${dayTemplates}
              </table>
            </div>
          `);
          dayTemplates = [];

          this.lunchBreakRendered = false;
          dayStartAt = null;
          dayEndAt = null;

          daysCount++;
        } else if (
          this.config.display_free_time_slots &&
          index + 1 < lessons.length
        ) {
          const currentEndAt = new Date(lesson.end_at);
          const nextLesson = lessons[index + 1];
          const nextLessonStartAt = new Date(nextLesson.start_at);
          if (
            lesson.is_morning === nextLesson.is_morning &&
            Math.floor((nextLessonStartAt - currentEndAt) / 1000 / 60) > 30
          ) {
            const now = new Date();
            dayTemplates.push(
              this.getBreakRow(
                "Pas de cours",
                this.config.dim_ended_lessons && nextLessonStartAt < now
              )
            );
          }
        }
      }

      if (dayTemplates.length > 0) {
        itemTemplates.push(
          html`<table>
            ${dayTemplates}
          </table>`
        );
      }

      return html` <ha-card
        id="${this.config.entity}-card"
        class="${this.config.enable_slider ? "ed-timetable-card-slider" : ""}"
      >
        ${this.config.display_header ? this.getCardHeader() : ""}
        ${itemTemplates}
      </ha-card>`;
    }
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }

    const defaultConfig = {
      entity: null,
      display_header: true,
      display_lunch_break: true,
      display_classroom: true,
      display_teacher: true,
      display_day_hours: true,
      dim_ended_lessons: true,
      enable_slider: false,
      display_free_time_slots: true,
      switch_to_next_day: false,
    };

    this.config = {
      ...defaultConfig,
      ...config,
    };

    this.header_title = "Emploi du temps de ";
    this.no_data_message = "Pas d'emploi du temps à afficher";
  }

  static get styles() {
    return css`
      ${super.styles}
      .ed-timetable-card-slider .ed-timetable-day-wrapper {
        display: none;
      }
      .ed-timetable-card-slider .ed-timetable-day-wrapper.active {
        display: block;
      }
      .ed-timetable-card-slider .ed-timetable-header-date {
        display: inline-block;
        text-align: center;
        width: 120px;
      }
      .ed-timetable-header-arrow-left,
      .ed-timetable-header-arrow-right {
        cursor: pointer;
      }
      .ed-timetable-header-arrow-left.disabled,
      .ed-timetable-header-arrow-right.disabled {
        opacity: 0.3;
        pointer-events: none;
      }
      span.ed-timetable-header-hours {
        float: right;
      }
      table {
        clear: both;
        font-size: 0.9em;
        font-family: Roboto;
        width: 100%;
        outline: 0px solid #393c3d;
        border-collapse: collapse;
      }
      tr:nth-child(odd) {
        background-color: rgba(0, 0, 0, 0.1);
      }
      td {
        vertical-align: middle;
        padding: 5px 10px 5px 10px;
        text-align: left;
      }
      tr td:first-child {
        width: 13%;
        text-align: right;
      }
      span.lesson-name {
        font-weight: bold;
        display: block;
      }
      tr td:nth-child(2) {
        width: 4px;
        padding: 5px 0;
      }
      tr td:nth-child(2) > span {
        display: inline-block;
        width: 4px;
        height: 3rem;
        border-radius: 4px;
        background-color: grey;
        margin-top: 4px;
      }
      span.lesson-status {
        color: white;
        background-color: rgb(75, 197, 253);
        padding: 4px;
        border-radius: 4px;
      }
      .lesson-canceled span.lesson-name {
        text-decoration: line-through;
      }
      .lesson-canceled span.lesson-status {
        background-color: rgb(250, 50, 75);
      }
      .lesson-ended {
        opacity: 0.3;
      }
      div:not(.slider-enabled).ed-timetable-day-wrapper
        + div:not(.slider-enabled).ed-timetable-day-wrapper {
        border-top: 1px solid white;
      }
    `;
  }

  static getStubConfig() {
    return {
      display_header: true,
      display_lunch_break: true,
      display_classroom: true,
      display_teacher: true,
      display_day_hours: true,
      dim_ended_lessons: true,
      enable_slider: false,
      display_free_time_slots: true,
      switch_to_next_day: false,
    };
  }

  static getConfigElement() {
    return document.createElement("ecole_directe-emploi_temps-card-editor");
  }
}

customElements.define("ecole_directe-emploi_temps-card", EDTimetableCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "ecole_directe-emploi_temps-card",
  name: "Carte de l'emploi du temps pour Ecole Directe",
  description: "Affiche l'emploi du temps pour Ecole Directe",
  documentationURL:
    "https://github.com/hacf-fr/EcoleDirecteHACards?tab=readme-ov-file#emploi_temps",
});
