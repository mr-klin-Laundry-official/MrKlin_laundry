document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formProfil");
  const fotoPreview = document.getElementById("fotoPreview");

  // GANTI LOGIKA LOAD DATA
  // Gunakan 'currentUser' sebagai sumber kebenaran saat ini
  let currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

  if (currentUser.nama) document.getElementById("nama").value = currentUser.nama;
  if (currentUser.email) document.getElementById("email").value = currentUser.email || ""; // Jika ada email
  if (currentUser.alamat) document.getElementById("alamat").value = currentUser.alamat;
  // Telepon tidak ada di form profil.html lama Anda, tapi jika mau ditampilkan tambahkan inputnya.

  // Simpan data
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const email = document.getElementById("email").value.trim();
    const alamat = document.getElementById("alamat").value.trim();

    // Update object currentUser
    currentUser.nama = nama;
    currentUser.email = email;
    currentUser.alamat = alamat;
    // Foto disimpan terpisah atau bisa dimasukkan ke object jika Base64 string tidak terlalu panjang

    // Simpan kembali ke localStorage 'currentUser'
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    
    // Opsional: Simpan juga ke 'userProfile' jika kode lain masih memakainya
    localStorage.setItem("userProfile", JSON.stringify(currentUser));

    alert("Profil berhasil diperbarui!");
  });
  
  // ... logika foto tetap sama ...
});