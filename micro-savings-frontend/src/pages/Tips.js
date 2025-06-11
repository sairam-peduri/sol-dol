import React, { useState, useEffect } from "react";

const Tips = () => {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    fetch("/tips/list.json")
      .then((res) => res.json())
      .then((list) => {
        list.forEach((file) => {
          fetch(`/tips/${file}`)
            .then((r) => r.text())
            .then((text) => {
              setTips((prev) => [...prev, { file, text }]);
            });
        });
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Farm Tips</h2>

      {tips.map((t) => (
        <div
          key={t.file}
          className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md"
        >
          <h3 className="text-lg font-semibold text-indigo-700 mb-2">
            {t.file.replace(".md", "")}
          </h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-800">{t.text}</pre>
        </div>
      ))}
    </div>
  );
};

export default Tips;
