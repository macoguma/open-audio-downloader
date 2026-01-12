const featuredArtists = [
  "Broke For Free",
  "Chris Zabriskie",
  "Kevin MacLeod",
  "Kai Engel",
  "Lee Rosevere",
  "Podington Bear",
  "Scott Holmes Music",
  "Silent Partner",
  "Unminus",
  "Jahzzar"
].sort();

const artistListDiv = document.getElementById("artistList");
const resultsDiv = document.getElementById("results");
const statusDiv = document.getElementById("status");
const backBtn = document.getElementById("backBtn");
const artistsSection = document.getElementById("artistsSection");

featuredArtists.forEach(artist => {
  const btn = document.createElement("button");
  btn.textContent = artist;
  btn.onclick = () => searchArtist(artist);
  artistListDiv.appendChild(btn);
});

async function searchArtist(forcedArtist) {
  const artist = forcedArtist || document.getElementById("artistInput").value.trim();
  if (!artist) return alert("Enter or select an artist");

  artistsSection.style.display = "none";
  backBtn.classList.remove("hidden");
  statusDiv.textContent = "Searching free audio…";
  resultsDiv.innerHTML = "";

  const query = `creator:"${artist}" AND mediatype:audio`;
  const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier&fl[]=title&fl[]=creator&rows=20&output=json`;

  const res = await fetch(url);
  const data = await res.json();

  statusDiv.textContent = "";

  data.response.docs.forEach(item => {
    const div = document.createElement("div");
    div.className = "result-item";
    div.innerHTML = `
      <strong>${item.title || "Untitled Collection"}</strong><br>
      Artist: ${item.creator || "Unknown"}<br>
      <button onclick="loadTracks('${item.identifier}')">View tracks</button>
    `;
    resultsDiv.appendChild(div);
  });
}

async function loadTracks(identifier) {
  statusDiv.textContent = "Loading tracks…";
  resultsDiv.innerHTML = "";

  const res = await fetch(`https://archive.org/metadata/${identifier}`);
  const data = await res.json();

  statusDiv.textContent = "";

  data.files
    .filter(f => f.format && (f.format.includes("MP3") || f.format.includes("OGG") || f.format.includes("FLAC")))
    .forEach(file => {
      const url = `https://archive.org/download/${identifier}/${file.name}`;
      const div = document.createElement("div");
      div.className = "result-item";
      div.innerHTML = `
        🎵 ${file.name}<br>
        <audio controls src="${url}"></audio><br>
        <a href="${url}" download>Download (${file.format})</a>
      `;
      resultsDiv.appendChild(div);
    });
}

function goBack() {
  resultsDiv.innerHTML = "";
  statusDiv.textContent = "";
  artistsSection.style.display = "block";
  backBtn.classList.add("hidden");
}

// Theme toggle
const toggleBtn = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") document.body.classList.add("light");

toggleBtn.onclick = () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
};

// Auto year
document.getElementById("year").textContent = new Date().getFullYear();
