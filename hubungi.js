document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formHubungi");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const email = document.getElementById("email").value.trim();
    const kategori = document.getElementById("kategori").value;
    const pesan = document.getElementById("pesan").value.trim();

    if (!nama || !email || !kategori || !pesan) {
      alert("Harap isi semua kolom formulir dengan lengkap.");
      return;
    }

    // Simulasi kirim pesan (tanpa server)
    alert(`Terima kasih, ${nama}! Pesan Anda telah terkirim.\nKategori: ${kategori}\nKami akan segera menghubungi Anda.`);

    form.reset();
  });
});
