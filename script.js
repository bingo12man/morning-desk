const categoryData = {
  courage: { title: "Courage", icon: "💗" },
  joy: { title: "Joy", icon: "⭐" },
  luck: { title: "Luck", icon: "🍀" },
  calm: { title: "Calm", icon: "☁️" },
  focus: { title: "Focus", icon: "🌸" }
};

let messages = {};

const today = new Date().toISOString().slice(0, 10);
const saved = JSON.parse(localStorage.getItem("evelynDesk")) || {};

let state = saved.date === today
  ? saved
  : {
      date: today,
      opened: [],
      emergencyUsed: false
    };

const messageCard = document.getElementById("messageCard");
const messageIcon = document.getElementById("messageIcon");
const messageTitle = document.getElementById("messageTitle");
const messageText = document.getElementById("messageText");
const closeMessage = document.getElementById("closeMessage");
const emergencyBtn = document.getElementById("emergencyBtn");

function saveState() {
  localStorage.setItem("evelynDesk", JSON.stringify(state));
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function showMessage(icon, title, text) {
  messageIcon.textContent = icon;
  messageTitle.textContent = title;
  messageText.textContent = text;
}

function updateUI() {
  document.querySelectorAll(".drawer").forEach(button => {
    const category = button.dataset.category;

    if (state.opened.includes(category)) {
      button.disabled = true;
      button.innerHTML = `
        <span class="top-icon">✅</span>
        <span class="label">Opened</span>
        <span class="knob"></span>
      `;
    }
  });

  if (state.emergencyUsed) {
    emergencyBtn.disabled = true;
    emergencyBtn.innerHTML = `
      🚨 Emergency Used
      <small>Come back tomorrow</small>
    `;
  }
}

document.querySelectorAll(".drawer").forEach(button => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;

    if (state.opened.includes(category)) return;

    const item = categoryData[category];
    const text = randomFrom(messages[category]);

    state.opened.push(category);
    saveState();
    updateUI();

    showMessage(item.icon, item.title, text);
  });
});

emergencyBtn.addEventListener("click", () => {
  if (state.emergencyUsed) return;

  state.emergencyUsed = true;
  saveState();
  updateUI();

  showMessage(
    "🚨",
    "Emergency Drawer",
    "Dear Evelyn,\n\nThis is your reminder that even on bad days, you are still someone’s favorite person.\n\nTake a breath. You don’t have to win the whole day at once.\n\n-K"
  );
});

closeMessage.addEventListener("click", () => {
  showMessage(
    "🌸",
    "Welcome",
    "Pick one drawer below whenever you need a little light."
  );
});

fetch("messages.json?v=" + Date.now())
  .then(res => res.json())
  .then(data => {
    messages = data;
    updateUI();
  })
  .catch(() => {
    messages = {
      courage: [
        "En Chellom,\n\nIn case nobody reminded you today: you're much stronger than you give yourself credit for.\n\n-K"
      ],
      joy: [
        "En Chellom,\n\nYour laugh is probably someone’s favorite sound.\n\n-K"
      ],
      luck: [
        "En Chellom,\n\nLuck has been informed that Evelyn is awake. It should arrive shortly.\n\n-K"
      ],
      calm: [
        "En Chellom,\n\nTake one slow breath. You don’t have to solve the whole day right now.\n\n-K"
      ],
      focus: [
        "En Chellom,\n\nPick one thing. Do that thing. Declare victory.\n\n-K"
      ]
    };
    updateUI();
  });
