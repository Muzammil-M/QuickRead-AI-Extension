from flask import Flask, request, jsonify
from transformers import pipeline, AutoTokenizer
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs

app = Flask(__name__)

summarizer = pipeline("summarization")
tokenizer = AutoTokenizer.from_pretrained("sshleifer/distilbart-cnn-12-6")

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.get_json()
    content = data.get("content", "").strip()
    mode = data.get("mode", "tldr")

    if not content:
        return jsonify({"error": "No content to summarize"}), 400

    try:
        trimmed = tokenizer(content, return_tensors="pt", max_length=1024, truncation=True)
        decoded = tokenizer.decode(trimmed["input_ids"][0], skip_special_tokens=True)

        if mode == "headline":
            max_len, min_len = 20, 5
        elif mode == "bullet":
            max_len, min_len = 100, 40
        elif mode == "detailed":
            max_len, min_len = 180, 80
        else:
            max_len, min_len = 60, 30

        summary = summarizer(decoded, max_length=max_len, min_length=min_len, do_sample=False)
        return jsonify({"summary": summary[0]['summary_text']})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/youtube", methods=["POST"])
def summarize_youtube():
    data = request.get_json()
    url = data.get("url", "")
    mode = data.get("mode", "tldr")

    try:
        parsed_url = urlparse(url)
        query = parse_qs(parsed_url.query)
        video_id = query.get("v", [None])[0]

        if not video_id:
            return jsonify({"error": "Invalid YouTube URL"}), 400

        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        full_text = " ".join([entry["text"] for entry in transcript])

        trimmed = tokenizer(full_text, return_tensors="pt", max_length=1024, truncation=True)
        decoded = tokenizer.decode(trimmed["input_ids"][0], skip_special_tokens=True)

        if mode == "headline":
            max_len, min_len = 20, 5
        elif mode == "bullet":
            max_len, min_len = 100, 40
        elif mode == "detailed":
            max_len, min_len = 180, 80
        else:
            max_len, min_len = 100, 50

        summary = summarizer(decoded, max_length=max_len, min_length=min_len, do_sample=False)
        return jsonify({"summary": summary[0]['summary_text']})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=8000)
