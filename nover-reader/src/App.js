import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [url, setUrl] = useState(
    "https://novelbin.com/b/im-the-king-of-technology/chapter-1"
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chapterNumber, setChapterNumber] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchChapter(url);
  };

  const fetchChapter = async (chapterUrl) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/scrape", {
        url: chapterUrl,
      });
      setResult(response.data);
      setUrl(chapterUrl);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Failed to scrape the URL" });
    }
    setLoading(false);
  };

  const changeChapter = (increment) => {
    const newChapterNumber = chapterNumber + increment;
    if (newChapterNumber > 0) {
      setChapterNumber(newChapterNumber);
      const newUrl = `https://novelbin.com/b/im-the-king-of-technology/chapter-${newChapterNumber}`;
      fetchChapter(newUrl);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter the URL of the novelbin chapter to scrape"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Scraping..." : "Scrape"}
        </button>
      </form>
      <div className="navigation">
        <button onClick={() => changeChapter(-1)} disabled={chapterNumber <= 1}>
          Previous Chapter
        </button>
        <span>Chapter {chapterNumber}</span>
        <button onClick={() => changeChapter(1)}>Next Chapter</button>
      </div>
      {result && (
        <div className="result">
          {result.error ? (
            <p className="error">{result.error}</p>
          ) : (
            <>
              {result.chapters.map((chapter, index) => (
                <h1 key={index}>{chapter}</h1>
              ))}
              {result.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
