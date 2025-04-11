let opencvReady = false;

// OpenCVの読み込み完了フラグ
cv['onRuntimeInitialized'] = () => {
  console.log("✅ OpenCV.js 読み込み完了！");
  opencvReady = true;
};

document.getElementById("imageInput").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = function () {
    if (!opencvReady) {
      alert("OpenCV.js の読み込みが完了していません。数秒待ってください。");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    detectCrossCenter(img, ({ x, y }) => {
      // 赤い●を描く
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fill();

      const output = document.getElementById("output");
      output.innerHTML = "<b>中央十字の検出結果：</b><br>";
      output.appendChild(canvas);
      output.innerHTML += `<p>検出された中心座標: (${x}, ${y})</p>`;
    });
  };

  img.src = URL.createObjectURL(file);
});

// OpenCVで十字の交点を検出
function detectCrossCenter(imageElement, callback) {
  const canvas = document.createElement('canvas');
  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0);

  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  const edges = new cv.Mat();
  const lines = new cv.Mat();

  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  cv.Canny(gray, edges, 50, 150, 3, false);
  cv.HoughLinesP(edges, lines, 1, Math.PI / 180, 80, 100, 10);

  let verticals = [];
  let horizontals = [];

  for (let i = 0; i < lines.rows; ++i) {
    const line = lines.data32S.slice(i * 4, i * 4 + 4);
    const [x1, y1, x2, y2] = line;
    if (Math.abs(x1 - x2) < 10) verticals.push((x1 + x2) / 2);
    if (Math.abs(y1 - y2) < 10) horizontals.push((y1 + y2) / 2);
  }

  const centerX = average(verticals);
  const centerY = average(horizontals);

  src.delete(); gray.delete(); edges.delete(); lines.delete();

  callback({ x: Math.round(centerX), y: Math.round(centerY) });
}

function average(arr) {
  return arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}
