document.addEventListener("DOMContentLoaded", function () {
  let currentStep = 1;
  const totalSteps = 8;
  const progressBar = document.getElementById("progress-bar");

  document.querySelectorAll(".continue-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const next = parseInt(btn.dataset.next);
      const currentEl = document.getElementById(`step${currentStep}`);
      const nextEl = document.getElementById(`step${next}`);

      if (nextEl) {
        currentEl.classList.remove("step-active");
        nextEl.classList.add("step-active");
        currentStep = next;

        const progress = (next / totalSteps) * 100;
        progressBar.style.width = progress + "%";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
});
