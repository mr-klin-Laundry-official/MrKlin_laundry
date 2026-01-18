document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const guestCheck = document.getElementById("guest");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const isGuest = guestCheck.checked;
      const username = document.getElementById("username").value.trim();
      const telepon = document.getElementById("telepon").value.trim();
      const alamat = document.getElementById("alamat").value.trim();
      const password = document.getElementById("password").value;
      const ulangi = document.getElementById("ulangi").value;

      // Validasi Daftar
      if (!isGuest) {
        if (password !== ulangi) {
          alert("Password konfirmasi tidak cocok!");
          return;
        }
        if (!document.getElementById("syarat").checked) {
          alert("Anda harus menyetujui syarat & ketentuan.");
          return;
        }
      }

      // === PROSES PENYIMPANAN DATA ===
      
      // 1. Siapkan Data User
      const newUser = {
        nama: isGuest ? "Tamu" : username,
        telepon: isGuest ? "" : telepon,
        alamat: isGuest ? "" : alamat,
        password: isGuest ? "" : password, // <--- PENTING: Password kini disimpan!
        role: "user"
      };

      // 2. Simpan ke Database Pelanggan (Array)
      if (!isGuest) {
        let database = JSON.parse(localStorage.getItem("dataPelanggan")) || [];
        
        // Cek apakah nama sudah dipakai
        const isExist = database.some(u => u.nama.toLowerCase() === username.toLowerCase());
        if (isExist) {
          alert("Nama pengguna sudah terdaftar! Silakan gunakan nama lain atau login.");
          return;
        }

        database.push(newUser);
        localStorage.setItem("dataPelanggan", JSON.stringify(database));
      }

      // 3. Set Sesi Aktif (Login Otomatis setelah daftar)
      const sessionData = {
        nama: newUser.nama,
        telepon: newUser.telepon,
        alamat: newUser.alamat,
        role: "user",
        isLoggedIn: true
      };
      localStorage.setItem("currentUser", JSON.stringify(sessionData));

      alert(`Pendaftaran Berhasil! Selamat datang, ${newUser.nama}`);
      window.location.href = "dashboard.html";
    });
  }

  // Event Listener Tombol Lain
  if(document.getElementById("btnStart")) {
    document.getElementById("btnStart").addEventListener("click", function () {
      if(guestCheck) guestCheck.checked = true;
      form.requestSubmit();
    });
  }

  if(document.getElementById("loginLink")) {
    document.getElementById("loginLink").addEventListener("click", function (e) {
      e.preventDefault();
      // Arahkan ke halaman login yang baru kita buat
      window.location.href = "login.html"; 
    });
  }
});