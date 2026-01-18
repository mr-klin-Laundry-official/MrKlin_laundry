document.addEventListener("DOMContentLoaded", () => {
  const namaEl = document.getElementById("namaRingkasan");
  const layananEl = document.getElementById("layananRingkasan");
  const beratEl = document.getElementById("beratRingkasan");
  const hargaEl = document.getElementById("hargaRingkasan");

  const form = document.getElementById("formPembayaran");

  // Ambil data pesanan aktif
  const orderData = JSON.parse(localStorage.getItem("orderData"));
  const semuaPesanan = JSON.parse(localStorage.getItem("pesanan")) || [];

  if (!orderData) {
    alert("Data pesanan tidak ditemukan. Silakan buat pesanan terlebih dahulu.");
    window.location.href = "order.html";
    return;
  }

  // Tampilkan ringkasan data
  namaEl.textContent = orderData.nama;
  layananEl.textContent = orderData.tipeLayanan;
  beratEl.textContent = orderData.berat + " kg";
  hargaEl.textContent = `Rp${orderData.total.toLocaleString("id-ID")}`;

  // Fungsi redirect berdasarkan metode pembayaran
  function redirectToInstruction(metode) {
    switch (metode) {
      case "Transfer":
        window.location.href = "pembayaran-transfer.html";
        break;
      case "QRIS":
        window.location.href = "pembayaran-qris.html";
        break;
      case "Tunai":
        window.location.href = "pembayaran-tunai.html";
        break;
      case "VA":
        window.location.href = "pembayaran-va.html";
        break;
      case "Kartu Kredit":
        window.location.href = "pembayaran-kartu.html";
        break;
      default:
        alert("Metode tidak dikenali.");
    }
  }

  // Handle submit form
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const metode = form.metode.value;

    if (!metode) {
      alert("Silakan pilih salah satu metode pembayaran.");
      return;
    }

    // Update data order aktif
    orderData.metodePembayaran = metode;
    orderData.status = "Menunggu Proses";

    // Update array pesanan[]
    const index = semuaPesanan.findIndex(p => p.id === orderData.id);
    if (index !== -1) {
      semuaPesanan[index] = orderData;
      localStorage.setItem("pesanan", JSON.stringify(semuaPesanan));
    }

    // Simpan ulang ke orderData
    localStorage.setItem("orderData", JSON.stringify(orderData));

    // Redirect ke instruksi pembayaran
    redirectToInstruction(metode);
  });
});
