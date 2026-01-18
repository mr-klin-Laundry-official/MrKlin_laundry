document.addEventListener("DOMContentLoaded", function () {
  // === ELEMEN STATISTIK PESANAN ===
  const totalPesananEl = document.getElementById("totalPesanan");
  const pesananSelesaiEl = document.getElementById("pesananSelesai");
  const jumlahPenggunaEl = document.getElementById("jumlahPengguna");
  const totalKritikEl = document.getElementById("totalKritik"); // Elemen Baru

  // === ELEMEN STATISTIK PEMBAYARAN ===
  const tunaiCountEl = document.getElementById("tunaiCount");
  const transferCountEl = document.getElementById("transferCount");
  const qrisCountEl = document.getElementById("qrisCount");
  const vaCountEl = document.getElementById("vaCount");

  const tabelBody = document.getElementById("tabelPesananTerbaru");

  // === 1. HITUNG DATA PESANAN ===
  const dataPesanan = JSON.parse(localStorage.getItem("pesanan")) || [];

  const totalPesanan = dataPesanan.length;
  const selesai = dataPesanan.filter(p => p.status.toLowerCase() === "selesai").length;
  const penggunaUnik = [...new Set(dataPesanan.map(p => p.nama))];

  const metodeCount = { Tunai: 0, Transfer: 0, QRIS: 0, VA: 0, "Kartu Kredit": 0 };

  dataPesanan.forEach(p => {
    if (p.metodePembayaran === "Tunai") metodeCount.Tunai++;
    else if (p.metodePembayaran === "Transfer") metodeCount.Transfer++;
    else if (p.metodePembayaran === "QRIS") metodeCount.QRIS++;
    else if (p.metodePembayaran === "VA") metodeCount.VA++;
    else if (p.metodePembayaran === "Kartu Kredit") metodeCount["Kartu Kredit"]++;
  });

  // === 2. HITUNG DATA KRITIK & SARAN (BARU) ===
  const dataKritik = JSON.parse(localStorage.getItem("MRKLIN_FEEDBACK_DATA")) || [];
  // Hanya hitung yang statusnya "Pending"
  const kritikPending = dataKritik.filter(k => k.status === "Pending").length;

  // === 3. TAMPILKAN KE LAYAR ===
  if(totalPesananEl) totalPesananEl.textContent = totalPesanan;
  if(pesananSelesaiEl) pesananSelesaiEl.textContent = selesai;
  if(jumlahPenggunaEl) jumlahPenggunaEl.textContent = penggunaUnik.length;
  
  // Tampilkan jumlah kritik
  if(totalKritikEl) {
    totalKritikEl.textContent = kritikPending;
    // Beri warna merah jika ada kritik baru
    if(kritikPending > 0) totalKritikEl.style.color = "red";
  }

  if(tunaiCountEl) tunaiCountEl.textContent = metodeCount.Tunai;
  if(transferCountEl) transferCountEl.textContent = metodeCount.Transfer;
  if(qrisCountEl) qrisCountEl.textContent = metodeCount.QRIS;
  if(vaCountEl) vaCountEl.textContent = metodeCount.VA + metodeCount["Kartu Kredit"];

  // === 4. TABEL PESANAN TERBARU ===
  if (dataPesanan.length > 0) {
    tabelBody.innerHTML = "";
    const terbaru = dataPesanan.slice().reverse().slice(0, 5); 
    terbaru.forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.nama}</td>
        <td>${p.layanan}</td>
        <td>${p.berat} kg</td>
        <td>Rp${p.total.toLocaleString()}</td>
        <td>${p.status}</td>
        <td>${p.metodePembayaran}</td>
      `;
      tabelBody.appendChild(row);
    });
  } else {
    tabelBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Tidak ada data pesanan</td></tr>`;
  }
});