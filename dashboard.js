document.addEventListener("DOMContentLoaded", () => {
  // === 1. DEFINISI ELEMEN ===
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const profileBtn = document.getElementById("profileBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  const feedbackForm = document.getElementById("feedbackForm"); // Elemen Form Kritik

  // === 2. PETA RUTE PENCARIAN (ROUTE MAP) - LOGIKA LAMA ===
  const routeMap = {
    // Dashboard & Umum
    dashboard: "dashboard.html",
    home: "dashboard.html",
    beranda: "dashboard.html",
    
    // Fitur Utama
    pemesanan: "booking.html",
    booking: "booking.html",
    order: "order.html",
    pesanan: "order.html",
    pembayaran: "payment.html",
    payment: "payment.html",
    bayar: "payment.html",
    riwayat: "riwayat.html",
    history: "riwayat.html",
    aplikasi: "apps.html",
    apps: "apps.html",
    download: "apps.html",
    hubungi: "hubungi.html",
    kontak: "hubungi.html",
    contact: "hubungi.html",
    tentang: "tentang.html",
    about: "tentang.html",
    profil: "profil.html",
    profile: "profil.html",

    // FITUR BARU
    kritik: "feedback.html",
    saran: "feedback.html",
    masukan: "feedback.html",
    komplain: "feedback.html",
    feedback: "feedback.html"
  };

  // === 3. LOGIKA PENCARIAN (SEARCH) - LOGIKA LAMA ===
  if (searchBtn && searchInput) {
    const performSearch = () => {
      const keyword = searchInput.value.trim().toLowerCase();
      
      if (!keyword) {
        alert("Silakan masukkan kata kunci fitur yang dicari.");
        return;
      }

      let matched = false;
      for (const key in routeMap) {
        if (keyword.includes(key)) {
          window.location.href = routeMap[key];
          matched = true;
          break;
        }
      }

      if (!matched) {
        alert("Fitur tidak ditemukan. Coba kata kunci lain.");
      }
    };

    searchBtn.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") performSearch();
    });
  }

  // === 4. LOGIKA DROPDOWN PROFIL - LOGIKA LAMA ===
  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.add("hidden");
      }
    });
  }

  // === 5. LOGIKA FORM KRITIK & SARAN (BARU) ===
  // Hanya berjalan jika pengguna sedang berada di halaman feedback.html
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Mencegah reload halaman

      // Ambil nilai input
      const nameVal = document.getElementById("fbName").value;
      const catVal = document.getElementById("fbCategory").value;
      const msgVal = document.getElementById("fbMessage").value;
      
      // Format Tanggal
      const dateVal = new Date().toLocaleString("id-ID", { 
        day: 'numeric', month: 'short', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      });

      // Buat Object Data Baru
      const newItem = {
        id: Date.now(),
        name: nameVal,
        category: catVal,
        message: msgVal,
        date: dateVal,
        status: "Pending", // Status awal agar Admin tahu ini baru
        adminReply: ""
      };

      // Simpan ke Local Storage
      const STORAGE_KEY = "MRKLIN_FEEDBACK_DATA";
      const existingData = localStorage.getItem(STORAGE_KEY);
      const feedbacks = existingData ? JSON.parse(existingData) : [];
      
      feedbacks.push(newItem);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));

      // Reset Form & Notifikasi
      feedbackForm.reset();
      alert("✅ Terima kasih! Masukan Anda berhasil dikirim ke Admin.");
    });
  }
});