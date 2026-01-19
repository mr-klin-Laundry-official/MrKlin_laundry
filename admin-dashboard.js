document.addEventListener("DOMContentLoaded", function () {
  // === ELEMEN STATISTIK ===
  const totalPesananEl = document.getElementById("totalPesanan");
  const pesananSelesaiEl = document.getElementById("pesananSelesai");
  const jumlahPenggunaEl = document.getElementById("jumlahPengguna");
  const totalKritikEl = document.getElementById("totalKritik"); 

  const tunaiCountEl = document.getElementById("tunaiCount");
  const transferCountEl = document.getElementById("transferCount");
  const qrisCountEl = document.getElementById("qrisCount");
  const vaCountEl = document.getElementById("vaCount");

  const tabelBody = document.getElementById("tabelPesananTerbaru");

  // === 1. PROSES DATA PESANAN ===
  const dataPesanan = JSON.parse(localStorage.getItem("pesanan")) || [];

  const totalPesanan = dataPesanan.length;
  // Hitung selesai (case insensitive)
  const selesai = dataPesanan.filter(p => p.status && p.status.toLowerCase() === "selesai").length;
  // Hitung user unik
  const penggunaUnik = [...new Set(dataPesanan.map(p => p.nama))];

  // Hitung Metode Pembayaran
  const metodeCount = { Tunai: 0, Transfer: 0, QRIS: 0, VA: 0, "Kartu Kredit": 0 };
  dataPesanan.forEach(p => {
    let m = p.metodePembayaran || "";
    if (m.includes("Tunai")) metodeCount.Tunai++;
    else if (m === "Transfer") metodeCount.Transfer++;
    else if (m === "QRIS") metodeCount.QRIS++;
    else if (m === "VA") metodeCount.VA++;
    else if (m === "Kartu Kredit") metodeCount["Kartu Kredit"]++;
  });

  // === 2. PROSES DATA KRITIK (FEEDBACK) ===
  const dataKritik = JSON.parse(localStorage.getItem("MRKLIN_FEEDBACK_DATA")) || [];
  const kritikPending = dataKritik.filter(k => k.status === "Pending").length;

  // === 3. UPDATE TAMPILAN KOTAK STATISTIK ===
  if(totalPesananEl) totalPesananEl.textContent = totalPesanan;
  if(pesananSelesaiEl) pesananSelesaiEl.textContent = selesai;
  if(jumlahPenggunaEl) jumlahPenggunaEl.textContent = penggunaUnik.length;
  
  if(totalKritikEl) {
    totalKritikEl.textContent = kritikPending;
    if(kritikPending > 0) totalKritikEl.style.color = "red";
  }

  if(tunaiCountEl) tunaiCountEl.textContent = metodeCount.Tunai;
  if(transferCountEl) transferCountEl.textContent = metodeCount.Transfer;
  if(qrisCountEl) qrisCountEl.textContent = metodeCount.QRIS;
  if(vaCountEl) vaCountEl.textContent = metodeCount.VA + metodeCount["Kartu Kredit"];

  // === 4. TABEL PESANAN TERBARU (FIX HARGA) ===
  if (dataPesanan.length > 0) {
    tabelBody.innerHTML = "";
    // Ambil 5 pesanan terakhir
    const terbaru = dataPesanan.slice().reverse().slice(0, 5); 
    
    terbaru.forEach(p => {
      // GUNAKAN TOTAL AKHIR (Jika ada)
      const hargaTampil = p.totalAkhir || p.total || 0;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.nama}</td>
        <td>${p.tipeLayanan || p.layanan || "-"}</td>
        <td>${p.berat || 0} kg</td>
        <td>Rp${hargaTampil.toLocaleString("id-ID")}</td>
        <td><span style="font-weight:bold;">${p.status}</span></td>
        <td>${p.metodePembayaran || "-"}</td>
      `;
      tabelBody.appendChild(row);
    });
  } else {
    tabelBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Tidak ada data pesanan</td></tr>`;
  }
});
