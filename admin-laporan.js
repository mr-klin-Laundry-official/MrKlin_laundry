document.addEventListener("DOMContentLoaded", () => {
  // Elemen untuk statistik ringkasan
  const totalPendapatanEl = document.getElementById("totalPendapatan");
  const laporanTotalPesananEl = document.getElementById("laporanTotalPesanan");
  const laporanPesananSelesaiEl = document.getElementById("laporanPesananSelesai");
  const laporanPesananProsesEl = document.getElementById("laporanPesananProses");
  const laporanPesananDibatalkanEl = document.getElementById("laporanPesananDibatalkan");

  const laporanTunaiEl = document.getElementById("laporanTunai");
  const laporanTransferEl = document.getElementById("laporanTransfer");
  const laporanQrisEl = document.getElementById("laporanQris");
  const laporanVaKartuEl = document.getElementById("laporanVaKartu");

  const tabelTransaksiBody = document.getElementById("tabelLaporanTransaksi").querySelector("tbody");
  const noTransaksiMessage = document.getElementById("noTransaksiMessage");

  // Ambil data pesanan dari localStorage
  const dataPesanan = JSON.parse(localStorage.getItem("pesanan")) || [];

  // === FUNGSI PENGHITUNGAN LAPORAN ===
  function hitungLaporan() {
    let totalPendapatan = 0;
    let totalPesanan = dataPesanan.length;
    let pesananSelesai = 0;
    let pesananProses = 0; // Termasuk 'Dalam Antrian', 'Dicuci', 'Disetrika', 'Dikemas', 'Dikirim'
    let pesananDibatalkan = 0;

    const metodePembayaranCount = {
      Tunai: 0,
      Transfer: 0,
      QRIS: 0,
      VA: 0,
      "Kartu Kredit": 0 // Memisahkan VA dan Kartu Kredit untuk akurasi laporan
    };

    dataPesanan.forEach(p => {
      // Hitung total pendapatan dari pesanan Selesai
      if (p.status === "Selesai" && p.total) {
        totalPendapatan += p.total;
      }

      // Hitung status pesanan
      if (p.status === "Selesai") {
        pesananSelesai++;
      } else if (p.status === "Dibatalkan") {
        pesananDibatalkan++;
      } else {
        // Anggap selain 'Selesai' dan 'Dibatalkan' adalah 'Dalam Proses'
        pesananProses++;
      }

      // Hitung distribusi metode pembayaran
      if (p.metodePembayaran) {
        if (metodePembayaranCount.hasOwnProperty(p.metodePembayaran)) {
          metodePembayaranCount[p.metodePembayaran]++;
        } else if (p.metodePembayaran.startsWith("VA")) { // Tangani VA yang mungkin spesifik (contoh: VA BNI)
           metodePembayaranCount.VA++;
        }
      }
    });

    // Perbarui elemen HTML
    totalPendapatanEl.textContent = `Rp ${totalPendapatan.toLocaleString("id-ID")}`;
    laporanTotalPesananEl.textContent = totalPesanan;
    laporanPesananSelesaiEl.textContent = pesananSelesai;
    laporanPesananProsesEl.textContent = pesananProses;
    laporanPesananDibatalkanEl.textContent = pesananDibatalkan;

    laporanTunaiEl.textContent = metodePembayaranCount.Tunai;
    laporanTransferEl.textContent = metodePembayaranCount.Transfer;
    laporanQrisEl.textContent = metodePembayaranCount.QRIS;
    laporanVaKartuEl.textContent = metodePembayaranCount.VA + metodePembayaranCount["Kartu Kredit"];
  }

  // === FUNGSI MENAMPILKAN TRANSAKSI LENGKAP ===
  function tampilkanTransaksiLengkap() {
    tabelTransaksiBody.innerHTML = ""; // Bersihkan tabel
    noTransaksiMessage.style.display = "none"; // Sembunyikan pesan

    if (dataPesanan.length === 0) {
      noTransaksiMessage.style.display = "block";
      return;
    }

    // Urutkan dari yang terbaru
    const pesananTerurut = [...dataPesanan].sort((a, b) => {
        const dateA = new Date(a.waktuOrder || a.tanggal);
        const dateB = new Date(b.waktuOrder || b.tanggal);
        return dateB - dateA;
    });

    pesananTerurut.forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.id || "-"}</td>
        <td>${p.nama || "-"}</td>
        <td>${p.tipeLayanan || p.layanan || "-"}</td>
        <td>${p.berat || "0"} kg</td>
        <td>Rp${(p.total || p.totalHarga || 0).toLocaleString("id-ID")}</td>
        <td>${p.status || "Menunggu Proses"}</td>
        <td>${p.metodePembayaran || "-"}</td>
        <td>${p.waktuOrder || p.tanggal || "-"}</td>
      `;
      tabelTransaksiBody.appendChild(row);
    });
  }

  // Panggil fungsi laporan saat halaman dimuat
  hitungLaporan();
  tampilkanTransaksiLengkap();
});