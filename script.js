const JAMENDO_CLIENT_ID = "7c801a96";

const artistsEl = document.getElementById("artists");
const resultsEl = document.getElementById("results");
const statusEl = document.getElementById("status");
const backBtn = document.getElementById("backBtn");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let currentPage = 1;
let lastQuery = "";

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Theme
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
};

// Popular artists
const popularArtists = [
  "Kevin MacLeod",
  "Jahzzar",
  "Kai Engel",
  "Chris Zabriskie",
  "Broke For Free",
  "Scott Holmes"
];

popularArtists.forEach(name => {
  const d = document.createElement("div");
  d.className = "artist-card";
  d.textContent = name;
  d.onclick = () => {
    document.getElementById("searchInput").value = name;
    searchTracks(true);
  };
  artistsEl.appendChild(d);
});

async function searchTracks(reset = true) {
  const q = document.getElementById("searchInput").value.trim();
  const genre = document.getElementById("genreSelect").value;
  const country = document.getElementById("countrySelect").value;

  if (reset) {
    currentPage = 1;
    resultsEl.innerHTML = "";
  }

  lastQuery = q;
  backBtn.style.display = "block";
  statusEl.textContent = "Loading tracks…";

  let url = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=12&offset=${(currentPage-1)*12}`;

  if (q) url += `&search=${encodeURIComponent(q)}`;
  if (genre) url += `&tags=${genre}`;
  if (country) url += `&artist_location=${country}`;

  const res = await fetch(url);
  const data = await res.json();

  statusEl.textContent = "";
  if (!data.results.length && reset) {
    statusEl.textContent = "No results found.";
    return;
  }

  renderTracks(data.results);
  loadMoreBtn.style.display = data.results.length === 12 ? "block" : "none";
}

function renderTracks(tracks) {
  tracks.forEach(t => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${t.name}</h3>
      <small>${t.artist_name}</small>
      <audio controls src="${t.audio}"></audio>
      <a href="${t.audio}" download>⬇ Download MP3</a>
      <p><small>${t.license_ccurl}</small></p>
    `;
    resultsEl.appendChild(div);
  });
}

function loadMore() {
  currentPage++;
  searchTracks(false);
}

function goBack() {
  resultsEl.innerHTML = "";
  backBtn.style.display = "none";
  loadMoreBtn.style.display = "none";
  statusEl.textContent = "";
}
