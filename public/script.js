// Get base URL dynamically
const getBaseUrl = () => {
  return window.location.origin;
};

// Copy to clipboard function
function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  const text = element.textContent;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      // Show success feedback
      const btn = event.target;
      const originalText = btn.textContent;
      btn.textContent = "✓ Copied!";
      btn.style.background = "#4caf50";

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
      alert("Failed to copy to clipboard");
    });
}

// Display output in test console
function displayOutput(data, type = "info") {
  const console = document.getElementById("testConsole");
  const output = document.createElement("div");
  output.className = `console-output console-${type}`;

  if (typeof data === "object") {
    output.textContent = JSON.stringify(data, null, 2);
  } else {
    output.textContent = data;
  }

  // Remove placeholder if exists
  const placeholder = console.querySelector(".console-placeholder");
  if (placeholder) {
    placeholder.remove();
  }

  console.appendChild(output);
  console.scrollTop = console.scrollHeight;
}

// Test endpoint function
async function testEndpoint(method, path) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}`;

  displayOutput(`\n→ Testing ${method} ${path}...`, "info");

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      displayOutput(`✓ Success (${response.status}):`, "success");
      displayOutput(data, "success");
    } else {
      displayOutput(`✗ Error (${response.status}):`, "error");
      displayOutput(data, "error");
    }
  } catch (error) {
    displayOutput(`✗ Request Failed:`, "error");
    displayOutput(error.message, "error");
  }
}

// Test create game function
async function testCreateGame() {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/games`;

  const sampleGame = {
    title: "Elden Ring",
    genre: "Action RPG",
    platform: "PlayStation 5",
    releaseYear: 2022,
    publisher: "Bandai Namco",
    rating: 9.2,
    description: "An epic dark fantasy action RPG developed by FromSoftware",
  };

  displayOutput(`\n→ Testing POST /api/games...`, "info");
  displayOutput(`Request Body:`, "info");
  displayOutput(sampleGame, "info");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sampleGame),
    });

    const data = await response.json();

    if (response.ok) {
      displayOutput(
        `✓ Game Created Successfully (${response.status}):`,
        "success"
      );
      displayOutput(data, "success");
      displayOutput(
        `\nℹ️ Save this ID to test UPDATE and DELETE: ${data.data._id}`,
        "info"
      );
    } else {
      displayOutput(`✗ Error (${response.status}):`, "error");
      displayOutput(data, "error");
    }
  } catch (error) {
    displayOutput(`✗ Request Failed:`, "error");
    displayOutput(error.message, "error");
  }
}

// Test create review function
async function testCreateReview() {
  const baseUrl = getBaseUrl();

  // First, get a game ID
  displayOutput(`\n→ Fetching a game to review...`, "info");

  try {
    const gamesResponse = await fetch(`${baseUrl}/api/games`);
    const gamesData = await gamesResponse.json();

    if (!gamesData.data || gamesData.data.length === 0) {
      displayOutput(`✗ No games found. Please create a game first!`, "error");
      return;
    }

    const gameId = gamesData.data[0]._id;
    displayOutput(`✓ Found game: ${gamesData.data[0].title}`, "success");

    const sampleReview = {
      gameId: gameId,
      reviewerName: "John Gamer",
      rating: 5,
      comment:
        "Amazing gameplay and stunning graphics! One of the best games I've ever played.",
    };

    displayOutput(`\n→ Testing POST /api/reviews...`, "info");
    displayOutput(`Request Body:`, "info");
    displayOutput(sampleReview, "info");

    const response = await fetch(`${baseUrl}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sampleReview),
    });

    const data = await response.json();

    if (response.ok) {
      displayOutput(
        `✓ Review Created Successfully (${response.status}):`,
        "success"
      );
      displayOutput(data, "success");
    } else {
      displayOutput(`✗ Error (${response.status}):`, "error");
      displayOutput(data, "error");
    }
  } catch (error) {
    displayOutput(`✗ Request Failed:`, "error");
    displayOutput(error.message, "error");
  }
}

// Clear console function
function clearConsole() {
  const console = document.getElementById("testConsole");
  console.innerHTML =
    '<p class="console-placeholder">Test results will appear here...</p>';
}

// Add clear button to console
document.addEventListener("DOMContentLoaded", () => {
  const testConsole = document.getElementById("testConsole");
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "Clear Console";
  clearBtn.className = "copy-btn";
  clearBtn.style.marginTop = "10px";
  clearBtn.onclick = clearConsole;
  testConsole.parentElement.appendChild(clearBtn);

  // Update base URL display
  const baseUrlElement = document.getElementById("baseUrl");
  if (baseUrlElement) {
    baseUrlElement.textContent = `${getBaseUrl()}/api`;
  }
});
