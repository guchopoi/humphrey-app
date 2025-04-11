document.getElementById("imageInput").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = function () {
    document.getElementById("output").innerHTML = "";
    detectCrossCenter(img, ({ x, y }) => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fill();

      document.getElementById("output").appendChild(canvas);
      document.getElementById("output").innerHTML += `<p>中央推定位置: (${x}, ${y})</p>`;
    });
  };
});

// OpenCVで中央十字交点を検出
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
    const [x1, y1, x2, y2] = lines.intPtr(i);
    if (Math.abs(x1 - x2) < 10) verticals.push((x1 + x2) / 2); // 垂直線
    if (Math.abs(y1 - y2) < 10) horizontals.push((y1 + y2) / 2); // 水平線
  }

  const centerX = average(verticals);
  const centerY = average(horizontals);

  // メモリ解放
  src.delete(); gray.delete(); edges.delete(); lines.delete();

  callback({ x: Math.round(centerX), y: Math.round(centerY) });
}

function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length || 0;
}
