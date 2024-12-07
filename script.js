/*
Planung:
1. Spielzustand verwalten:
- Zufällige Auswahl eines Wortes aus dem Array.
- Variable für bereits geratene Buchstaben.
- Zähler für Fehlversuche.

2. Event-Listener für die Buttons:
- Überprüfen, ob ein Buchstabe im Wort enthalten ist.
- Wenn ja: Offenbaren der Position(en) des Buchstabens.
- Wenn nein: Fehlversuch erhöhen und anzeigen.

3. Spiel Ablauf gewonnen / verloren:
- Überprüfen, ob das Wort vollständig erraten wurde.
- Überprüfen, ob die maximale Anzahl an Fehlversuchen erreicht wurde.

*/

// Todos:   - groß und kleinschreibung

// Words array
const words = [
  "jessika",
  "thomas",
  "laila",
  "lilly",
  "caroline",
  "oma",
  "opa",
  "lailib",
  "theo",
  "katzi",
];

// Game state variables
let selectedWord = ""; // Variable für zufällig bestimmtes Wort
let guessedLetters = []; // Variable für geratene Buchstaben
let wrongGuesses = 0; // Variable - Zähler für falsch geratene Buchstaben
const maxWrongGuesses = 10; // Variable für max. falsch erratene Buchstaben
const placeholder = "_";

// HTML elements
const activeWord = document.querySelector(".word"); // Zugriff auf "p-Element im "main-Element"
const failsDisplay = document.querySelector("#fails"); // Zugriff auf die "Fehleranzeige"
const letterButtons = document.querySelectorAll(".letterBtn"); // Zugriff auf alle "Buchstaben-Buttons"
const newGameButton = document.querySelector(".newgame"); // Zugriff auf "p-Element" - "NewGame"
const statusDisplay = document.querySelector("#active");
const failsDivBackground = document.querySelector(".fails");

// Spiel initialisieren
function initializeGame() {
  // Variablen resetten
  guessedLetters = [];
  wrongGuesses = 0;
  statusDisplay.textContent = "LOS GEHT'S";
  statusDisplay.style.color = ""; // Setze die Schriftfarbe wieder auf Standard
  statusDisplay.style.animation = ""; // deaktiviert das blinken (im CSS hinterlegt)
  failsDivBackground.style.backgroundColor = "";

  selectedWord = words[Math.floor(Math.random() * words.length)]; // siehe unten zu.1.

  // aktualisiert "Benutzeroberfläche (Update UI)"
  activeWord.textContent = (placeholder + " ")
    .repeat(selectedWord.length)
    .trim(); // "Unterstrich-Linie" wird erstellt mit der Länge des zufälligen Wortes (genaue Erklärung siehe unten zu 2.)
  failsDisplay.textContent = `FEHLER: 0 / ${maxWrongGuesses}`; // Fehleranzeige wird resettet - Temptlate einfacher: failsDisplay.textContent = "FEHLER: 0 / " + maxWrongGuesses

  // alle Buchstaben-Buttons werden resettet und styles wieder aktiviert (wieder anklickbar + hover) mit forEach-Schleife
  letterButtons.forEach((button) => {
    (button.disabled = false), (button.style.pointerEvents = "");
  });
}

// Funktion zum aktualisieren des Wortes im Spiel -> Erklärung Funktion siehe unten zu 3.
function updateWordDisplay() {
  const displayWord = selectedWord
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : placeholder))
    .join(" ");
  activeWord.textContent = displayWord;

  if (activeWord.textContent.replace(/\s+/g, "") === selectedWord) {
    statusDisplay.textContent = "GEWONNEN 🥳";
    statusDisplay.style.color = "green"; // Setze die Schriftfarbe
    statusDisplay.style.animation = "blink 1s steps(5, end) infinite"; // aktiviert das blinken (im CSS hinterlegt)

    letterButtons.forEach(
      (button) => (
        (button.disabled = true), (button.style.pointerEvents = "none")
      )
    );
  }
}

