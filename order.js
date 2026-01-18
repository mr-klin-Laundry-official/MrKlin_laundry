document.addEventListener("DOMContentLoaded", () => {
  // Ambil data dari LocalStorage (yang disimpan oleh booking.js)
  const orderData = JSON.parse(localStorage.getItem("orderData"));

  // Validasi: Jika tidak ada data booking, kembali ke booking
  if (!orderData) {
    alert("Data pesanan tidak ditemukan. Silakan lakukan Booking ulang.");
    window.location.href = "booking.html";
    return;
  }

  // === 1. TAMPILKAN DATA KE LAYAR ===
  document.getElementById("outNama").textContent = orderData.nama;
  document.getElementById("outLayanan").textContent = orderData.layanan; // Dari booking
  document.getElementById("outJadwal").textContent = `${orderData.tanggal} (Jam ${orderData.jam})`;
  document.getElementById("outAlamat").textContent = orderData.alamat;
  
  // Tampilkan Harga DP (Format Rupiah)
  document.getElementById("outTotal").textContent = "Rp " + (orderData.total || 0).toLocaleString("id-ID");

  // === 2. TOMBOL BAYAR ===
  const btnBayar = document.getElementById("btnBayar");
  btnBayar.addEventListener("click", () => {
    // Simpan order ini ke Database Utama Pesanan ('pesanan')
    let semuaPesanan = JSON.parse(localStorage.getItem("pesanan")) || [];

    // Cek agar tidak duplikat jika tombol ditekan 2x
    const exists = semuaPesanan.find(p => p.id === orderData.id);
    if (!exists) {
      semuaPesanan.push(orderData);
      localStorage.setItem("pesanan", JSON.stringify(semuaPesanan));
    }

    // Arahkan ke Halaman Pembayaran
    window.location.href = "payment.html";
  });

  // === 3. TOMBOL BATAL ===
  document.getElementById("btnBatal").addEventListener("click", () => {
    if(confirm("Yakin ingin membatalkan pesanan ini?")) {
      localStorage.removeItem("orderData"); // Hapus data sementara
      window.location.href = "dashboard.html";
    }
  });
});