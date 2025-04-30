import React, { useState } from "react";

function TextToJsonConverter() {
  const [jsonOutput, setJsonOutput] = useState(null);
  const [fileName, setFileName] = useState("output.json");

  const handleFileRead = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name.replace(/\.[^/.]+$/, "") + ".json");

    const text = await file.text();

    // Split by two or more newlines (empty lines)
    const blocks = text
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .filter(Boolean);

    const chapterTitle = blocks[0]; // assuming 1st block is chapter title
    const verseBlocks = blocks.slice(1); // rest are verses + meanings

    let meaningLines = [];
    let verseLines = [];
    let i = 0;  
    let verseCount = 0;
    const verses = verseBlocks.reduce((acc, block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    
      if (i === 0) {
        verseLines = [...lines];
        console.log("verseLines", verseLines);
        verseCount++;
      } else if (i === 1) {
        meaningLines = [...lines];
        console.log("meaningLines", meaningLines);
        i = 0;
    
        acc.push({
          verse_number: verseCount,
          verse: verseLines.join(" "),
          meaning: meaningLines.join(" "),
        });
        return acc;
      }
      i++;
      return acc;
    }, []);

    const jsonData = {
      chapter_title: chapterTitle,
      verses: verses,
    };

    setJsonOutput(jsonData);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(jsonOutput, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  return (
    <div className="flex max-w-md items-center justify-center flex-col">
      <h2 >Text File to JSON Converter</h2>
      <input type="file" accept=".txt" onChange={handleFileRead} 
      className="flex bg-white rounded hover:bg-amber-500 cursor-pointer transition hover:-translate-y-0.5 text-center"/>
      {jsonOutput && (<>
          {/* <pre style={{ marginTop: "20px", textAlign: "left" }}>
            {JSON.stringify(jsonOutput, null, 2)}
          </pre> */}
          <button
            onClick={handleDownload}            
            className="m-2 rounded bg-emerald-700 p-2 text-white"
          >
            Download JSON
          </button>
        </>
      )}
    </div>
  );
}

export default TextToJsonConverter;
