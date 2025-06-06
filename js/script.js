// Fonction utilitaire pour afficher un écran et cacher les autres
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });

    const target = document.getElementById(screenId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
}

// Quand la page est chargée
window.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');

    startBtn.addEventListener('click', () => {
        // Affiche l'étape suivante : "fragmentation"
        showScreen('fragmentation-screen');
    });
});

// Étape Fragmentation
const correctWord = "EXISTER";
let currentWord = "";
let clickedLetters = [];

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function setupFragmentation() {
    const container = document.getElementById("fragment-container");
    const assembled = document.getElementById("assembled-word");
    const validateBtn = document.getElementById("fragment-validate");

    // Reset
    currentWord = "";
    clickedLetters = [];
    container.innerHTML = "";
    assembled.innerText = "";
    validateBtn.classList.add("hidden");

    const letters = correctWord.split("");
    const shuffled = shuffleArray([...letters]);

    shuffled.forEach((letter, index) => {
        const span = document.createElement("span");
        span.classList.add("fragment-letter");
        span.innerText = letter;
        span.dataset.index = index;

        span.addEventListener("click", () => {
            if (!clickedLetters.includes(index)) {
                clickedLetters.push(index);
                currentWord += letter;
                assembled.innerText = currentWord;

                // Optionnel : désactiver la lettre visuellement
                span.style.opacity = "0.3";
                span.style.pointerEvents = "none";

                if (currentWord.length === correctWord.length) {
                    validateBtn.classList.remove("hidden");
                }
            }
        });

        container.appendChild(span);
    });

    validateBtn.addEventListener("click", () => {
        if (currentWord === correctWord) {
            showScreen("memory-screen"); // passe à l'étape suivante
            showMemoryQuestion();        // <<< cette ligne manquait
        } else {
            assembled.innerText = "❌ Erreur. Recommence.";
            setTimeout(setupFragmentation, 1500); // reset après erreur
        }
    });

}

// Démarrage quand on clique sur "Commencer"
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-btn").addEventListener("click", () => {
        showScreen("fragmentation-screen");
        setupFragmentation();
    });
});

// Questions mémoire (informatique + humaine)
const memoryQuestions = [
    {
        text: "Laquelle de ces mémoires est volatile, utilisée en temps réel par l’ordinateur ?",
        choices: ["ROM", "RAM", "Mémoire Flash", "Cache disque"],
        correct: "RAM"
    },
    {
        text: "Quelle mémoire humaine retient des informations pendant quelques secondes seulement ?",
        choices: ["Mémoire épisodique", "Mémoire de travail", "Mémoire à long terme", "Mémoire sensorielle"],
        correct: "Mémoire sensorielle"
    },
    {
        text: "Quelle mémoire stocke le système d’exploitation de manière permanente ?",
        choices: ["RAM", "Disque dur", "Mémoire vive", "ROM"],
        correct: "ROM"
    },
    {
        text: "Quel type de mémoire humaine est liée aux souvenirs autobiographiques ?",
        choices: ["Mémoire sémantique", "Mémoire procédurale", "Mémoire épisodique", "Mémoire réflexe"],
        correct: "Mémoire épisodique"
    }
];

let currentQuestionIndex = 0;

function showMemoryQuestion() {
    const container = document.getElementById("question-container");
    container.innerHTML = ""; // clear

    const q = memoryQuestions[currentQuestionIndex];

    const questionEl = document.createElement("div");
    questionEl.classList.add("question-text");
    questionEl.innerText = q.text;
    container.appendChild(questionEl);

    q.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.classList.add("choice");
        btn.innerText = choice;

        btn.addEventListener("click", () => {
            if (choice === q.correct) {
                btn.classList.add("correct");
                setTimeout(() => {
                    currentQuestionIndex++;
                    if (currentQuestionIndex < memoryQuestions.length) {
                        showMemoryQuestion();
                    } else {
                        showScreen("loop-screen"); // Étape suivante
                    }
                }, 700);
            } else {
                btn.classList.add("wrong");
                btn.disabled = true;
            }
        });

        container.appendChild(btn);
    });
}

const finalCodeInput = document.getElementById("final-code");
const validateBtn = document.getElementById("validate-btn");


validateBtn.addEventListener("click", () => {
    const value = finalCodeInput.value.trim().toUpperCase();

    if (value === correctWord) {
        const loopScreen = document.getElementById("loop-screen");
        const reactivationScreen = document.getElementById("reactivation-screen");

        // Affiche déjà l'écran final en arrière-plan
        reactivationScreen.classList.remove("hidden");
        reactivationScreen.style.zIndex = "0";
        reactivationScreen.style.position = "absolute";
        reactivationScreen.style.top = "0";
        reactivationScreen.style.left = "0";
        reactivationScreen.style.width = "100%";
        reactivationScreen.style.height = "100%";
        reactivationScreen.style.display = "flex";
        reactivationScreen.style.opacity = "0"; // on le fade-in ensuite

        // Applique l'animation de chute sur tous les éléments
        const elements = loopScreen.querySelectorAll("h2, p, input, button");
        elements.forEach(el => {
            el.style.animation = "fall-apart 1.5s forwards";
        });

        // Après animation : cache la page actuelle, et révèle la dernière proprement
        setTimeout(() => {
            loopScreen.classList.remove("active");
            loopScreen.classList.add("hidden");

            reactivationScreen.style.opacity = "1";
            reactivationScreen.style.zIndex = "1";
            reactivationScreen.classList.add("active");
        }, 1600);
    } else {
        finalCodeInput.value = "";
        finalCodeInput.placeholder = "Faux. Essaie encore...";
        finalCodeInput.style.borderColor = "#a00";
    }
});


document.getElementById("restart-btn").addEventListener("click", () => {
    window.location.href = "404.html";
});
