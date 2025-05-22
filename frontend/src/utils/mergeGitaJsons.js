import fs from 'fs'
import path from 'path'

const output = {
  BhagavadGitaChapter: []
};

for (let i = 1; i <= 18; i++) {
  const filePath = path.join(__dirname, `bhagavad_gita_chapter_${i}.json`);

  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    data.BhagavadGitaChapter.forEach(verse => {
      output.BhagavadGitaChapter.push({
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text,
        meaning: verse.translations["shri purohit swami"] || ""
      });
    });
  } else {
    console.warn(`File not found: ${filePath}`);
  }
}

fs.writeFileSync(
  path.join(__dirname, "verses.json"),
  JSON.stringify(output, null, 2),
  "utf-8"
);

console.log("✅ verses.json created successfully.");
