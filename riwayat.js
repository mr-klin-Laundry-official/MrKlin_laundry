document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("daftarRiwayat");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  let pesanan = JSON.parse(localStorage.getItem("pesanan")) || [];

  // Filter pesanan milik user login
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

    // LOGIKA TOMBOL: Lacak vs Bayar Pelunasan
    let aksiButton = "";

    if (p.status === "Menunggu Pelunasan" && p.sisaTagihan > 0) {
      // TAMPILAN TAGIHAN PELUNASAN
      aksiButton = `
        <div style="background:#fff3cd; padding:10px; border-radius:5px; margin-bottom:10px; font-size:0.9rem;">
          ⚠️ <strong>Kurang Bayar: Rp ${p.sisaTagihan.toLocaleString()}</strong>
        </div>
        <button onclick="bayarSisa('${p.id}')" class="btn-lunas">💳 Bayar Kekurangan</button>
      `;
    } else {
      // TAMPILAN TOMBOL LACAK (Normal)
      aksiButton = `
        <button onclick="bukaTracking('${p.id}')" class="btn-lacak">📍 Lacak Status</button>
      `;
    }

    card.innerHTML = `
      <h3>🧺 ${p.layanan || p.tipeLayanan}</h3>
      <p>Tanggal: ${p.waktuOrder || "-"}</p>
      <p>Status: <strong style="color:#1976d2">${p.status}</strong></p>
      ${p.totalAkhir ? `<p>Total: Rp ${p.totalAkhir.toLocaleString()}</p>` : `<p>Total (DP): Rp ${(p.total||0).toLocaleString()}</p>`}
      <div class="card-actions" style="margin-top:10px;">
        ${aksiButton}
      </div>
    `;
    container.appendChild(card);
  });

  // FUNGSI GLOBAL (Agar bisa dipanggil onclick)
  window.bukaTracking = (id) => {
    console.log("Membuka tracking untuk ID:", id); // Debugging
    window.location.href = `tracking.html?orderId=${id}`;
  };

  window.bayarSisa = (id) => {
    const allOrders = JSON.parse(localStorage.getItem("pesanan"));
    const targetOrder = allOrders.find(o => o.id === id);
    if (targetOrder) {
      targetOrder.isPelunasan = true;
      localStorage.setItem("orderData", JSON.stringify(targetOrder));
      window.location.href = "payment.html";
    }
  };
});
