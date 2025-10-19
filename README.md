# EcoleDirecteHACards - Cartes pour l'intégration Ecole Directe

Cartes pour afficher des informations de l'intégration [Ecole Directe](https://github.com/hacf-fr/hass-ecoledirecte)

## Installation

### Using HACS

Add this repository to HACS : https://github.com/hacf-fr/EcoleDirecteHACards.git
then:  
HACS > Lovelace > **Ecole Directe Cards**

## Cards

### Timetable

![Timetable card example](/doc/images/timetable-card.png "Timetable card example").

```yaml
type: custom:ecole_directe-timetable-card
entity: sensor.timetable_next_day
display_header: true
display_lunch_break: true
display_classroom: true
display_teacher: true
display_day_hours: true
dim_ended_lessons: true
```

This card can be used with all timetable sensors.

### Devoirs

![Exemple carte Devoirs](/doc/images/devoir-card.png "Exemple carte Devoirs").

```yaml
type: custom:ecole_directe-devoirs-card
entity: sensor.devoirs
display_header: true
display_done_devoir: true
reduce_done_devoir: true
```

Cette carte peut être utilisé par tous les capteurs devoirs.

### Notes

![Notes card example](/doc/images/notes-card.png "Notes card example").

```yaml
type: custom:ecole_directe-notes-card
entity: sensor.notes
grade_format: full # 'full' will display grade as "X/Y", 'short' will display "X"
display_header: true
display_date: true
display_comment: true
display_class_average: true
compare_with_class_average: true
compare_with_ratio: null # use a float number, e.g. '0.6' to compare with the grade / out_of ratio
display_coefficient: true
display_class_min: true
display_class_max: true
display_new_grade_notice: true
max_notes: null
```

### Moyennes

![Moyennes card example](/doc/images/moyennes-card.png "Moyennes card example").

```yaml
type: custom:ecole_directe-moyennes-card
entity: sensor.moyennes
average_format: full # 'full' will display grade as "X/Y", 'short' will display "X"
display_header: true
compare_with_class_average: true
compare_with_ratio: null # use a float number, e.g. '0.6' to compare with the grade / out_of ratio
display_class_average: true
display_class_min: true
display_class_max: true
```

### Evaluations

![Evaluations card example](/doc/images/evaluations-card.png "Evaluations card example").

```yaml
type: custom:ecole_directe-evaluations-card
entity: sensor.evaluations
display_header: true
display_description: true
display_teacher: true
display_date: true
display_comment: true
display_coefficient: true
max_evaluations: null
child_name: null
```

### Absences et retards

![Absences card example](/doc/images/absences-card.png "Absences card example").

```yaml
type: custom:ecole_directe-absences-retards-card
entity: sensor.absences
display_header: true
max: null
child_name: null
```
