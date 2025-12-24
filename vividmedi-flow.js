// vividmedi-flow.js
document.addEventListener("DOMContentLoaded", () => {
  const continueBtn = document.querySelector(".continue-btn");
  const step1 = document.querySelector(".step-1");
  const step2 = document.querySelector(".step-2");
  const progressBar = document.querySelector(".progress-bar");

  if (!continueBtn || !step1 || !step2) return;

  continueBtn.addEventListener("click", () => {
    // Hide step 1
    step1.style.display = "none";
    // Show step 2
    step2.style.display = "block";
    // Update progress bar
    if (progressBar) {
      progressBar.style.width = "50%";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
