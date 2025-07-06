document.getElementById("summarize-btn").addEventListener("click", async () => {
  const youtubeURL = document.getElementById("youtube-url")?.value.trim();
  const mode = document.getElementById("summary-mode")?.value || "tldr";

  if (youtubeURL) {
    try {
      const response = await fetch("http://127.0.0.1:8000/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeURL, mode })
      });

      const data = await response.json();
      document.getElementById("result").innerText = data.summary || `❌ ${data.error}`;
    } catch (error) {
      document.getElementById("result").innerText = `🚫 Error: ${error.message}`;
    }

    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        const possibleContent = document.querySelector("article, main, [role='main']");
        let text = possibleContent ? possibleContent.innerText : document.body.innerText;
        return text.replace(/\s+/g, " ").trim();
      }
    },
    async (injectionResults) => {
      const content = injectionResults[0]?.result || "";

      if (!content || content.length < 100) {
        document.getElementById("result").innerText = "⚠️ Not enough readable content on this page.";
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, mode })
        });

        const data = await response.json();
        document.getElementById("result").innerText = data.summary || `❌ ${data.error}`;
      } catch (error) {
        document.getElementById("result").innerText = `🚫 Error: ${error.message}`;
      }
    }
  );
});

document.getElementById("read-btn").addEventListener("click", () => {
  const summaryText = document.getElementById("result").innerText;
  if (!summaryText || summaryText.includes("Click the button") || summaryText.includes("⚠️")) {
    alert("No summary available to read aloud!");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(summaryText);
  speechSynthesis.speak(utterance);
});

document.getElementById("download-btn").addEventListener("click", () => {
  const summaryText = document.getElementById("result").innerText;

  if (!summaryText || summaryText.includes("Click the button") || summaryText.includes("⚠️")) {
    alert("No summary available to download!");
    return;
  }

  const blob = new Blob([summaryText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "summary.txt";
  a.click();

  URL.revokeObjectURL(url);
});

const toggle = document.getElementById("dark-toggle");
const body = document.body;

if (localStorage.getItem("darkMode") === "true") {
  body.classList.add("dark");
  toggle.checked = true;
}

toggle.addEventListener("change", () => {
  if (toggle.checked) {
    body.classList.add("dark");
    localStorage.setItem("darkMode", "true");
  } else {
    body.classList.remove("dark");
    localStorage.setItem("darkMode", "false");
  }
});
