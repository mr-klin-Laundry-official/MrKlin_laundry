document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("formLogin");

  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputName = document.getElementById("loginUser").value.trim();
    const inputPass = document.getElementById("loginPass").value;

    // 1. Ambil Database Pelanggan
    const semuaPelanggan = JSON.parse(localStorage.getItem("dataPelanggan")) || [];

    // 2. Cek apakah ada user yang Nama DAN Password-nya cocok
    // Kita cari user yang namanya SAMA persis DAN passwordnya SAMA persis
    const userFound = semuaPelanggan.find(user => 
      user.nama.toLowerCase() === inputName.toLowerCase() && 
      user.password === inputPass
    );

    if (userFound) {
      // BERHASIL LOGIN
      // Simpan user ini sebagai "currentUser" (Sesi Aktif)
      const sessionData = {
        nama: userFound.nama,
        telepon: userFound.telepon,
        alamat: userFound.alamat,
        role: "user",
        isLoggedIn: true
      };
      
      localStorage.setItem("currentUser", JSON.stringify(sessionData));

      alert(`✅ Login Berhasil! Selamat datang kembali, ${userFound.nama}`);
      window.location.href = "dashboard.html";
    } else {
      // GAGAL LOGIN
      alert("❌ Login Gagal! Nama atau Password salah. Silakan coba lagi.");
    }
  });
});