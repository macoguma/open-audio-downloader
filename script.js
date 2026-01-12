const queue = [];
const allowed = /\.(mp3|wav|ogg)$/i;

const audioInput = document.getElementById("audioUrl");
const queueList = document.getElementById("queue");
const status = document.getElementById("status");
const player = document.getElementById("player");
const themeToggle = document.getElementById("themeToggle");

document.getElementById("addBtn").onclick = () => {
  const url = audioInput.value.trim();

  if (!allowed.test(url)) {
    status.textContent = "❌ Only direct MP3, WAV or OGG links allowed.";
    return;
  }

  queue.push(url);
  renderQueue();
  preview(url);
  audioInput.value = "";
  status.textContent = "✅ Added to queue.";
};

document.getElementById("downloadAll").onclick = () => {
  if (!queue.length) {
    status.textContent = "⚠️ Queue is empty.";
    return;
  }

  queue.forEach(url => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  status.textContent = "⬇️ Downloads started.";
};

function renderQueue() {
  queueList.innerHTML = "";
  queue.forEach((url, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${url}`;
    queueList.appendChild(li);
  });
}

function preview(url) {
  player.src = url;
  player.hidden = false;
}

themeToggle.onclick = () => {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
  themeToggle.textContent =
    document.body.classList.contains("dark") ? "🌙" : "☀️";
};
