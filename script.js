const JAMENDO_CLIENT_ID = "7c801a96";

const results = document.getElementById("results");
const statusEl = document.getElementById("status");
const backBtn = document.getElementById("backBtn");
const themeToggle = document.getElementById("themeToggle");

let historyStack = [];

document.getElementById("year").textContent = new Date().getFullYear();

// THEME
themeToggle.onclick = () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
};
if (localStorage.getItem("theme") === "light") document.body.classList.add("light");

// SEARCH
async function search() {
  const q = document.getElementById("searchInput").value.trim();
  if (!q) return;

  backBtn.style.display = "block";
  statusEl.textContent = "Searching Jamendo…";
  results.innerHTML = "";

  historyStack.push(results.innerHTML);

  const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=20&search=${encodeURIComponent(q)}&include=musicinfo`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.results.length) {
    statusEl.textContent = "No results found.";
    return;
  }

  statusEl.textContent = "";
  renderTracks(data.results);
}

// RENDER
function renderTracks(tracks) {
  results.innerHTML = "";
  tracks.forEach(t => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${t.image}" alt="">
      <h3>${t.name}</h3>
      <small>${t.artist_name}</small>
      <audio controls src="${t.audio}"></audio>
      <a class="download" href="${t.audio}" download>⬇ Download MP3</a>
      <p><small>License: ${t.license_ccurl}</small></p>
    `;

    results.appendChild(div);
  });
}

// BACK
function goBack() {
  results.innerHTML = historyStack.pop() || "";
  if (!historyStack.length) backBtn.style.display = "none";
}
