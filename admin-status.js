document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#tabelPengiriman tbody");
  const filterStatusSelect = document.getElementById("filterStatus");
  const noDataMessage = document.getElementById("noDataMessage");

  // Ambil semua data pesanan
  const semuaPesanan = JSON.parse(localStorage.getItem("pesanan")) || [];

  function renderTabel(filteredPesanan) {
    tbody.innerHTML = ""; // Bersihkan tabel
    noDataMessage.style.display = "none"; // Sembunyikan pesan

    if (filteredPesanan.length === 0) {
      noDataMessage.style.display = "block";
      return;
    }

    filteredPesanan.forEach(item => {
      const row = document.createElement("tr");

      // Pastikan status default jika tidak ada
      const statusClass = item.status ? item.status.replace(/\s/g, "") : "MenungguProses";

      row.innerHTML = `
        <td>${item.nama}</td>
        <td>${item.tipeLayanan || item.layanan || "-"}</td>
        <td>${item.berat} kg</td>
        <td>Rp${(item.total || item.totalHarga || 0).toLocaleString("id-ID")}</td>
        <td><span class="status ${statusClass}">${item.status || "Menunggu Proses"}</span></td>
        <td>${item.waktuOrder || item.tanggal || "-"}</td>
        <td>
          <button class="btn-detail" data-id="${item.id}">Lihat Detail</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  function applyFilter() {
    const selectedStatus = filterStatusSelect.value;
    let filtered = [];

    if (selectedStatus === "all") {
      filtered = semuaPesanan;
    } else {
      // Filter berdasarkan status yang dipilih
      filtered = semuaPesanan.filter(p => p.status === selectedStatus);
    }
    renderTabel(filtered);
  }

  // Event listener untuk filter
  filterStatusSelect.addEventListener("change", applyFilter);

  // Event listener untuk tombol 'Lihat Detail' (delegasi)
  tbody.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-detail")) {
      const orderId = e.target.dataset.id;
      // Arahkan ke halaman tracking.html dengan ID pesanan
      window.location.href = `tracking.html?orderId=${orderId}`;
    }
  });

  // Tampilkan tabel pertama kali saat halaman dimuat
  applyFilter();
});