import React, { useState, useEffect } from "react";

const Tips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTips = async () => {
      try {
        const res = await fetch("/tips/list.json");
        const list = await res.json();

        const tipsData = await Promise.all(
          list.sort().map(async (file) => {
            const response = await fetch(`/tips/${file}`);
            const text = await response.text();
            return { file, text };
          })
        );

        setTips(tipsData);
      } catch (err) {
        console.error("Failed to load tips:", err);
        setError("Could not load tips. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadTips();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-green-700">🌾 Farm Tips</h2>

      {loading && <p className="text-gray-500">Loading tips...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && tips.length === 0 && (
        <p className="text-gray-600">No tips available at the moment.</p>
      )}

      {tips.map(({ file, text }) => (
        <div
          key={file}
          className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md"
        >
          <h3 className="text-lg font-semibold text-indigo-700 mb-2">
            {file.replace(".md", "").replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
          </h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-800">{text}</pre>
        </div>
      ))}
    </div>
  );
};

export default Tips;
