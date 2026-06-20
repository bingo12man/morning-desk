const DAILY_LIMIT = 5;

const categoryTitles = {
  courage: "💗 Courage",
  joy: "⭐ Joy",
  luck: "🍀 Luck",
  calm: "☁️ Calm",
  focus: "🌸 Focus"
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

const picksLeftEl = document.getElementById("picksLeft");
const modal = document.getElementById("modal");
const messageTitle = document.getElementById("messageTitle");
const messageText = document.getElementById("messageText");
const closeModal = document.getElementById("closeModal");
const emergencyBtn = document.getElementById("emergencyBtn");

function saveState() {
  localStorage.setItem("evelynDesk", JSON.stringify(state));
}

function updateUI() {
  picksLeftEl.textContent = state.picksLeft;

  document.querySelectorAll(".drawer").forEach(button => {
    button.disabled = state.picksLeft <= 0;
  });

  emergencyBtn.disabled = state.emergencyUsed;
  emergencyBtn.textContent = state.emergencyUsed
    ? "🚨 Emergency Drawer Used"
    : "🚨 Emergency Drawer";
}

function showMessage(title, text) {
  messageTitle.textContent = title;
  messageText.textContent = text;
  modal.classList.remove("hidden");
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

document.querySelectorAll(".drawer").forEach(button => {
  button.addEventListener("click", () => {
    if (state.picksLeft <= 0) {
      showMessage("🌙 Desk Closed", "Your five picks are done for today. Come back tomorrow, Evelyn.");
      return;
    }

    const category = button.dataset.category;
    const text = randomFrom(messages[category]);

    state.picksLeft -= 1;
    saveState();
    updateUI();

    showMessage(categoryTitles[category], text);
  });
});

emergencyBtn.addEventListener("click", () => {
  if (state.emergencyUsed) return;

  state.emergencyUsed = true;
  saveState();
  updateUI();

  showMessage(
    "🚨 Emergency Drawer",
    "Dear Evelyn,\n\nThis is your reminder that bad days eventually become stories.\n\nKeep going. You are doing better than you think. 💛"
  );
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
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