// überprüfen der Eingabe - richtig oder falsch -> Erklärung siehe unten zu 4.
function handleGuess(event) {
  const letter = event.target.textContent;
  event.target.disabled = true;

  if (selectedWord.includes(letter)) {
    guessedLetters.push(letter);
    updateWordDisplay();
  } else {
    wrongGuesses++;
    failsDisplay.textContent = `FEHLER: ${wrongGuesses} / ${maxWrongGuesses}`;

    // Berechne die Intensität basierend auf der Anzahl der Fehler
    const red = 255; // Rot bleibt konstant
    const green = Math.max(200 - wrongGuesses * 10, 0); // Grün nimmt ab
    const blue = Math.max(200 - wrongGuesses * 10, 0); // Blau nimmt ab

    // Setze die Hintergrundfarbe
    failsDivBackground.style.backgroundColor =
      "rgb(" + red + ", " + green + ", " + blue + ")"; // oder `rgb(${red}, ${green}, ${blue})`;

    if (wrongGuesses >= maxWrongGuesses) {
      statusDisplay.textContent = "LEIDER VERLOREN 😭";
      statusDisplay.style.color = "red"; // Setze die Schriftfarbe
      statusDisplay.style.animation = "blink 1s steps(5, end) infinite"; // aktiviert das blinken (im CSS hinterlegt)

      activeWord.innerText = selectedWord; // zeigt das korrekte Wort an

      letterButtons.forEach(
        (button) => (
          (button.disabled = true), (button.style.pointerEvents = "none")
        )
      );
    }
  }
}

// Add event listeners
letterButtons.forEach((button) =>
  button.addEventListener("click", handleGuess)
);
newGameButton.addEventListener("click", initializeGame);

// Spiel wird inizialisiert
initializeGame();

// --------------------------------------------------------------------------------

/*
zu 1.:
selectedWord = words[Math.floor(Math.random() * words.length)];

1. Math.random():
- generiert eine zufällige Dezimalzahl zwischen 0 (inklusive) und 1 (exklusive). Beispiele: 0.1234, 0.8573.

2. Math.random() * words.length:
Warum multiplizieren wir mit words.length?
Angenommen, words ist ein Array (z. B. ['Apfel', 'Banane', 'Kirsche']), dann ist words.length die Anzahl der Elemente im Array (hier 3).
Durch die Multiplikation von Math.random() mit words.length erhalten wir eine zufällige Zahl zwischen 0 und der Länge des Arrays (z. B. 0 <= x < 3).

3. Math.floor():
- rundet eine Zahl nach unten auf die nächste ganze Zahl. Beispiele:
Math.floor(2.9) → 2
Math.floor(0.8) → 0
Dadurch erzeugen wir einen gültigen Index für das Array, der immer eine ganze Zahl ist.

4. words[Math.floor(...)]:
- Der gerundete Wert von Math.floor(...) wird als Index verwendet, um ein Element aus dem Array words zu holen.
Beispiel:
words = ['Apfel', 'Banane', 'Kirsche']
Math.random() → 0.5
0.5 * words.length → 1.5
Math.floor(1.5) → 1
words[1] → 'Banane'

5. Zuweisung zu selectedWord:
Das zufällig ausgewählte Wort (z. B. 'Banane') wird der Variablen selectedWord zugewiesen.
Zusammenfassung:
Diese Methode wählt zufällig ein Element aus dem Array words aus und speichert es in der Variablen selectedWord.
*/

// --------------------------------------------------------------------------------

