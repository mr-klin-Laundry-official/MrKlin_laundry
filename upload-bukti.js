document.addEventListener("DOMContentLoaded", () => {
  const formBukti = document.getElementById("formBukti");
  const inputBukti = document.getElementById("inputBukti");
  const previewImg = document.getElementById("previewImg");

  // Ambil Data Pesanan Aktif
  const orderData = JSON.parse(localStorage.getItem("orderData"));
  const semuaPesanan = JSON.parse(localStorage.getItem("pesanan")) || [];

  if (!orderData) {
    alert("Tidak ada pesanan aktif.");
    window.location.href = "dashboard.html";
    return;
  }

  // 1. Fitur Preview Gambar sebelum Upload
  if (inputBukti) {
    inputBukti.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        // Cek ukuran file (Max 2MB agar LocalStorage tidak penuh)
        if (file.size > 2 * 1024 * 1024) {
          alert("Ukuran file terlalu besar! Maksimal 2MB.");
          this.value = ""; // Reset input
          return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
          previewImg.src = e.target.result;
          previewImg.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 2. Logika Saat Tombol "Kirim Bukti" Diklik
  if (formBukti) {
    formBukti.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!inputBukti.files[0]) {
        alert("Mohon pilih foto bukti pembayaran terlebih dahulu.");
        return;
      }

      const btnSubmit = formBukti.querySelector("button");
      btnSubmit.textContent = "⏳ Mengunggah...";
      btnSubmit.disabled = true;

      // Konversi Gambar ke Base64 (Text)
      const reader = new FileReader();
      reader.readAsDataURL(inputBukti.files[0]);
      
      reader.onload = function () {
        const base64Image = reader.result;

        // Update Data Pesanan
        orderData.buktiBayar = base64Image; // Simpan gambar
        orderData.status = "Menunggu Verifikasi"; // Ganti status
        orderData.waktuBayar = new Date().toLocaleString("id-ID");

        // Simpan ke Array Utama (localStorage 'pesanan')
        const index = semuaPesanan.findIndex(p => p.id === orderData.id);
        if (index !== -1) {
          semuaPesanan[index] = orderData;
          localStorage.setItem("pesanan", JSON.stringify(semuaPesanan));
        }

        // Update orderData session
        localStorage.setItem("orderData", JSON.stringify(orderData));

        alert("✅ Bukti pembayaran berhasil dikirim! Admin akan segera memverifikasi.");
        window.location.href = "riwayat.html";
      };

      reader.onerror = function () {
        alert("Gagal memproses gambar.");
        btnSubmit.textContent = "Kirim Bukti Pembayaran";
        btnSubmit.disabled = false;
      };
    });
  }
});