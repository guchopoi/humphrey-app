document.getElementById("imageInput").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.style.maxWidth = "300px";

  const output = document.getElementById("output");
  output.innerHTML = "画像読み込み中...<br>";
  output.appendChild(img);

  // OCR処理スタート
  Tesseract.recognize(
    file,
    'eng',
    { logger: m => console.log(m) }
  ).then(({ data }) => {
    const cells = data.words.map(w => ({
      text: w.text,
      x: w.bbox.x0,
      y: w.bbox.y0
    }));

    const grouped = groupByRows(cells);
    const matrix = grouped.map(row =>
      row.sort((a, b) => a.x - b.x).map(w => w.text)
    );

    output.innerHTML += "<hr><b>OCRで読み取った数値（68点候補）：</b><br>";
    output.innerHTML += `<pre>${JSON.stringify(matrix, null, 2)}</pre>`;
  });
});

// Y座標が近いものを同じ行にまとめる
function groupByRows(cells) {
  const rows = [];
  const threshold = 10; // Y座標の近さの許容値（px）
  cells.forEach(cell => {
    const row = rows.find(r => Math.abs(r[0].y - cell.y) < threshold);
    if (row) row.push(cell);
    else rows.push([cell]);
  });
  return rows;
}
