const categoryData = {
  courage: { title: "Courage", icon: "💗" },
  joy: { title: "Joy", icon: "⭐" },
  luck: { title: "Luck", icon: "🍀" },
  calm: { title: "Calm", icon: "☁️" },
  focus: { title: "Focus", icon: "🌸" }
};

const messages = {
  courage: [
    "En Chellom,\nIn case nobody reminded you today: you're much stronger than you give yourself credit for."
  ],
  joy: [
    "Madam,\nKonjam sirichidu.\n\nThe world is a noticeably nicer place when you're smiling."
  ],
  luck: [
    "Luck has officially been informed that Evelyn is awake.\n\nIt should arrive shortly."
  ],
  calm: [
    "Evelyene,\nInniku ellathayum solve panna vendam.\n\nThe next hour is enough."
  ],
  focus: [
    "Thangome,\nOne small step.\n\nOne small win.\n\nThat's all today's mission is."
  ]
};

const today = new Date().toISOString().slice(0, 10);
const saved = JSON.parse(localStorage.getItem("evelynDesk")) || {};

let state = saved.date === today
  ? saved
  : {
      date: today,
      opened: [],
      emergencyUsed: false
    };

const messageIcon = document.getElementById("messageIcon");
const messageTitle = document.getElementById("messageTitle");
const messageText = document.getElementById("messageText");
const closeMessage = document.getElementById("closeMessage");
const emergencyBtn = document.getElementById("emergencyBtn");

function saveState() {
  localStorage.setItem("evelynDesk", JSON.stringify(state));
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
    const text = messages[category][0];

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
  "Mazhai vandha bhoomi azhagu,\n\nNilavu vandha vaanam azhagu,\n\nNee nadandhu vandha nerathula,\n\nAzhagukkum konjam competition azhagu."
);

closeMessage.addEventListener("click", () => {
  showMessage(
    "🌸",
    "Welcome",
    "Pick one drawer below whenever you need a little light."
  );
});

updateUI();
