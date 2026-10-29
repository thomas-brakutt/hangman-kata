# Lernnotizen – Hangman mit JavaScript 🕹️

Diese Notizen dokumentieren die wichtigsten JavaScript-Grundlagen, die ich beim Entwickeln meines Hangman-Spiels gelernt habe. Sie dienen als **Nachschlagewerk** und orientieren sich an der aktuellen Version des Spiels, in der **Hauptstädte** erraten werden.

> **Hinweis:** Die Beispiele verwenden zum Teil feste Wörter wie `"berlin"`, damit die einzelnen Schritte leichter nachvollziehbar sind. Im eigentlichen Spiel wird das Wort zufällig ausgewählt.

## Inhaltsverzeichnis

1. [Planung und Spielablauf](#1-planung-und-spielablauf)
2. [Variablen und Spielzustand](#2-variablen-und-spielzustand)
3. [Ein zufälliges Wort auswählen](#3-ein-zufälliges-wort-auswählen)
4. [Unterstriche als Platzhalter anzeigen](#4-unterstriche-als-platzhalter-anzeigen)
5. [Die Wortanzeige aktualisieren](#5-die-wortanzeige-aktualisieren)
6. [Buchstabeneingaben verarbeiten](#6-buchstabeneingaben-verarbeiten)
7. [Ein neues Spiel starten](#7-ein-neues-spiel-starten)
8. [Event-Listener und Buttons](#8-event-listener-und-buttons)
9. [Wichtige JavaScript-Begriffe](#9-wichtige-javascript-begriffe)
10. [Frühere Lösungen – nur zur Erinnerung](#10-frühere-lösungen--nur-zur-erinnerung)

---

## 1. Planung und Spielablauf

Beim Hangman-Spiel sind drei Bereiche wichtig:

**Spielzustand verwalten**

- Eine Hauptstadt zufällig aus einer Liste auswählen.
- Bereits richtig geratene Buchstaben speichern.
- Falsche Versuche zählen.
- Das Spiel nach einer Runde zurücksetzen können.

**Auf Benutzeraktionen reagieren**

- Einen Klick auf einen Buchstabenbutton erkennen.
- Prüfen, ob der Buchstabe im gesuchten Wort vorkommt.
- Richtige Buchstaben aufdecken oder den Fehlerzähler erhöhen.
- Bereits benutzte Buttons deaktivieren.

**Spielende erkennen**

- **Gewonnen:** Alle Buchstaben wurden erraten.
- **Verloren:** Zehn falsche Buchstaben wurden gewählt.
- Nach dem Spielende weitere Eingaben verhindern, bis eine neue Runde startet.

---

## 2. Variablen und Spielzustand

Der _Spielzustand_ beschreibt alles, was sich während einer Runde verändern kann.

```javascript
let selectedWord = ""; // Aktuell gesuchte Hauptstadt
let guessedLetters = []; // Bereits richtig geratene Buchstaben
let wrongGuesses = 0; // Anzahl falscher Versuche

const maxWrongGuesses = 10; // Höchstzahl falscher Versuche
const placeholder = "_"; // Zeichen für verdeckte Buchstaben
```

### `let` und `const`

- **`let`** verwenden wir, wenn ein Wert später neu zugewiesen wird. Beispielsweise erhält `selectedWord` bei jeder neuen Runde ein anderes Wort.
- **`const`** verwenden wir, wenn die Variable nicht neu zugewiesen werden soll. So bleibt die maximale Fehlerzahl auf `10` festgelegt.

`guessedLetters` ist ein **Array** – also eine Liste. Mit `guessedLetters.push("a")` wird der Buchstabe `"a"` hinzugefügt.

---

## 3. Ein zufälliges Wort auswählen

Im Spiel wird diese Zeile verwendet:

```javascript
selectedWord = words[Math.floor(Math.random() * words.length)];
```

Wir zerlegen sie in einzelne Teile.

### Schritt 1: `Math.random()`

```javascript
Math.random();
```

Erzeugt eine zufällige Dezimalzahl von **0 (einschließlich) bis 1 (ausschließlich)**, beispielsweise `0.1234` oder `0.8573`. Der Wert `1` selbst kommt nicht vor.

### Schritt 2: `words.length`

`.length` liefert bei einem Array die Zahl der Einträge.

```javascript
const exampleWords = ["berlin", "paris", "rom"];
console.log(exampleWords.length); // 3
```

Durch die Multiplikation `Math.random() * words.length` entsteht eine Zufallszahl zwischen `0` und der Anzahl der Wörter (die obere Grenze ist nicht enthalten).

### Schritt 3: `Math.floor()`

```javascript
Math.floor(2.9); // 2
Math.floor(0.8); // 0
```

`Math.floor()` rundet **ab** und liefert einen ganzzahligen Index. Array-Indizes beginnen bei `0`.

### Schritt 4: Auf ein Array-Element zugreifen

```javascript
const exampleWords = ["berlin", "paris", "rom"];

// Angenommen, Math.random() ergibt 0.5:
// 0.5 * 3            = 1.5
// Math.floor(1.5)    = 1
// exampleWords[1]    = "paris"
```

### Schritt 5: Das Wort speichern

Das ausgewählte Wort wird der Variablen `selectedWord` zugewiesen. Bei einem Neustart führt das Spiel diese Auswahl erneut aus.

**Merksatz:** `Math.random()` erzeugt die Zufallszahl, `Math.floor()` macht daraus einen gültigen Array-Index und `words[index]` liefert das Wort.

---

## 4. Unterstriche als Platzhalter anzeigen

Beim Spielstart ist noch kein Buchstabe aufgedeckt:

```javascript
activeWord.textContent = (placeholder + " ").repeat(selectedWord.length).trim();
```

### `selectedWord.length`

Bei einer Zeichenkette gibt `.length` die Anzahl der Zeichen zurück.

```javascript
const selectedWord = "berlin";
console.log(selectedWord.length); // 6
```

### `.repeat(n)`

Wiederholt eine Zeichenkette `n`-mal.

```javascript
"_ ".repeat(6); // "_ _ _ _ _ _ "
```

Die Leerzeichen trennen die Unterstriche für eine besser lesbare Darstellung.

### `.trim()`

Entfernt Leerzeichen am **Anfang und Ende** einer Zeichenkette. Das zusätzliche Leerzeichen hinter dem letzten Unterstrich wird dadurch entfernt.

```javascript
"_ ".repeat(6).trim(); // "_ _ _ _ _ _"
```

### `textContent`

Mit `textContent` wird der Textinhalt eines HTML-Elements gelesen oder gesetzt.

```javascript
activeWord.textContent = "_ _ _ _ _ _";
```

Im Browser sieht man jetzt sechs verdeckte Buchstaben. Anders als `innerHTML` behandelt `textContent` den Wert als Text und nicht als HTML-Code.

---

## 5. Die Wortanzeige aktualisieren

Die Funktion `updateWordDisplay()` wird nach einem **richtigen Tipp** ausgeführt. Sie deckt passende Buchstaben auf und prüft, ob das Spiel gewonnen wurde.

### Die wichtigsten Schritte

**1. `.split("")` – Zeichenkette aufteilen**

```javascript
"berlin".split("");
// ["b", "e", "r", "l", "i", "n"]
```

**2. `.map()` – Jedes Array-Element verarbeiten**

`.map()` erstellt ein **neues Array**, dessen Elemente nach einer Regel umgewandelt wurden. Im Spiel wird für jeden Buchstaben geprüft, ob er bereits geraten wurde.

```javascript
const selectedWord = "berlin";
const guessedLetters = ["e", "l"];

const displayWord = selectedWord
  .split("")
  .map((letter, index) => {
    if (!guessedLetters.includes(letter)) {
      return "_";
    }

    return index === 0 ? letter.toUpperCase() : letter;
  })
  .join(" ");

console.log(displayWord); // "_ e _ l _ _"
```

- **`letter`** ist der gerade betrachtete Buchstabe.
- **`index`** ist seine Position im Wort; die erste Position ist `0`.
- **`guessedLetters.includes(letter)`** prüft, ob der Buchstabe im Array vorkommt, und gibt `true` oder `false` zurück.
- Ist der Buchstabe noch nicht geraten, wird ein Unterstrich zurückgegeben.
- Ist er geraten, wird er angezeigt. An Position `0` wird er mit `toUpperCase()` großgeschrieben.

**3. `.join(" ")` – Array wieder verbinden**

```javascript
["_", "e", "_", "l", "_", "_"].join(" ");
// "_ e _ l _ _"
```

**4. Anzeige im Browser aktualisieren**

```javascript
activeWord.textContent = displayWord;
```

### Die Gewinnbedingung

Im aktuellen Spiel wird geprüft, ob im angezeigten Wort **kein Platzhalter** mehr vorkommt:

```javascript
if (!displayWord.includes(placeholder)) {
  statusDisplay.textContent = "GEWONNEN 🥳";
  statusDisplay.style.color = "green";
  statusDisplay.style.animation = "blink 1s steps(5, end) infinite";

  letterButtons.forEach((button) => {
    button.disabled = true;
  });
}
```

**Warum das Ausrufezeichen `!`?**

- `displayWord.includes("_")` → `true`, solange mindestens ein Unterstrich vorhanden ist.
- `!displayWord.includes("_")` → `true`, wenn **kein** Unterstrich mehr vorhanden ist.

Damit ist das gesamte Wort erraten.

**Beispiel:** Sind bei `"berlin"` alle Buchstaben bekannt, wird `"B e r l i n"` angezeigt, und der Gewinnstatus erscheint.

---

## 6. Buchstabeneingaben verarbeiten

Die Funktion `handleGuess(event)` reagiert auf einen Klick auf einen Buchstabenbutton.

### Den geklickten Buchstaben ermitteln

```javascript
function handleGuess(event) {
  const letter = event.target.textContent;
  event.target.disabled = true;

  // Weitere Prüfung …
}
```

- **`event`** enthält Informationen über das Klickereignis.
- **`event.target`** bezeichnet das angeklickte Element.
- **`.textContent`** liest den Buchstaben aus dem Button, zum Beispiel `"a"`.
- **`.disabled = true`** deaktiviert den Button, damit derselbe Buchstabe in dieser Runde nicht erneut gewählt wird.

### Richtiger Buchstabe

```javascript
if (selectedWord.includes(letter)) {
  guessedLetters.push(letter);
  updateWordDisplay();
}
```

- `.includes(letter)` prüft, ob der Buchstabe im Wort vorkommt.
- `.push(letter)` fügt ihn zum Array der richtigen Tipps hinzu.
- `updateWordDisplay()` zeigt **alle Positionen** dieses Buchstabens im Wort an.

### Falscher Buchstabe

```javascript
wrongGuesses++;
failsDisplay.textContent = `FEHLER: ${wrongGuesses} / ${maxWrongGuesses}`;
```

- **`wrongGuesses++`** erhöht den Fehlerzähler um `1`.
- Das **Template Literal** mit Backticks und `${...}` setzt Variablenwerte in einen Text ein.

Beispiel: Nach zwei falschen Tipps erscheint `FEHLER: 2 / 10`.

### Die Hintergrundfarbe verändern

```javascript
const red = 255;
const green = Math.max(200 - wrongGuesses * 10, 0);
const blue = Math.max(200 - wrongGuesses * 10, 0);

failsDivBackground.style.backgroundColor =
  "rgb(" + red + ", " + green + ", " + blue + ")";
```

Etwas lesbarer wäre dieselbe Zuweisung mit einem **Template Literal**:

```javascript
failsDivBackground.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
```

Beide Varianten liefern das gleiche Ergebnis.

- In `rgb(rot, grün, blau)` bestimmen drei Zahlen die Farbe.
- Rot bleibt bei `255`.
- Grün und Blau werden mit jedem Fehler kleiner: Die Anzeige wird stärker rot.
- `Math.max(wert, 0)` sorgt dafür, dass die Werte nicht unter `0` sinken.

### Die Verlustbedingung

```javascript
if (wrongGuesses >= maxWrongGuesses) {
  statusDisplay.textContent = "LEIDER VERLOREN 😭";
  statusDisplay.style.color = "red";
  statusDisplay.style.animation = "blink 1s steps(5, end) infinite";

  activeWord.textContent =
    selectedWord.charAt(0).toUpperCase() + selectedWord.slice(1);

  letterButtons.forEach((button) => {
    button.disabled = true;
  });
}
```

- **`>=`** bedeutet „größer oder gleich“. Das Spiel endet nach dem **zehnten** Fehler.
- **`.charAt(0)`** liest den ersten Buchstaben.
- **`.toUpperCase()`** macht ihn groß.
- **`.slice(1)`** liefert alle Zeichen ab dem zweiten Buchstaben.
- Das richtige Wort wird vollständig angezeigt, z. B. `"Berlin"`.
- Alle Buchstabenbuttons werden deaktiviert.

---

## 7. Ein neues Spiel starten

Die Funktion `initializeGame()` bereitet den Anfangszustand vor und setzt beim Neustart alles zurück.

```javascript
function initializeGame() {
  guessedLetters = [];
  wrongGuesses = 0;

  statusDisplay.textContent = "LOS GEHT'S";
  statusDisplay.style.color = "";
  statusDisplay.style.animation = "";
  failsDivBackground.style.backgroundColor = "";

  selectedWord = words[Math.floor(Math.random() * words.length)];

  activeWord.textContent = (placeholder + " ")
    .repeat(selectedWord.length)
    .trim();

  failsDisplay.textContent = `FEHLER: 0 / ${maxWrongGuesses}`;

  letterButtons.forEach((button) => {
    button.disabled = false;
  });
}
```

Wichtig beim Neustart:

1. Bisherige Tipps und Fehlerzahl zurücksetzen.
2. Gewinn-/Verlustmeldung, Textfarbe, Animation und Hintergrundfarbe zurücksetzen.
3. Eine neue Hauptstadt auswählen.
4. Neue Unterstriche anzeigen.
5. Fehleranzeige auf `0 / 10` setzen.
6. Alle Buchstabenbuttons wieder aktivieren.

Eine leere Zeichenkette `""` bei `element.style.color` oder `element.style.animation` entfernt den **direkt per JavaScript gesetzten Inline-Stil**, sodass wieder die CSS-Regeln gelten.

---

## 8. Event-Listener und Buttons

### Auf Klicks reagieren

```javascript
letterButtons.forEach((button) => {
  button.addEventListener("click", handleGuess);
});

newGameButton.addEventListener("click", initializeGame);

// Direkt beim Laden die erste Runde starten:
initializeGame();
```

- **`forEach()`** führt eine Funktion für jedes Element einer Liste aus.
- **`addEventListener("click", ...)`** registriert eine Funktion, die bei einem Klick ausgeführt werden soll.
- Hier wird **`handleGuess` ohne Klammern** übergeben: Die Funktion soll erst beim Klick ausgeführt werden.
- Mit **`initializeGame()` samt Klammern** wird die Funktion dagegen sofort aufgerufen, um die erste Runde zu starten.

### Warum genügt `disabled`?

```javascript
button.disabled = true; // Nicht mehr bedienbar
button.disabled = false; // Wieder bedienbar
```

Ein deaktivierter Button reagiert nicht mehr auf Klicks und wird auch semantisch als deaktiviert erkannt. Ein zusätzliches `button.style.pointerEvents = "none"` ist dafür nicht nötig und könnte beim Neustart versehentlich aktiv bleiben.

---

## 9. Wichtige JavaScript-Begriffe

| Begriff         | Bedeutung im Hangman-Spiel                                |
| --------------- | --------------------------------------------------------- |
| `Array`         | Liste von Wörtern oder geratenen Buchstaben               |
| `let`           | Variable, deren Wert später neu zugewiesen wird           |
| `const`         | Variable, die nicht neu zugewiesen werden soll            |
| `.length`       | Anzahl der Array-Einträge oder Zeichen einer Zeichenkette |
| `.includes()`   | Prüft, ob ein Wert vorkommt                               |
| `.push()`       | Fügt einem Array einen Eintrag hinzu                      |
| `.split("")`    | Zerlegt eine Zeichenkette in einzelne Zeichen             |
| `.map()`        | Erstellt ein neues Array durch Umwandlung der Einträge    |
| `.join(" ")`    | Verbindet Array-Einträge zu einer Zeichenkette            |
| `.repeat()`     | Wiederholt eine Zeichenkette                              |
| `.trim()`       | Entfernt Leerzeichen am Anfang und Ende                   |
| `.forEach()`    | Führt eine Funktion für jeden Eintrag aus                 |
| `textContent`   | Liest oder setzt den Text eines HTML-Elements             |
| `event.target`  | Element, das ein Ereignis ausgelöst hat                   |
| `disabled`      | Deaktiviert oder aktiviert einen Button                   |
| `>=`            | Vergleich „größer oder gleich“                            |
| `!`             | Logisches NICHT: kehrt `true` und `false` um              |
| `++`            | Erhöht eine Zahl um eins                                  |
| `` `${wert}` `` | Fügt Werte in ein Template Literal ein                    |

---

## 10. Frühere Lösungen – nur zur Erinnerung

Die folgenden Techniken waren in einer **älteren Version** des Spiels enthalten. Sie sind **nicht Teil der aktuellen Spiellogik**, bleiben aber als Lernstoff interessant.

### Alte Gewinnprüfung mit `replace()` und regulärem Ausdruck

```javascript
activeWord.textContent.replace(/\s+/g, "") === selectedWord;
```

- **`\s`** steht für ein Leerraumzeichen (etwa ein Leerzeichen oder einen Tab).
- **`+`** bedeutet „eines oder mehrere“.
- **`g`** steht für „global“: Alle passenden Stellen werden ersetzt.
- **`replace(/\s+/g, "")`** entfernt also sämtliche Leerraumzeichen.

Diese frühere Prüfung verglich die Anzeige ohne Leerzeichen mit dem gesuchten Wort. Die neue Version zeigt den ersten Buchstaben jedoch groß an. Ein einfacher Zeichenkettenvergleich wäre dadurch nicht mehr zuverlässig, da JavaScript zwischen Groß- und Kleinschreibung unterscheidet.

**Aktuelle Lösung:**

```javascript
if (!displayWord.includes(placeholder)) {
  // Gewonnen: Es sind keine Unterstriche mehr sichtbar.
}
```

### Alte Meldung mit `setTimeout()` und `alert()`

```javascript
setTimeout(() => alert("You won! 🎉"), 100);
```

- **`setTimeout()`** plant die Ausführung einer Funktion nach einer bestimmten Wartezeit.
- **`100`** bedeutet 100 Millisekunden.
- **`alert()`** öffnet ein Browserdialogfenster.
- **`() => ...`** ist eine Arrow-Funktion.

**Aktuelle Lösung:** Das Spiel schreibt Gewinn- und Verlustmeldungen direkt in die Statusanzeige und verwendet die CSS-Animation `blink`. Es öffnet kein `alert()`-Fenster mehr.

---

## Mein wichtigstes Lernprinzip

Eine Funktion sollte eine klar erkennbare Aufgabe erfüllen:

- **`initializeGame()`** → Neue Spielrunde vorbereiten.
- **`handleGuess()`** → Einen Buchstaben prüfen und Fehler zählen.
- **`updateWordDisplay()`** → Wort aktualisieren und Gewinn erkennen.

So kann ich den Code leichter **lesen, testen, korrigieren und später erweitern**.
