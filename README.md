# EcoleDirecteHACards - Cartes pour l'intégration Ecole Directe

Cartes pour afficher des informations de l'intégration [Ecole Directe](https://github.com/hacf-fr/hass-ecoledirecte)

## Installation

### Avec HACS

Cliquez ici : [![Installation via HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=hacf-fr&repository=EcoleDirecteHACards&category=Dashboard)

Ou sinon :
Allez sur l'onglet HACS
Dans le filtre, taper "ecole", choisir **Ecole Directe Cards** et cliquer sur le bouton "Télécharger" en bas à droite.

![Installation via HACS](/doc/images/HACS-installation.png "Installation via HACS").

## Cartes

### Emploi du temps

![Exemple carte Emploi du temps](/doc/images/emploi_temps-card.png "Exemple carte Emploi du temps").

```yaml
type: custom:ecole_directe-emploi_temps-card
entity: sensor.emploi_temps
display_header: true
display_lunch_break: true
display_classroom: true
display_teacher: true
display_day_hours: true
dim_ended_lessons: true
```

Cette carte peut être utilisée avec toutes les capteurs "emploi du temps".

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

![Exemple carte Notes](/doc/images/notes-card.png "Exemple carte Notes").

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
```

### Moyennes

![Moyennes card example](/doc/images/moyennes-card.png "Moyennes card example").

```yaml
type: custom:ecole_directe-moyennes-card
entity: sensor.moyennes
display_header: true
compare_with_class_average: true
compare_with_ratio: null # use a float number, e.g. '15' to compare with the grade
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

## Credits

Toutes ces cartes sont en grosse partie copiées de ce repo et adaptées pour Ecole Directe : https://github.com/delphiki/lovelace-pronote

Merci à [delphiki](https://github.com/delphiki)
