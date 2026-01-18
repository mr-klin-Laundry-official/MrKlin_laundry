document.addEventListener("DOMContentLoaded", () => {
  const orderIdDisplay = document.getElementById("orderIdDisplay");
  const customerNameDisplay = document.getElementById("customerNameDisplay");
  const serviceTypeDisplay = document.getElementById("serviceTypeDisplay");
  const orderStatusDisplay = document.getElementById("orderStatusDisplay");

  const courierNameEl = document.getElementById("courierName");
  const courierPhoneEl = document.getElementById("courierPhone");
  const courierEtaEl = document.getElementById("courierEta");
  const callCourierBtn = document.getElementById("callCourierBtn");
  const waCourierBtn = document.getElementById("waCourierBtn");

  // Ambil ID pesanan dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');

  // Ambil semua data pesanan dari localStorage
  const semuaPesanan = JSON.parse(localStorage.getItem("pesanan")) || [];
  let pesanan = null;

  if (orderId) {
    pesanan = semuaPesanan.find(p => p.id === orderId);
  }

  if (pesanan) {
    // Tampilkan detail pesanan
    orderIdDisplay.textContent = pesanan.id || "-";
    customerNameDisplay.textContent = pesanan.nama || "-";
    serviceTypeDisplay.textContent = pesanan.tipeLayanan || pesanan.layanan || "-";
    orderStatusDisplay.textContent = pesanan.status || "Tidak Diketahui";

    // Simulasi data kurir
    const dummyCourierPhone = "+6281298765432"; // Nomor telepon dummy kurir
    const dummyCourierName = "Budi Santoso"; // Nama dummy kurir
    const dummyCourierEta = "Dalam perjalanan, estimasi tiba 30-45 menit."; // Estimasi dummy

    // Jika status sudah 'Dikirim', tampilkan info kurir lebih relevan
    if (pesanan.status === "Dikirim") {
      courierNameEl.textContent = dummyCourierName;
      courierPhoneEl.textContent = dummyCourierPhone;
      courierEtaEl.textContent = dummyCourierEta;

      // Update href untuk tombol telepon dan WhatsApp
      callCourierBtn.href = `tel:${dummyCourierPhone}`;
      waCourierBtn.href = `https://wa.me/${dummyCourierPhone.replace(/\+/g, '')}`; // Hapus '+' untuk link WA

    } else {
      courierNameEl.textContent = "Belum Ditugaskan";
      courierPhoneEl.textContent = "N/A";
      courierEtaEl.textContent = "Kurir akan ditugaskan setelah pesanan diproses.";
      callCourierBtn.style.display = 'none'; // Sembunyikan tombol jika belum ada kurir
      waCourierBtn.style.display = 'none';
      document.querySelector('.note').textContent = "Kurir akan aktif dan bisa dihubungi saat pesanan Anda dalam status \"Dikirim\".";
    }

  } else {
    // Jika pesanan tidak ditemukan
    document.querySelector('main').innerHTML = `
      <section class="order-info-card">
        <h2>Pesanan Tidak Ditemukan</h2>
        <p>Detail pesanan dengan ID "${orderId}" tidak dapat ditemukan.</p>
        <p style="text-align:center; margin-top:1.5rem;">
          <a href="riwayat.html" class="btn-back">⬅ Kembali ke Riwayat Pesanan</a>
        </p>
      </section>
    `;
  }
});