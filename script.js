document.getElementById("imageInput").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = function () {
    // Canvasを準備して画像を描画
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // 十字中心を検出して描画
    detectCrossCenter(img, ({ x, y }) => {
      // 赤い●を描画
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fill();

      // 結果を表示
      const output = document.getElementById("output");
      output.innerHTML = "";
      output.appendChild(canvas);
      output.innerHTML += `<p>中央推定位置: (${x}, ${y})</p>`;
    });
  };

  // ファイルを画像として読み込み
  img.src = URL.createObjectURL(file);
});
