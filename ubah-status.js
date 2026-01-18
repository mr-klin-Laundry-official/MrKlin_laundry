document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("daftarPesanan");

  const opsiStatus = [
    "Pesanan Diterima", "Dalam Antrian", "Dicuci",
    "Disetrika", "Dikemas", "Dikirim", "Selesai"
  ];

  let pesanan = [];
  try {
    const data = JSON.parse(localStorage.getItem("pesanan"));
    pesanan = Array.isArray(data) ? data : [];
  } catch {
    pesanan = [];
  }

  function buatDropdown(orderId, selectedStatus) {
    return `
      <select class="ubah-status" data-id="${orderId}">
        ${opsiStatus.map(status =>
          `<option value="${status}" ${status === selectedStatus ? "selected" : ""}>${status}</option>`
        ).join("")}
      </select>
    `;
  }

  function tampilkanTabel() {
    tbody.innerHTML = "";

    if (pesanan.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">Belum ada data pesanan.</td></tr>`;
      return;
    }

    pesanan.forEach((item) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.nama}</td>
        <td>${item.layanan || item.tipeLayanan || "-"}</td>
        <td>Rp${(item.total || item.totalHarga || 0).toLocaleString("id-ID")}</td>
        <td class="status-cell">${item.status || "Belum Ada"}</td>
        <td>${buatDropdown(item.id, item.status || "Pesanan Diterima")}</td>
      `;

      tbody.appendChild(row);
    });
  }

  tbody.addEventListener("change", (e) => {
    if (e.target.classList.contains("ubah-status")) {
      const orderId = e.target.dataset.id;
      const statusBaru = e.target.value;

      const index = pesanan.findIndex(p => p.id === orderId);
      if (index !== -1) {
        pesanan[index].status = statusBaru;
        localStorage.setItem("pesanan", JSON.stringify(pesanan));

        const row = e.target.closest("tr");
        const statusCell = row.querySelector(".status-cell");
        statusCell.textContent = statusBaru;
      }
    }
  });

  tampilkanTabel();
});
