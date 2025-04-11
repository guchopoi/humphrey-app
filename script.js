document.getElementById("imageInput").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // 中央座標（画像サイズが897×880）
    const centerX = 448;
    const centerY = 440;

    // 赤い●を描画
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.fill();

    const output = document.getElementById("output");
    output.innerHTML = "<b>中央に赤い●を描画：</b><br>";
    output.appendChild(canvas);
    output.innerHTML += `<p>中央: (${centerX}, ${centerY})</p>`;
  };

  img.src = URL.createObjectURL(file);
});
