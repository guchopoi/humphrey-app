document.getElementById("imageInput").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.maxWidth = "300px";
    document.getElementById("output").innerHTML = "";
    document.getElementById("output").appendChild(img);
    // OCR処理は今後ここに入れる
  }
});
