document.addEventListener("DOMContentLoaded", () => {
  // Elemen Statistik
  const totalPendapatanEl = document.getElementById("totalPendapatan");
  const laporanTotalPesananEl = document.getElementById("laporanTotalPesanan");
  const laporanPesananSelesaiEl = document.getElementById("laporanPesananSelesai");
  const laporanPesananProsesEl = document.getElementById("laporanPesananProses");
  const laporanPesananDibatalkanEl = document.getElementById("laporanPesananDibatalkan");

  // Elemen Metode Pembayaran
  const laporanTunaiEl = document.getElementById("laporanTunai");
  const laporanTransferEl = document.getElementById("laporanTransfer");
  const laporanQrisEl = document.getElementById("laporanQris");
  const laporanVaKartuEl = document.getElementById("laporanVaKartu");

  // Tabel
  const tabelTransaksiBody = document.getElementById("tabelLaporanTransaksi").querySelector("tbody");
  const noTransaksiMessage = document.getElementById("noTransaksiMessage");

  // Ambil data
  const dataPesanan = JSON.parse(localStorage.getItem("pesanan")) || [];

  // === 1. FUNGSI HITUNG LAPORAN ===
  function hitungLaporan() {
    let totalPendapatan = 0;
    let totalPesanan = dataPesanan.length;
    let pesananSelesai = 0;
    let pesananProses = 0;
    let pesananDibatalkan = 0;

    const metodeCount = { Tunai: 0, Transfer: 0, QRIS: 0, VA: 0, "Kartu Kredit": 0 };

    dataPesanan.forEach(p => {
      // TENTUKAN NOMINAL ASLI (Prioritaskan totalAkhir jika sudah ditimbang)
      const nominalAsli = p.totalAkhir || p.total || 0;

      // 1. HITUNG PENDAPATAN
      // Uang dihitung jika statusnya 'Selesai' ATAU 'Diproses' (Sudah Lunas)
      if (["Selesai", "Diproses", "Dikirim", "Dicuci", "Disetrika", "Dikemas"].includes(p.status)) {
        totalPendapatan += nominalAsli;
      }

      // 2. HITUNG STATUS
      if (p.status === "Selesai") {
        pesananSelesai++;
      } else if (p.status === "Dibatalkan") {
        pesananDibatalkan++;
      } else {
        pesananProses++;
      }

      // 3. HITUNG METODE
      // Normalisasi string metode (misal: "Tunai (Kurir)" jadi "Tunai")
      let metode = p.metodePembayaran || "-";
      if (metode.includes("Tunai")) metodeCount.Tunai++;
      else if (metode === "Transfer") metodeCount.Transfer++;
      else if (metode === "QRIS") metodeCount.QRIS++;
      else if (metode === "VA") metodeCount.VA++;
      else if (metode === "Kartu Kredit") metodeCount["Kartu Kredit"]++;
    });

    // TAMPILKAN KE UI
    totalPendapatanEl.textContent = `Rp ${totalPendapatan.toLocaleString("id-ID")}`;
    laporanTotalPesananEl.textContent = totalPesanan;
    laporanPesananSelesaiEl.textContent = pesananSelesai;
    laporanPesananProsesEl.textContent = pesananProses;
    laporanPesananDibatalkanEl.textContent = pesananDibatalkan;

    laporanTunaiEl.textContent = metodeCount.Tunai;
    laporanTransferEl.textContent = metodeCount.Transfer;
    laporanQrisEl.textContent = metodeCount.QRIS;
    laporanVaKartuEl.textContent = metodeCount.VA + metodeCount["Kartu Kredit"];
  }

  // === 2. TAMPILKAN TABEL TRANSAKSI LENGKAP ===
  function tampilkanTransaksiLengkap() {
    tabelTransaksiBody.innerHTML = ""; 
    noTransaksiMessage.style.display = "none"; 

    if (dataPesanan.length === 0) {
      noTransaksiMessage.style.display = "block";
      return;
    }

    // Urutkan dari terbaru
    const pesananTerurut = [...dataPesanan].sort((a, b) => {
        const dateA = new Date(a.waktuOrder || a.tanggal);
        const dateB = new Date(b.waktuOrder || b.tanggal);
        return dateB - dateA;
    });

    pesananTerurut.forEach(p => {
      // Gunakan totalAkhir agar angka di tabel benar
      const displayTotal = p.totalAkhir || p.total || 0;
      
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.id || "-"}</td>
        <td>${p.nama || "-"}</td>
        <td>${p.tipeLayanan || p.layanan || "-"}</td>
        <td>${p.berat || "0"} kg</td>
        <td>Rp${displayTotal.toLocaleString("id-ID")}</td>
        <td>${p.status || "-"}</td>
        <td>${p.metodePembayaran || "-"}</td>
        <td>${p.waktuOrder || "-"}</td>
      `;
      tabelTransaksiBody.appendChild(row);
    });
  }

  hitungLaporan();
  tampilkanTransaksiLengkap();
});
