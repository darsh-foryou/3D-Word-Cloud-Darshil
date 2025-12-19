import { useState } from "react";
import WordCloud3D from "./components/WordCloud3D";
import { analyzeArticle } from "./api";
import type { WordItem } from "./api";

export default function App() {
  const [url, setUrl] = useState(
    "https://en.wikipedia.org/wiki/Artificial_intelligence"
  );
  const [words, setWords] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setWords([]);
    try {
      const result = await analyzeArticle(url);
      setWords(result);
    } catch {
      setError("Failed to analyze article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">3D News Topic Cloud</h1>

      <div className="search-bar-wrapper">
        <div className="search-bar">
          <input
            className="search-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a news article URL…"
          />
          <button className="search-button" onClick={handleAnalyze}>
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="cloud-wrapper">
        {words.length > 0 && <WordCloud3D words={words} />}
      </div>
    </div>
  );
}
