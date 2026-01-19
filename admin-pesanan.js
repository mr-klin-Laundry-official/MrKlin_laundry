document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#tabelPesanan tbody");
  let pesanan = JSON.parse(localStorage.getItem("pesanan")) || [];

  // HARGA (Harus sinkron dengan order.js)
  const HARGA = {
    "Cuci Komplit": 8000, "Cuci + Setrika": 8000,
    "Cuci Kering": 6000, "Setrika Saja": 5000,
    "Express": 12000, "Kilat 4 Jam": 12000
  };

  // Opsi Status yang tersedia
  const OPSI_STATUS = [
    "Menunggu Pembayaran",
    "Menunggu Penjemputan",
    "Menunggu Verifikasi",
    "Dicuci",
    "Menunggu Pelunasan",
    "Diproses",
    "Selesai",
    "Dibatalkan"
  ];

  function renderTabel() {
    tbody.innerHTML = "";
    if (pesanan.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px;">Belum ada pesanan.</td></tr>`;
      return;
    }

    pesanan.slice().reverse().forEach((p, index) => {
      const realIndex = pesanan.length - 1 - index;
      const row = document.createElement("tr");

      // LOGIKA KOLOM BERAT (Tombol Input vs Teks)
      let htmlBerat = "";
      if (p.statusBerat === "Belum Ditimbang" || !p.berat || p.berat === 0) {
        htmlBerat = `<button class="btn-timbang" onclick="inputBerat(${realIndex})">⚖️ Input</button>`;
      } else {
        htmlBerat = `<strong style="color:#27ae60;">${p.berat} Kg</strong>`;
      }

      // LOGIKA KOLOM TOTAL (Info Kurang Bayar)
      let htmlTotal = `Rp${(p.total || 0).toLocaleString()}`;
      if (p.sisaTagihan > 0) {
        htmlTotal += `<br><small style="color:red; font-weight:bold;">Sisa: Rp${p.sisaTagihan.toLocaleString()}</small>`;
      } else if (p.isDP && !p.totalAkhir) {
        htmlTotal += ` <small style="color:orange">(DP)</small>`;
      } else if (p.totalAkhir) {
        htmlTotal = `Rp${p.totalAkhir.toLocaleString()} (Lunas)`;
      }

      // LOGIKA KOLOM STATUS (DROPDOWN LANGSUNG)
      // Kita buat dropdown select yang otomatis terpilih status saat ini
      let htmlStatus = `<select onchange="ubahStatus(${realIndex}, this.value)" class="status-select ${p.status.replace(/\s/g, '')}">`;
      OPSI_STATUS.forEach(opt => {
        const selected = opt === p.status ? "selected" : "";
        htmlStatus += `<option value="${opt}" ${selected}>${opt}</option>`;
      });
      htmlStatus += `</select>`;

      // LOGIKA BUKTI BAYAR
      let htmlBukti = "-";
      if (p.buktiBayar) {
        htmlBukti = `<button class="btn-lihat" onclick="lihatBukti('${p.buktiBayar}')">👁 Foto</button>`;
      }

      row.innerHTML = `
        <td>${p.nama}</td>
        <td>${p.layanan || p.tipeLayanan}</td>
        <td>${htmlBerat}</td>
        <td>${htmlTotal}</td>
        <td>${htmlStatus}</td> <td>${p.metodePembayaran || "-"}</td>
        <td>${htmlBukti}</td>
        <td>${p.waktuOrder || "-"}</td>
        <td>
           <button class="hapus" onclick="hapusPesanan(${realIndex})">❌</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  // === FUNGSI 1: INPUT BERAT ===
  window.inputBerat = (index) => {
    const p = pesanan[index];
    const input = prompt(`Masukkan Berat (Kg) untuk ${p.nama}:`, "0");
    const berat = parseFloat(input);

    if (berat > 0) {
      let hargaSatuan = HARGA[p.layanan] || HARGA[p.tipeLayanan] || 8000;
      
      const totalSeharusnya = berat * hargaSatuan;
      const dpAwal = p.total || 0;
      const sisa = totalSeharusnya - dpAwal;

      p.berat = berat;
      p.totalAkhir = totalSeharusnya;
      p.sisaTagihan = sisa;
      p.statusBerat = "Sudah Ditimbang";
      p.status = "Menunggu Pelunasan"; // Status otomatis berubah agar user bayar

      simpanData();
      alert(`Berat tersimpan! Tagihan Pelunasan: Rp ${sisa.toLocaleString()}`);
    }
  };

  // === FUNGSI 2: UBAH STATUS (LANGSUNG) ===
  window.ubahStatus = (index, statusBaru) => {
    pesanan[index].status = statusBaru;
    
    // Jika admin set ke "Lunas" atau "Selesai", kita bisa nol-kan tagihan (opsional)
    if (statusBaru === "Selesai" || statusBaru === "Diproses") {
        if(pesanan[index].sisaTagihan > 0) {
            // Opsional: Tanya admin apakah tagihan dianggap lunas
            if(confirm("Apakah sisa tagihan dianggap sudah LUNAS?")) {
                pesanan[index].sisaTagihan = 0;
            }
        }
    }
    
    simpanData();
    // Tidak perlu alert agar cepat
  };

  // === FUNGSI LAINNYA ===
  window.hapusPesanan = (i) => {
    if(confirm("Hapus data ini selamanya?")) {
      pesanan.splice(i, 1);
      simpanData();
    }
  };

  window.lihatBukti = (imgSrc) => {
    const modal = document.getElementById("imageModal");
    const img = document.getElementById("imgDisplay");
    img.src = imgSrc;
    modal.style.display = "flex"; // Tampilkan modal
    
    // Tutup modal jika diklik
    modal.onclick = () => modal.style.display = "none";
  };

  function simpanData() {
    localStorage.setItem("pesanan", JSON.stringify(pesanan));
    renderTabel();
  }

  renderTabel();
});
