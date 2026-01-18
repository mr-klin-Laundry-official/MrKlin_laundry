document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#tabelPelanggan tbody");
  const noDataMessage = document.getElementById("noDataMessage");

  // Ambil data pelanggan dari localStorage
  // Data ini disimpan dari profil.js saat user menyimpan profil mereka
  const dataPelanggan = JSON.parse(localStorage.getItem("dataPelanggan")) || [];

  function renderTabelPelanggan() {
    tbody.innerHTML = ""; // Bersihkan isi tabel

    if (dataPelanggan.length === 0) {
      noDataMessage.style.display = "block";
      return;
    } else {
      noDataMessage.style.display = "none";
    }

    dataPelanggan.forEach((pelanggan, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${pelanggan.nama || "-"}</td>
        <td>${pelanggan.email || "-"}</td>
        <td>${pelanggan.alamat || "-"}</td>
      `;
      tbody.appendChild(row);
    });
  }

  // Panggil fungsi untuk menampilkan tabel saat DOM selesai dimuat
  renderTabelPelanggan();
});