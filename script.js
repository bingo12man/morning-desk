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
  messageCard.classList.add("show");
}

function updateUI() {
  document.querySelectorAll(".drawer").forEach(button => {
    const category = button.dataset.category;

    if (state.opened.includes(category)) {
      button.disabled = true;
      button.innerHTML = `
        <span class="icon">✅</span>
        <span>Opened</span>
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
    "Dear Evelyn,\n\nThis is your reminder that bad days eventually become stories.\n\nKeep going. You are doing better than you think. 💛"
  );
});

closeMessage.addEventListener("click", () => {
  showMessage(
    "🌸",
    "Welcome, Evelyn!",
    "Pick one drawer below whenever you need a little note just for you. ✨"
  );
});

fetch("messages.json")
  .then(res => res.json())
  .then(data => {
    messages = data;
    updateUI();
  })
  .catch(() => {
    messages = {
      calm: ["Take one slow breath. The whole day does not need to be solved right now."],
      joy: ["Somewhere in the world, a dog is having the best day ever."],
      courage: ["You have survived every hard day so far."],
      luck: ["Something tiny and good may find you today."],
      focus: ["Do only the next small thing. That is enough."]
    };
    updateUI();
  });
