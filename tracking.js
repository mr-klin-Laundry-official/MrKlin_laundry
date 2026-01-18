document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("orderId");

  const semuaPesanan = JSON.parse(localStorage.getItem("pesanan")) || [];
  const pesanan = semuaPesanan.find(p => p.id === orderId);

  const detailContainer = document.getElementById("detailPesanan");
  const progressContainer = document.getElementById("progressStatus");
  const statusText = document.getElementById("statusText");

  // Fallback jika tidak ditemukan
  if (!pesanan) {
    detailContainer.innerHTML = `<p style="color:red;">❌ Pesanan tidak ditemukan. Pastikan Anda membuka dari link yang benar.</p>`;
    statusText.textContent = "Status tidak tersedia.";
    return;
  }

  // Tampilkan detail pesanan
  detailContainer.innerHTML = `
    <p><strong>Nama:</strong> ${pesanan.nama}</p>
    <p><strong>Layanan:</strong> ${pesanan.tipeLayanan || pesanan.layanan || "-"}</p>
    <p><strong>Berat:</strong> ${pesanan.berat || "-"} kg</p>
    <p><strong>Total:</strong> Rp${(pesanan.total || 0).toLocaleString("id-ID")}</p>
    <p><strong>Waktu Order:</strong> ${pesanan.waktuOrder || "-"}</p>
    <p><strong>Alamat:</strong> ${pesanan.alamat || "-"}</p>
    <p><strong>Pembayaran:</strong> ${pesanan.metodePembayaran || "-"}</p>
  `;

  // Status langkah
  const statusSteps = [
    "Pesanan Diterima",
    "Dalam Antrian",
    "Dicuci",
    "Disetrika",
    "Dikemas",
    "Dikirim",
    "Selesai"
  ];

  const statusAktif = pesanan.status || "Pesanan Diterima";
  const indexAktif = statusSteps.indexOf(statusAktif);

  statusText.innerHTML = `<strong>Status Saat Ini:</strong> ${statusAktif}`;

  // Render progress bar
  progressContainer.innerHTML = ""; // Bersihkan dulu
  statusSteps.forEach((status, index) => {
    const div = document.createElement("div");
    div.classList.add("step-box");
    if (index <= indexAktif) {
      div.classList.add("aktif");
    }

    div.innerHTML = `
      <div class="step-num">${index + 1}</div>
      <div class="step-label">${status}</div>
    `;
    progressContainer.appendChild(div);
  });

  // Tampilkan tombol admin jika ID ditemukan
  document.getElementById("adminUbahStatus").classList.remove("hidden");
});
