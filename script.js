let opencvReady = false;

// OpenCVが読み込まれたらフラグを立てる
cv['onRuntimeInitialized'] = () => {
  console.log("OpenCV.js loaded ✅");
  opencvReady = true;
};

document.getElementById("imageInput").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = function () {
    if (!opencvReady) {
      alert("OpenCV.js の読み込みがまだ完了していません。数秒待ってからもう一度お試しください。");
      return;
    }

    // Canvasに画像を描画
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // 十字交差点の検出
    detectCrossCenter(img, ({ x, y }) => {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fill();

      const output = document.getElementById("output");
      output.innerHTML = "";
      output.appendChild(canvas);
      output.innerHTML += `<p>中央推定位置: (${x}, ${y})</p>`;
    });
  };

  img.src = URL.createObjectURL(file);
});
