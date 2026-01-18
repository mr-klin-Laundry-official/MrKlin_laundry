document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formBooking");

  // === 1. LOGIKA AUTO-FILL (FITUR BARU) ===
  // Ambil data user yang sedang login dari LocalStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Jika user belum login, arahkan kembali ke halaman login
  if (!currentUser) {
    alert("Silakan login terlebih dahulu untuk melakukan pemesanan.");
    window.location.href = "index.html";
    return;
  }

  // Definisi elemen input
  const inputNama = document.getElementById("nama");
  const inputTelepon = document.getElementById("telepon");
  const inputAlamat = document.getElementById("alamat");

  // Isi form secara otomatis jika elemen ditemukan
  if (inputNama && currentUser.nama) {
    inputNama.value = currentUser.nama;
    inputNama.readOnly = true;             // Kunci agar tidak bisa diubah (opsional)
    inputNama.style.backgroundColor = "#e9ecef"; // Beri warna abu-abu agar terlihat terkunci
  }

  if (inputTelepon && currentUser.telepon) {
    inputTelepon.value = currentUser.telepon;
    inputTelepon.readOnly = true;
    inputTelepon.style.backgroundColor = "#e9ecef";
  }

  if (inputAlamat && currentUser.alamat) {
    inputAlamat.value = currentUser.alamat;
    // Alamat biasanya tidak dikunci (readOnly) agar user bisa ubah jika lokasi jemput beda
    // Tapi jika ingin dikunci, uncomment baris di bawah:
    // inputAlamat.readOnly = true; 
    // inputAlamat.style.backgroundColor = "#e9ecef";
  }

  // === 2. LOGIKA SUBMIT FORM (SAMA SEPERTI SEBELUMNYA) ===
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // Mencegah reload halaman

      // Ambil nilai dari input (yang sudah terisi otomatis maupun manual)
      const nama = inputNama.value.trim();
      const telepon = inputTelepon.value.trim();
      const alamat = inputAlamat.value.trim();
      const tanggal = document.getElementById("tanggal").value;
      const jam = document.getElementById("jam").value;
      const catatan = document.getElementById("catatan").value.trim();
      const konfirmasi = document.getElementById("konfirmasi").checked;

      const layananRadio = document.querySelector('input[name="layanan"]:checked');
      const layanan = layananRadio ? layananRadio.value : "";

      // Validasi
      if (!nama || !telepon || !alamat || !tanggal || !jam || !layanan || !konfirmasi) {
        alert("Mohon lengkapi semua data dan centang konfirmasi.");
        return;
      }

      // Simpan data pemesanan sementara ke localStorage
      const dataBooking = {
        id: "ORDER-" + Date.now(), // Tambahkan ID unik untuk pelacakan
        nama,
        telepon,
        alamat,
        tanggal,
        jam,
        layanan,
        catatan,
        status: "Pesanan Diterima", // Status awal
        waktuOrder: new Date().toLocaleString("id-ID"),
        total: 0 // Harga akan dihitung nanti di halaman Order/Pembayaran
      };

      localStorage.setItem("orderData", JSON.stringify(dataBooking));

      // Redirect ke halaman Order untuk konfirmasi harga/berat
      alert("Data pemesanan berhasil disimpan! Menuju ke halaman Order...");
      window.location.href = "order.html";
    });
  }
});