/*
zu 2.
Erklärung "activeWord.textContent = "_ ".repeat(selectedWord.length).trim();"

Diese Zeile erstellt eine Darstellung eines Wortes, bei dem jeder Buchstabe durch einen
Unterstrich (_) ersetzt ist.
Es wird so formatiert, dass die Unterstriche durch Leerzeichen getrennt sind
(z. B. _ _ _ _ für ein Wort mit 4 Buchstaben).

1. selectedWord.length
- die Eigenschaft .length gibt die Anzahl der Zeichen in der Zeichenkette selectedWord zurück.
Beispiel:
selectedWord = "katzi";
console.log(selectedWord.length); // Ausgabe: 5

2. "_ ".repeat(selectedWord.length)
- Die Methode .repeat(n) erstellt eine neue Zeichenkette, in der die ursprüngliche
  Zeichenkette n-mal wiederholt wird.
- Hier wird der String "_ " (Unterstrich + Leerzeichen) so oft wiederholt wie die Länge
  des Wortes (selectedWord.length).
Beispiel:
"_ ".repeat(5); // Ausgabe: "_ _ _ _ _ "

3. .trim()
- die Methode .trim() entfernt alle Leerzeichen am Anfang und Ende einer Zeichenkette.
   - Warum ist das hier nötig? -> Die Methode .repeat() erzeugt am Ende der Wiederholungen
     ein zusätzliches Leerzeichen.
Beispiel ohne .trim():
"_ ".repeat(5); // "_ _ _ _ _ "
Mit .trim() wird das überflüssige Leerzeichen am Ende entfernt:
"_ ".repeat(5).trim(); // "_ _ _ _ _"

4. activeWord.textContent
- überschreibt den Inhalt des HTML-Elements von "activeWord" auf den erzeugten String.
- man sieht jetzt so viele Unterstriche, wie das Wort Buchstaben hat, mit jeweils einem Leerzeichen dazwischen.

Zusammenfassung der Zeile:
selectedWord = "katzi" -> erzeugt mit selectedWord.length = 5:
"_ ".repeat(5); // "_ _ _ _ _ "
.trim() entfernt das überflüssige Leerzeichen am Ende: // "_ _ _ _ _"
Das Ergebnis wird als Textinhalt des HTML-Elements activeWord gesetzt:
activeWord.textContent = "_ _ _ _ _";
*/

// --------------------------------------------------------------------------------

/*
zu 3.
Erklärung Funktion "updateWordDisplay":

- aktualisiert die Darstellung des zu erratenen Wortes,
indem sie aufgedeckte Buchstaben und Platzhalter (_) für nicht erratene Buchstaben anzeigt.
Außerdem prüft sie, ob das Wort vollständig erraten wurde, und zeigt in diesem Fall eine
Gewinnmeldung an.

1. selectedWord.split("")

selectedWord = das zufällig gewählte Wort, das erraten werden soll (z. B. "katzi").

.split("") - zerlegt das Wort in ein Array aus einzelnen Buchstaben.
Beispiel: "katzi" → ["k", "a", "t", "z", "i"].

2. .map((letter) => ...)

.map() - geht durch jedes Element im Array (hier jeden Buchstaben des Wortes) und wandelt es nach
einer bestimmten Regel um.
In diesem Fall wird geprüft: guessedLetters.includes(letter)
Wenn der Buchstabe "letter" in "guessedLetters" enthalten ist, bleibt er erhalten.
Wenn nicht, wird er durch ein _ ersetzt.
Beispiel:
selectedWord = "katzi", guessedLetters = ["a", "t"]
Ergebnis:
["k", "a", "t", "z", "i"] → ["_", "a", "t", "_", "_"].

3. .join(" ")
 - verbindet das Array wieder zu einem String, wobei die Elemente durch ein Leerzeichen
   getrennt werden.
Beispiel:
["_", "a", "t", "_", "_"] zu ->  "_ a t _ _"

4. activeWord.textContent = displayWord;
- der erstellte String ("_ a t _ _") wird in das HTML-Element activeWord eingefügt,
  sodass der Spieler die aktuelle Darstellung des Wortes sieht.

5. if (activeWord.textContent.replace(/\s+/g, "") === selectedWord) {



.replace(/\s+/g, "")
 -  \s+: Findet alle Leerzeichen (einschließlich Tabs, neue Zeilen usw.).
 -  /g: Wendet das Muster global auf den gesamten String an.
 -  "": Ersetzt die gefundenen Leerzeichen durch nichts, also entfernt sie.










6. setTimeout(() => alert("You won! 🎉"), 100); =  Spiel gewonnen
- Eine Nachricht ("You won!") wird nach 100 Millisekunden angezeigt.
- setTimeout sorgt dafür, dass die Animation oder das Update der Darstellung abgeschlossen ist,
  bevor die Meldung erscheint.

7. letterButtons.forEach((button) => (button.disabled = true));
- hier wird letterButtons (die Buchstaben-Buttons) mit forEach-schleife durchlaufen.
- jeder Button wird deaktiviert (disabled = true), dass keine weitere Eingaben möglich ist.

Beispiel:
Angenommen:
selectedWord = "katzi";
guessedLetters = ["a", "t"];
selectedWord.split("") → ["k", "a", "t", "z", "i"]
.map(...) → ["_", "a", "t", "_", "_"]
.join(" ") → "_ a t _ _"
activeWord.textContent -> auf dem Display sieht man: "_ a t _ _"
Wenn das Wort vollständig erraten wurde:
guessedLetters = ["k", "a", "t", "z", "i"]
displayWord = "k a t z i"
!displayWord.includes("_") ist = true.
Das Spiel zeigt die Nachricht: "You won! 🎉".
*/

