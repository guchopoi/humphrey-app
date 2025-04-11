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
    const flatTexts = grouped
      .map(row => row.sort((a, b) => a.x - b.x).map(w => w.text))
      .flat(); // 一列にする

    const pattern = [2, 6, 8, 8, 10, 10, 8, 8, 6, 2]; // 各行のセル数
    let i = 0;

    const inputArea = document.createElement("div");
    inputArea.style.display = "flex";
    inputArea.style.flexDirection = "column";
    inputArea.style.gap = "4px";

    for (let row = 0; row < pattern.length; row++) {
      const rowDiv = document.createElement("div");
      rowDiv.style.display = "flex";
      rowDiv.style.justifyContent = "center";
      rowDiv.style.gap = "4px";

      for (let col = 0; col < pattern[row]; col++) {
        const input = document.createElement("input");
        input.type = "text";
        input.value = flatTexts[i] || "";
        input.size = 3;
        input.style.textAlign = "center";
        input.name = `v_${row}_${col}`;
        i++;
        rowDiv.appendChild(input);
      }

      inputArea.appendChild(rowDiv);
    }

    output.innerHTML += "<hr><b>修正可能な視野データ：</b><br>";
    output.appendChild(inputArea);
  });
});

// Y座標が近いものを同じ行にまとめる関数
function groupByRows(cells) {
  const rows = [];
  const threshold = 10; // Y座標差が10px以内なら同じ行とみなす
  cells.forEach(cell => {
    const row = rows.find(r => Math.abs(r[0].y - cell.y) < threshold);
    if (row) row.push(cell);
    else rows.push([cell]);
  });
  return rows;
}
