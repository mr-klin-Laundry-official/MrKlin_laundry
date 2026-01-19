document.addEventListener("DOMContentLoaded", () => {
  // 1. Ambil Data Booking
  const orderData = JSON.parse(localStorage.getItem("orderData"));
  
  if (!orderData) {
    alert("Data booking tidak ditemukan. Silakan ulangi pemesanan.");
    window.location.href = "booking.html";
    return;
  }

  // Tampilkan Info Dasar
  document.getElementById("outNama").textContent = orderData.nama;
  document.getElementById("outJadwal").textContent = `${orderData.tanggal} (${orderData.jam})`;
  document.getElementById("outAlamat").textContent = orderData.alamat;

  // 2. Definisi Elemen
  const radioSendiri = document.querySelector('input[value="sendiri"]');
  const radioKurir = document.querySelector('input[value="kurir"]');
  const inputBeratContainer = document.getElementById("inputBeratContainer");
  const infoKurirContainer = document.getElementById("infoKurirContainer");
  const inputBerat = document.getElementById("berat");
  const selectLayanan = document.getElementById("tipeLayanan");
  const displayTotal = document.getElementById("totalHarga");
  const labelTotal = document.getElementById("labelTotal");
  const formOrder = document.getElementById("formOrder");

  // Harga Layanan
  const hargaLayanan = {
    "Cuci Komplit": 8000,
    "Cuci Kering": 6000,
    "Setrika Saja": 5000,
    "Express": 12000
  };

  const BIAYA_DP = 10000;

  // 3. Fungsi Hitung Otomatis
  function hitung() {
    if (radioSendiri.checked) {
      // MODE TIMBANG SENDIRI (Bayar Full)
      inputBeratContainer.style.display = "block";
      infoKurirContainer.style.display = "none";
      labelTotal.textContent = "Total Estimasi (Lunas):";
      
      // Wajib isi berat jika pilih mode ini
      inputBerat.required = true; 

      const layanan = selectLayanan.value;
      const berat = parseFloat(inputBerat.value) || 0;
      const harga = hargaLayanan[layanan] || 0;
      const total = berat * harga;

      displayTotal.textContent = "Rp " + total.toLocaleString("id-ID");
      return { total, isDP: false, berat };

    } else {
      // MODE TIMBANG KURIR (Bayar DP Saja)
      inputBeratContainer.style.display = "none";
      infoKurirContainer.style.display = "block";
      labelTotal.textContent = "Biaya Jemput (DP):";
      
      // TIDAK WAJIB isi berat (Kunci Solusi Masalah Anda)
      inputBerat.required = false; 
      inputBerat.value = ""; 

      displayTotal.textContent = "Rp " + BIAYA_DP.toLocaleString("id-ID");
      return { total: BIAYA_DP, isDP: true, berat: 0 };
    }
  }

  // Event Listeners (Agar angka berubah saat diklik)
  radioSendiri.addEventListener("change", hitung);
  radioKurir.addEventListener("change", hitung);
  selectLayanan.addEventListener("change", hitung);
  inputBerat.addEventListener("input", hitung);

  // Jalankan sekali saat loading
  hitung();

  // 4. Submit Form (Lanjut ke Payment)
  formOrder.addEventListener("submit", (e) => {
    e.preventDefault();

    const perhitungan = hitung();
    const layanan = selectLayanan.value;

    // Update data order sebelum ke payment
    orderData.layanan = layanan;
    orderData.berat = perhitungan.berat;
    orderData.total = perhitungan.total;
    orderData.isDP = perhitungan.isDP; 
    
    // Status awal
    orderData.status = "Menunggu Pembayaran";
    
    // Penanda status berat untuk Admin
    if (perhitungan.isDP) {
      orderData.catatan = (orderData.catatan || "") + " [Minta Timbang Kurir]";
      orderData.statusBerat = "Belum Ditimbang";
    } else {
      orderData.statusBerat = "Sudah Ditimbang User";
    }

    // Simpan & Redirect
    localStorage.setItem("orderData", JSON.stringify(orderData));
    window.location.href = "payment.html";
  });
});