// ------------------------------------------------------------------------------

/*
zu 4.
Erklärung "function handleGuess(event)":
- verarbeitet das Klicken eines Buchstabens:
  - prüft, ob der Buchstabe im Wort enthalten ist
  - aktualisiert den Spielstatus basierend auf dem Ergebnis:
    - richtig geraten -> Wortanzeige aktualisieren
    - falsch geraten -> Anzahl der Fehler erhöhen und prüfen, ob das Spiel verloren ist

Erklärung der einzelnen Schritte:
1. const letter = event.target.textContent;
- event repräsentiert das Ereignis des Klickens
- event.target ist das HTML-Element, das geklickt wurde (Button mit den Buchstaben)
- .textContent liest den Text des Buttons (also den Buchstaben).

Beispiel:
1. <button>a</button> wurde geklickt.
   event.target.textContent ergibt "a".
   Der Buchstabe wird in der Variablen "letter" gespeichert.

2. event.target.disabled = true;
   - der geklickte Button wird deaktiviert (disabled = true) = nicht mehr anklickbar

3. if (selectedWord.includes(letter))
   - prüft, ob der geklickte Buchstabe (letter) im Wort (selectedWord) enthalten ist

4. Buchstabe ist korrekt (im Wort enthalten):
guessedLetters.push(letter):
 - der Buchstabe wird der Liste guessedLetters hinzugefügt (eine Liste der bisher korrekt geratenen Buchstaben).

updateWordDisplay();:
- die Funktion updateWordDisplay() wird aufgerufen, um die Darstellung des Wortes
  im Spiel zu aktualisieren. Zeigt die neu aufgedeckten Buchstaben an.

5. Buchstabe ist falsch (nicht in selectedWord enthalten):
wrongGuesses++:
 - die Anzahl der falschen Versuche (wrongGuesses) wird um 1 erhöht.

failsDisplay.textContent:
 - die Anzeige der Fehler wird aktualisiert (z. B. FAILS: 2 / 5).

6. Spiel verloren (zu viele falsche Versuche):
if (wrongGuesses >= maxWrongGuesses):
- wenn die Anzahl der falschen Versuche (wrongGuesses) die erlaubte Anzahl (maxWrongGuesses)
  erreicht oder überschreitet, ist das Spiel verloren.

Spiel verloren – Aktionen:
setTimeout:
- nach 100 Millisekunden wird eine Nachricht angezeigt (alert), die das Spielende und
  das richtige Wort anzeigt.
setTimeout gibt dem Spieler eine kurze Zeit, um die letzte Darstellung zu sehen,
bevor der Alert erscheint

letterButtons.forEach(...):
- alle Buchstaben-Buttons werden deaktiviert, sodass keine weiteren Eingaben möglich
  sind

Zusammenfassung der Funktion:
Der Benutzer klickt auf einen Buchstaben-Button.
Der Buchstabe wird geprüft:
Falls richtig: Der Buchstabe wird aufgedeckt.
Falls falsch: Die Fehleranzahl wird erhöht.
Bei zu vielen Fehlern wird das Spiel beendet und eine Nachricht angezeigt.

Beispiel:
Ausgangszustand:
selectedWord = "katzi"
guessedLetters = []
wrongGuesses = 0
maxWrongGuesses = 5
Benutzer klickt auf a:
letter = "a"
selectedWord.includes("a") -> true
Aktionen:
guessedLetters.push("a") -> guessedLetters = ["a"]
updateWordDisplay() zeigt: _ a _ _ _
Benutzer klickt auf x:
letter = "x"
selectedWord.includes("x") -> false
Aktionen:
wrongGuesses++ -> wrongGuesses = 1
failsDisplay.textContent zeigt: FAILS: 1 / 5
*/
