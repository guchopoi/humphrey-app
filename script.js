document.getElementById("imageInput").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.style.maxWidth = "90%";
  img.style.border = "2px solid #ccc";
  img.style.marginTop = "10px";

  const output = document.getElementById("output");
  output.innerHTML = "<b>アップロードされた画像：</b><br>";
  output.appendChild(img);
});
