document.addEventListener("DOMContentLoaded", () => {
  // 1. AMBIL ID DARI URL (Perbaikan Utama Tracking)
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("orderId");

  const semuaPesanan = JSON.parse(localStorage.getItem("pesanan")) || [];
  const pesanan = semuaPesanan.find(p => p.id === orderId);

  const detailContainer = document.getElementById("detailPesanan");
  const progressContainer = document.getElementById("progressStatus");
  const statusText = document.getElementById("statusText");
  const feedbackSection = document.getElementById("feedbackSection");
  const thankYouSection = document.getElementById("thankYouSection");

  // Jika Data Tidak Ditemukan
  if (!pesanan) {
    detailContainer.innerHTML = `<p style="color:red; text-align:center;">❌ Pesanan tidak ditemukan.</p>`;
    return;
  }

  // 2. RENDER DETAIL
  detailContainer.innerHTML = `
    <div style="display:flex; justify-content:space-between;">
      <span><strong>No. Order:</strong></span> <span>${pesanan.id}</span>
    </div>
    <div style="display:flex; justify-content:space-between;">
      <span><strong>Layanan:</strong></span> <span>${pesanan.tipeLayanan || pesanan.layanan}</span>
    </div>
    <div style="display:flex; justify-content:space-between;">
      <span><strong>Total:</strong></span> <span>Rp ${(pesanan.totalAkhir || pesanan.total).toLocaleString()}</span>
    </div>
  `;

  // 3. RENDER PROGRESS BAR
  const steps = ["Pesanan Diterima", "Dalam Antrian", "Dicuci", "Disetrika", "Dikemas", "Dikirim", "Selesai"];
  let currentStatus = pesanan.status || "Pesanan Diterima";
  
  // Normalisasi status jika ada "Menunggu Pelunasan" dianggap setara "Selesai" secara fisik tapi admin belum update
  if(currentStatus === "Menunggu Pelunasan") currentStatus = "Selesai"; 

  const activeIndex = steps.indexOf(currentStatus);

  statusText.textContent = currentStatus;
  progressContainer.innerHTML = "";

  steps.forEach((step, index) => {
    const isActive = index <= activeIndex ? "active" : "";
    const isCurrent = index === activeIndex ? "current" : "";
    
    // Ikon status
    let icon = "⚪"; 
    if (index <= activeIndex) icon = "🟢";

    const div = document.createElement("div");
    div.className = `step-item ${isActive} ${isCurrent}`;
    div.innerHTML = `
      <div class="step-icon">${icon}</div>
      <div class="step-label">${step}</div>
    `;
    progressContainer.appendChild(div);
  });

  // 4. LOGIKA FEEDBACK / ULASAN (Hanya jika Selesai)
  if (currentStatus === "Selesai") {
    // Cek apakah user sudah pernah memberi feedback untuk ID ini?
    const feedbackData = JSON.parse(localStorage.getItem("MRKLIN_FEEDBACK_DATA")) || [];
    const existingFeedback = feedbackData.find(f => f.orderId === orderId);

    if (existingFeedback) {
      thankYouSection.classList.remove("hidden"); // Tampilkan ucapan terima kasih
    } else {
      feedbackSection.classList.remove("hidden"); // Tampilkan form
    }
  }

  // === LOGIKA BINTANG ===
  const stars = document.querySelectorAll(".star-rating i");
  let selectedRating = 0;

  stars.forEach(star => {
    star.addEventListener("click", () => {
      const val = parseInt(star.getAttribute("data-value"));
      selectedRating = val;
      updateStars(val);
      
      // Update text
      const texts = ["Buruk", "Kurang", "Cukup", "Baik", "Sangat Baik"];
      document.getElementById("ratingText").textContent = texts[val-1];
    });
  });

  function updateStars(value) {
    stars.forEach(s => {
      const v = parseInt(s.getAttribute("data-value"));
      if (v <= value) s.classList.add("active");
      else s.classList.remove("active");
    });
  }

  // === FUNGSI KIRIM FEEDBACK ===
  window.toggleTag = (el) => {
    el.classList.toggle("selected");
  };

  window.kirimFeedback = () => {
    if (selectedRating === 0) {
      alert("Mohon berikan bintang terlebih dahulu!");
      return;
    }

    const comment = document.getElementById("komentarUser").value;
    
    // Ambil tags yang dipilih
    const selectedTags = [];
    document.querySelectorAll(".tag.selected").forEach(t => selectedTags.push(t.textContent));

    const newFeedback = {
      orderId: pesanan.id,
      namaUser: pesanan.nama,
      rating: selectedRating,
      tags: selectedTags,
      komentar: comment,
      tanggal: new Date().toLocaleString("id-ID"),
      status: "Pending" // Untuk admin nanti
    };

    // Simpan ke LocalStorage khusus Feedback
    let feedbackDB = JSON.parse(localStorage.getItem("MRKLIN_FEEDBACK_DATA")) || [];
    feedbackDB.push(newFeedback);
    localStorage.setItem("MRKLIN_FEEDBACK_DATA", JSON.stringify(feedbackDB));

    // UI Feedback
    feedbackSection.classList.add("hidden");
    thankYouSection.classList.remove("hidden");
    alert("Terima kasih atas penilaian Anda!");
  };
});
