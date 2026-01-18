document.addEventListener("DOMContentLoaded", () => {
  console.log("Halaman Tentang MR KLIN LAUNDRY berhasil dimuat.");

  // Contoh: highlight section saat scroll (pakai animasi jika diinginkan)
  const sections = document.querySelectorAll("section");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = "0.6s ease";
        entry.target.style.transform = "translateY(0)";
        entry.target.style.opacity = "1";
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(sec => {
    sec.style.opacity = "0";
    sec.style.transform = "translateY(50px)";
    observer.observe(sec);
  });
});
