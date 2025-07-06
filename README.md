# 🧠 QuickRead – AI Chrome Extension

QuickRead is an intelligent and simple Chrome extension that helps you save time by summarizing the main content of any web page or YouTube video using AI. It supports multiple summary formats including TL;DR, headline, bullet points, and detailed summaries. QuickRead is your personal web content assistant to grasp information faster, whether you're reading articles, blogs, or watching long videos.

---

## 🚀 Features

* 🔍 One-click summarization of current webpage
* ▶️ YouTube video transcription and summarization
* ⚡ Multiple summary formats: TL;DR, Headline, Bullet Points, Detailed
* 🔊 Read summary aloud with built-in text-to-speech
* 📄 Download the summary as a `.txt` file
* 📋 Copy summary to clipboard
* 🌙 Toggle between light and dark mode

---

## 💡 How It Works

QuickRead uses a local Flask backend that leverages the HuggingFace Transformers pipeline to generate summaries. For YouTube links, it uses the YouTube Transcript API to fetch transcripts before summarizing.

---

## 📂 Project Structure

```
QuickRead-AI-Extension/
|
|-- backend/                  # Flask backend
|   |-- app.py                # Handles summarization and YouTube routes
|   |-- requirements.txt      # Dependencies
|
|-- popup.html                # Chrome extension popup UI
|-- popup.js                  # Frontend JavaScript logic
|-- styles.css                # Styling for popup
|-- manifest.json             # Chrome extension config
|-- icon.png                  # Extension icon
```

---

## 🛠️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Muzammil-M/QuickRead-AI-Extension.git
cd QuickRead-AI-Extension
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Ensure Flask is running at `http://127.0.0.1:8000`

### 3. Load Extension into Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top right corner)
3. Click **Load Unpacked**
4. Select the project root folder containing `manifest.json`

---

## 📁 Backend API Endpoints

### `POST /summarize`

Summarizes text content.
**Body**:

```json
{
  "content": "<text>",
  "mode": "tldr" // or headline, bullet, detailed
}
```

### `POST /youtube`

Summarizes a YouTube video by extracting its transcript.
**Body**:

```json
{
  "url": "<YouTube URL>",
  "mode": "tldr"
}
```

---

## 📅 Summary Modes

| Mode     | Description                                  |
| -------- | -------------------------------------------- |
| TL;DR    | Short, concise summary (60-100 words)        |
| Headline | One-line summary capturing the core idea     |
| Bullet   | Key points in list format                    |
| Detailed | In-depth paragraph summary (up to 180 words) |

---

## 🚒 Tech Stack

* **Frontend:** JavaScript, HTML, CSS (Manifest V3)
* **Backend:** Flask, HuggingFace Transformers
* **Model:** `sshleifer/distilbart-cnn-12-6`
* **YouTube Support:** `youtube-transcript-api`

---

## 👤 Author

**Muzammil M**
GitHub: [@Muzammil-M](https://github.com/Muzammil-M)
## Connect

👤 **Muzammil Malick**  
LinkedIn: [Muzammil Malick](https://www.linkedin.com/in/muzammil-malick-288122245/)


---

## 🙌 Contribution

Contributions are welcome. Feel free to fork this repo and submit a pull request with improvements or new features.

---

## ⭐ Acknowledgements

* HuggingFace for their amazing NLP models
* YouTube Transcript API for effortless transcript extraction
* Chrome Extension community for inspiration

---

## 🚀 Future Ideas

* PDF file summarization
* Drag-and-drop text summarization
* Browser history summary generator
* Multi-language summarization
* Save summaries to cloud (Google Drive/Notion)

---


> Thank you for trying out **QuickRead**. If it saves you time, consider starring the repo ⭐
