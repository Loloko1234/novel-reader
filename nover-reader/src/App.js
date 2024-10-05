import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/scrape", {
        url,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Failed to scrape the URL" });
    }
    setLoading(false);
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
