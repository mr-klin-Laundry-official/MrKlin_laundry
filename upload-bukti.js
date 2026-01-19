document.addEventListener("DOMContentLoaded", () => {
  const formBukti = document.getElementById("formBukti");
  const inputBukti = document.getElementById("inputBukti");
  const previewImg = document.getElementById("previewImg");

  // 1. Cek Data Pesanan Sementara
  // Kita ambil data yang dikirim dari halaman payment.js sebelumnya
  const orderData = JSON.parse(localStorage.getItem("orderData"));
  
  if (!orderData) {
    // Jika data hilang (misal user refresh paksa atau kelamaan), kembalikan ke riwayat
    alert("Sesi pesanan telah berakhir atau sudah diproses. Silakan cek Riwayat.");
    window.location.href = "riwayat.html";
    return;
  }

  // 2. Fitur Preview Gambar (Agar user yakin foto yang dipilih benar)
  if (inputBukti) {
    inputBukti.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImg.src = e.target.result;
          previewImg.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 3. Logika Submit / Kirim Bukti
  if (formBukti) {
    formBukti.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!inputBukti.files[0]) {
        alert("Mohon pilih foto bukti pembayaran terlebih dahulu!");
        return;
      }

      const btnSubmit = formBukti.querySelector("button");
      btnSubmit.textContent = "⏳ Mengunggah...";
      btnSubmit.disabled = true;

      // Proses konversi gambar ke text (Base64) agar bisa disimpan di LocalStorage
      const reader = new FileReader();
      reader.readAsDataURL(inputBukti.files[0]);
      
      reader.onload = function () {
        const base64Image = reader.result;

        // A. Ambil Database Utama Pesanan
        let semuaPesanan = JSON.parse(localStorage.getItem("pesanan")) || [];
        
        // B. Cari pesanan yang sesuai ID-nya
        const index = semuaPesanan.findIndex(p => p.id === orderData.id);
        
        if (index !== -1) {
          // C. Update data pesanan dengan Bukti & Status Baru
          semuaPesanan[index].buktiBayar = base64Image;
          semuaPesanan[index].status = "Menunggu Verifikasi"; // Status update
          semuaPesanan[index].waktuBayar = new Date().toLocaleString("id-ID");
          
          // D. Simpan Perubahan ke Database Utama
          localStorage.setItem("pesanan", JSON.stringify(semuaPesanan));
          
          // E. HAPUS DATA SEMENTARA (Sesi Selesai)
          localStorage.removeItem("orderData");

          alert("✅ Bukti pembayaran berhasil dikirim! Admin akan segera memverifikasi.");
          window.location.href = "riwayat.html";
        } else {
          alert("Terjadi kesalahan: Data pesanan tidak ditemukan di database.");
          window.location.href = "riwayat.html";
        }
      };
    });
  }
});
