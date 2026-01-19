document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("daftarRiwayat");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  let pesanan = JSON.parse(localStorage.getItem("pesanan")) || [];

  // Filter hanya pesanan milik user yang login
  if (currentUser) {
    pesanan = pesanan.filter(p => p.nama === currentUser.nama);
  }

  container.innerHTML = "";

  if (pesanan.length === 0) {
    container.innerHTML = "<p style='text-align:center; margin-top:20px;'>Belum ada riwayat pesanan.</p>";
    return;
  }

  pesanan.slice().reverse().forEach(p => {
    const card = document.createElement("div");
    card.classList.add("card-riwayat");

    // LOGIKA TOMBOL PELUNASAN
    let extraInfo = "";
    if (p.status === "Menunggu Pelunasan" && p.sisaTagihan > 0) {
      extraInfo = `
        <div style="background:#fff3cd; color:#856404; padding:10px; border-radius:5px; margin:10px 0; border:1px solid #ffeeba;">
          ⚠️ <strong>Konfirmasi Berat: ${p.berat} Kg</strong><br>
          Total Tagihan: Rp ${(p.totalAkhir).toLocaleString()}<br>
          Sudah DP: Rp ${(p.totalAkhir - p.sisaTagihan).toLocaleString()}<br>
          <strong style="color:#d35400; font-size:1.1rem;">Kekurangan: Rp ${p.sisaTagihan.toLocaleString()}</strong>
          
          <button onclick="bayarSisa('${p.id}')" style="width:100%; margin-top:8px; background:#d35400; color:white; border:none; padding:10px; border-radius:5px; font-weight:bold; cursor:pointer;">
            💳 Bayar Kekurangan Sekarang
          </button>
        </div>
      `;
    }

    card.innerHTML = `
      <h3>🧺 ${p.layanan || p.tipeLayanan}</h3>
      <p>Tanggal: ${p.waktuOrder || "-"}</p>
      <p>Status: <strong>${p.status}</strong></p>
      ${extraInfo}
      ${p.sisaTagihan === 0 && p.status === "Diproses" ? `<p style="color:green; font-weight:bold;">✅ Lunas - Sedang Dikerjakan</p>` : ""}
    `;
    container.appendChild(card);
  });

  // Fungsi Transisi ke Halaman Bayar untuk Pelunasan
  window.bayarSisa = (id) => {
    // Ambil data terbaru dari localStorage (karena mungkin sudah diupdate admin)
    const allOrders = JSON.parse(localStorage.getItem("pesanan"));
    const targetOrder = allOrders.find(o => o.id === id);

    if (targetOrder) {
      // Set flag pelunasan agar payment.js tahu ini bukan order baru
      targetOrder.isPelunasan = true; 
      
      // Simpan ke sesi payment
      localStorage.setItem("orderData", JSON.stringify(targetOrder));
      
      // Pindah
      window.location.href = "payment.html";
    }
  };
});
