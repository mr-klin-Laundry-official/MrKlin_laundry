document.addEventListener("DOMContentLoaded", () => {
  const daftarRiwayat = document.getElementById("daftarRiwayat");
  const filterStatus = document.getElementById("filterStatus");
  const sortOrder = document.getElementById("sortOrder");

  // === 1. CEK USER LOGIN ===
  // Kita ambil data user yang sedang login dari localStorage
  // Pastikan saat Login, Anda menyimpan data: localStorage.setItem("currentUser", JSON.stringify(userData));
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    alert("Anda belum login. Silakan login terlebih dahulu untuk melihat riwayat.");
    window.location.href = "index.html"; // Arahkan ke halaman login jika belum login
    return;
  }

  // === 2. AMBIL DAN FILTER DATA ===
  // Ambil semua data pesanan
  const semuaPesanan = JSON.parse(localStorage.getItem("pesanan")) || [];

  // FILTER PENTING: Hanya ambil pesanan milik user yang sedang login
  // Kita mencocokkan 'nama' di pesanan dengan 'nama' di currentUser
  let pesananSaya = semuaPesanan.filter(order => order.nama === currentUser.nama);

  /**
   * Fungsi untuk menampilkan riwayat pesanan ke dalam DOM.
   */
  function tampilkanRiwayat(pesananToDisplay) {
    daftarRiwayat.innerHTML = ""; // Bersihkan konten yang ada

    if (pesananToDisplay.length === 0) {
      daftarRiwayat.innerHTML = `
        <div style="text-align:center; width:100%; margin-top:2rem;">
          <p>Halo <strong>${currentUser.nama}</strong>, Anda belum memiliki riwayat pesanan.</p>
          <a href="booking.html" style="background:#1565c0; color:white; padding:8px 16px; text-decoration:none; border-radius:6px;">Buat Pesanan Baru</a>
        </div>`;
      return;
    }

    pesananToDisplay.forEach(order => {
      const card = document.createElement("div");
      card.classList.add("card-riwayat");

      const statusClass = order.status ? order.status.replace(/\s/g, "") : "MenungguProses";
      const displayStatus = order.status || "Menunggu Proses";

      card.innerHTML = `
        <h3>🧺 ${order.tipeLayanan || order.layanan || "Layanan"}</h3>
        <p><strong>ID:</strong> ${order.id || "-"}</p>
        <p><strong>Total:</strong> Rp${(order.total || order.totalHarga || 0).toLocaleString("id-ID")}</p>
        <p><strong>Status:</strong> <span class="status ${statusClass}">${displayStatus}</span></p>
        <p><strong>Tanggal:</strong> ${order.waktuOrder || order.tanggal || "-"}</p>
        
        <div class="card-actions">
          <button class="lacak" onclick="lacakStatus('${order.id}')">📍 Lacak</button>
          <button class="kurir" onclick="hubungiKurir('${order.id}')">📞 Bantuan</button>
        </div>
      `;
      daftarRiwayat.appendChild(card);
    });
  }

  /**
   * Fungsi Filter dan Sort (Hanya memproses 'pesananSaya')
   */
  function filterDanUrutkan() {
    // Gunakan pesananSaya (milik user sendiri), BUKAN semuaPesanan
    let hasil = [...pesananSaya];

    // Filter Status
    const statusPilih = filterStatus.value;
    if (statusPilih !== "all") {
      hasil = hasil.filter(p => p.status === statusPilih);
    }

    // Urutkan Waktu
    const urutanPilih = sortOrder.value;
    if (urutanPilih === "baru") {
      hasil.sort((a, b) => new Date(b.waktuOrder) - new Date(a.waktuOrder));
    } else if (urutanPilih === "lama") {
      hasil.sort((a, b) => new Date(a.waktuOrder) - new Date(b.waktuOrder));
    }

    tampilkanRiwayat(hasil);
  }

  // === Fungsi Global ===
  window.lacakStatus = function (id) {
    window.location.href = `tracking.html?orderId=${id}`;
  };

  window.hubungiKurir = function (id) {
    // Contoh link WhatsApp
    const phone = "6281234567890"; // Ganti nomor admin laundry
    const text = `Halo, saya ingin bertanya tentang pesanan ID: ${id}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Event Listeners
  filterStatus.addEventListener("change", filterDanUrutkan);
  sortOrder.addEventListener("change", filterDanUrutkan);

  // Inisialisasi awal
  filterDanUrutkan();
});