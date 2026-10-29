// Words array

const words = [
  "berlin",
  "paris",
  "london",
  "rom",
  "madrid",
  "wien",
  "prag",
  "oslo",
  "bern",
  "tokio",
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
const newGameButton = document.querySelector(".newgame"); // Zugriff auf den Button für ein neues Spiel
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

  // Zufällig eine Hauptstadt auswählen
  selectedWord = words[Math.floor(Math.random() * words.length)];

  // Platzhalter für das neue Wort anzeigen
  activeWord.textContent = (placeholder + " ")
    .repeat(selectedWord.length)
    .trim(); // "Unterstrich-Linie" wird erstellt mit der Länge des zufälligen Wortes (genaue Erklärung siehe unten zu 2.)
  // Fehleranzeige zurücksetzen
  failsDisplay.textContent = `FEHLER: 0 / ${maxWrongGuesses}`;
  // Alle Buchstaben für die neue Spielrunde aktivieren
  letterButtons.forEach((button) => {
    button.disabled = false;
  });
}

// Wortanzeige aktualisieren und Gewinn prüfen
function updateWordDisplay() {
  const displayWord = selectedWord
    .split("")
    .map((letter, index) => {
      if (!guessedLetters.includes(letter)) {
        return placeholder;
      }

      // Den ersten Buchstaben groß anzeigen
      return index === 0 ? letter.toUpperCase() : letter;
    })
    .join(" ");

  activeWord.textContent = displayWord;

  // Gewonnen, wenn keine Unterstriche mehr vorhanden sind
  if (!displayWord.includes(placeholder)) {
    statusDisplay.textContent = "GEWONNEN 🥳";
    statusDisplay.style.color = "green";
    statusDisplay.style.animation = "blink 1s steps(5, end) infinite";

    // Alle Buchstaben-Buttons deaktivieren

    letterButtons.forEach((button) => {
      button.disabled = true;
    });
  }
}

// Buchstabeneingabe verarbeiten und auf Fehler prüfen
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

      // zeigt das korrekte Wort an
      activeWord.textContent =
        selectedWord.charAt(0).toUpperCase() + selectedWord.slice(1);

      letterButtons.forEach((button) => {
        button.disabled = true;
      });
    }
  }
}

// Event-Listener registrieren
letterButtons.forEach((button) =>
  button.addEventListener("click", handleGuess),
);
newGameButton.addEventListener("click", initializeGame);

// Spiel wird inizialisiert - erste Spielrunde starten
initializeGame();
