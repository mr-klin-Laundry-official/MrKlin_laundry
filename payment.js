document.addEventListener("DOMContentLoaded", () => {
  const namaEl = document.getElementById("namaRingkasan");
  const layananEl = document.getElementById("layananRingkasan");
  const beratEl = document.getElementById("beratRingkasan");
  const hargaEl = document.getElementById("hargaRingkasan");
  const form = document.getElementById("formPembayaran");

  // 1. AMBIL DATA PESANAN AKTIF
  let orderData = JSON.parse(localStorage.getItem("orderData"));
  let semuaPesanan = JSON.parse(localStorage.getItem("pesanan")) || [];

  // Validasi: Jika data kosong, kembali ke riwayat
  if (!orderData) {
    alert("Sesi habis atau pesanan tidak ditemukan. Silakan ulangi dari Riwayat.");
    window.location.href = "riwayat.html";
    return;
  }

  // 2. TAMPILKAN RINGKASAN DI HALAMAN
  if (namaEl) namaEl.textContent = orderData.nama;
  if (layananEl) layananEl.textContent = orderData.layanan || orderData.tipeLayanan;
  
  if (hargaEl) {
    // Cek apakah ini pelunasan (sisa tagihan) atau pembayaran awal (Total/DP)
    const nominal = orderData.isPelunasan ? orderData.sisaTagihan : orderData.total;
    hargaEl.textContent = "Rp " + (nominal || 0).toLocaleString("id-ID");
  }

  if (beratEl) {
    // Tampilkan berat jika sudah ada, atau "Akan ditimbang" jika DP
    beratEl.textContent = (orderData.berat && orderData.berat > 0) ? orderData.berat + " kg" : "Akan ditimbang Kurir";
  }

  // 3. FUNGSI SUBMIT PEMBAYARAN
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Cek Metode yang dipilih
      const selectedOption = document.querySelector('input[name="metode"]:checked');
      if (!selectedOption) {
        alert("Harap pilih metode pembayaran terlebih dahulu!");
        return;
      }
      const metode = selectedOption.value;

      // Update Data Order
      orderData.metodePembayaran = metode;

      // Tentukan Status Baru
      if (orderData.isPelunasan) {
        // Jika ini pelunasan -> Status jadi "Diproses" (karena user sudah bayar sisa)
        orderData.status = "Diproses";
        orderData.sisaTagihan = 0; // Anggap lunas sementara (menunggu verifikasi jika transfer)
      } else {
        // Jika ini pembayaran awal (DP) -> Status "Menunggu Penjemputan"
        orderData.status = "Menunggu Penjemputan";
      }

      // SIMPAN KE DATABASE UTAMA (ARRAY PESANAN)
      const index = semuaPesanan.findIndex(p => p.id === orderData.id);
      if (index !== -1) {
        semuaPesanan[index] = orderData; // Update data lama
      } else {
        semuaPesanan.push(orderData); // Insert data baru
      }
      localStorage.setItem("pesanan", JSON.stringify(semuaPesanan));

      // === LOGIKA PENGALIHAN (CRUCIAL FIX) ===
      
      // KELOMPOK 1: PEMBAYARAN ONLINE (Butuh Upload Bukti)
      // JANGAN HAPUS 'orderData' di sini, karena 'upload-bukti.js' membutuhkannya!
      if (metode === "Transfer") {
        localStorage.setItem("orderData", JSON.stringify(orderData)); // Pastikan tersimpan
        window.location.href = "pembayaran-transfer.html";
      } 
      else if (metode === "QRIS") {
        localStorage.setItem("orderData", JSON.stringify(orderData)); 
        window.location.href = "pembayaran-qris.html";
      } 
      else if (metode === "VA") {
        localStorage.setItem("orderData", JSON.stringify(orderData)); 
        window.location.href = "pembayaran-va.html";
      }
      else if (metode === "Kartu Kredit") {
        localStorage.setItem("orderData", JSON.stringify(orderData)); 
        window.location.href = "pembayaran-kartu.html";
      }
      
      // KELOMPOK 2: PEMBAYARAN OFFLINE (Tunai/COD)
      // Boleh hapus 'orderData' karena transaksi dianggap selesai di tahap ini
      else if (metode.includes("Tunai") || metode === "Tunai (Kurir)" || metode === "Tunai (Outlet)") {
        localStorage.removeItem("orderData"); // Bersihkan sesi
        alert("✅ Pesanan Dikonfirmasi! Silakan lakukan pembayaran tunai.");
        window.location.href = "riwayat.html";
      }
    });
  }
});
