async function searchArtist() {
  const artist = document.getElementById("artistInput").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!artist) {
    alert("Please enter an artist name.");
    return;
  }

  resultsDiv.innerHTML = "Searching for free audio…";

  const query = `creator:"${artist}" AND mediatype:audio`;
  const url =
    `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}` +
    `&fl[]=identifier&fl[]=title&fl[]=creator&rows=20&page=1&output=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.response.docs.length) {
      resultsDiv.innerHTML = "No free audio found for this artist.";
      return;
    }

    resultsDiv.innerHTML = "";

    data.response.docs.forEach(item => {
      const div = document.createElement("div");
      div.className = "result-item";

      div.innerHTML = `
        <strong>${item.title || "Untitled Collection"}</strong><br>
        Artist: ${item.creator || "Unknown"}<br>
        <button onclick="loadTracks('${item.identifier}')">
          View & Download Tracks
        </button>
      `;

      resultsDiv.appendChild(div);
    });

  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = "Error fetching results.";
  }
}

async function loadTracks(identifier) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "Loading tracks…";

  try {
    const response = await fetch(`https://archive.org/metadata/${identifier}`);
    const data = await response.json();

    const audioFiles = data.files.filter(file =>
      file.format && file.format.toLowerCase().includes("mp3")
    );

    if (!audioFiles.length) {
      resultsDiv.innerHTML = "No downloadable MP3 files found.";
      return;
    }

    resultsDiv.innerHTML = "";

    audioFiles.forEach(file => {
      const fileUrl = `https://archive.org/download/${identifier}/${file.name}`;

      const div = document.createElement("div");
      div.className = "result-item";

      div.innerHTML = `
        🎵 ${file.name}<br>
        <audio controls src="${fileUrl}"></audio><br>
        <a href="${fileUrl}" download>Download</a>
      `;

      resultsDiv.appendChild(div);
    });

  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = "Error loading tracks.";
  }
}

// Auto-update copyright year
document.getElementById("year").textContent = new Date().getFullYear();
