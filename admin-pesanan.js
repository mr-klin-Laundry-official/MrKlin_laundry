document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#tabelPesanan tbody");
  
  // Elemen Modal
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("imgDisplay");
  const spanClose = document.getElementsByClassName("close")[0];

  let pesanan = JSON.parse(localStorage.getItem("pesanan")) || [];

  function renderTabel() {
    tbody.innerHTML = "";

    if (pesanan.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;">Belum ada data pesanan.</td></tr>`;
      return;
    }

    // Reverse agar pesanan terbaru muncul di paling atas
    pesanan.slice().reverse().forEach((item, index) => {
      // Karena kita reverse tampilan, kita butuh index asli untuk edit/hapus
      const realIndex = pesanan.length - 1 - index;
      
      const row = document.createElement("tr");

      // Logika Tombol Bukti
      let tombolBukti = "-";
      if (item.buktiBayar) {
        // Jika ada gambar bukti di database
        tombolBukti = `<button class="lihat-bukti" data-img="${item.buktiBayar}">👁 Lihat Foto</button>`;
      }

      row.innerHTML = `
        <td>${item.nama}</td>
        <td>${item.layanan || item.tipeLayanan}</td>
        <td>${item.berat} kg</td>
        <td>Rp${(item.total || item.totalHarga || 0).toLocaleString("id-ID")}</td>
        <td><span class="status ${item.status}">${item.status || "Menunggu Proses"}</span></td>
        <td>${item.metodePembayaran || "-"}</td>
        <td style="text-align:center;">${tombolBukti}</td>
        <td>${item.waktuOrder || item.tanggal || item.waktuBayar || "-"}</td>
        <td>
          <button class="ubah" data-index="${realIndex}">Ubah Status</button>
          <button class="hapus" data-index="${realIndex}">Hapus</button>
        </td>
      `;

      tbody.appendChild(row);
    });
  }

  function simpanDanRefresh() {
    localStorage.setItem("pesanan", JSON.stringify(pesanan));
    renderTabel();
  }

  // Delegasi tombol aksi (MENGGUNAKAN LOGIKA ASLI ANDA + TAMBAHAN MODAL)
  tbody.addEventListener("click", (e) => {
    // 1. Logika Ubah Status (Tetap ke halaman ubah-status.html)
    if (e.target.classList.contains("ubah")) {
      // Kita simpan ID atau Index pesanan yang mau diedit ke localStorage sementara
      // agar halaman ubah-status.html tahu mana yang diedit
      localStorage.setItem("editIndex", e.target.dataset.index); 
      window.location.href = "ubah-status.html";
    } 
    // 2. Logika Hapus (Tetap sama)
    else if (e.target.classList.contains("hapus")) {
      const index = e.target.dataset.index;
      const konfirmasi = confirm("Yakin ingin menghapus pesanan ini?");
      if (konfirmasi) {
        pesanan.splice(index, 1);
        simpanDanRefresh();
      }
    }
    // 3. Logika Lihat Bukti (BARU)
    else if (e.target.classList.contains("lihat-bukti")) {
      const imgSrc = e.target.dataset.img;
      modal.style.display = "flex"; // Tampilkan modal
      modalImg.src = imgSrc; // Isi gambar
    }
  });

  // Logika Tutup Modal (Klik X atau Klik area luar gambar)
  if (spanClose) {
    spanClose.onclick = function() {
      modal.style.display = "none";
    }
  }
  
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  renderTabel();
});