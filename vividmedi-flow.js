document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".form-section");
  const progressBar = document.querySelector(".progress-bar");
  let currentStep = 0;

  function showStep(index) {
    steps.forEach((s, i) => s.classList.toggle("active", i === index));
    progressBar.style.width = `${((index + 1) / steps.length) * 100}%`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validateDates() {
    const from = new Date(document.getElementById("fromDate").value);
    const to = new Date(document.getElementById("toDate").value);
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const diffDays = (to - from) / (1000 * 60 * 60 * 24);
    const err = document.getElementById("dateError");

    if (isNaN(from) || isNaN(to)) return false;
    if (from < sevenDaysAgo) { err.textContent = "Start date cannot be more than 7 days before today."; err.style.display = "block"; return false; }
    if (to < from) { err.textContent = "End date must be after start date."; err.style.display = "block"; return false; }
    if (diffDays >= 5) { err.textContent = "Date range cannot exceed 5 days."; err.style.display = "block"; return false; }

    err.style.display = "none";
    return true;
  }

  function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString("en-AU", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function updateCertificatePreview() {
    const fname = document.getElementById("firstName").value;
    const lname = document.getElementById("lastName").value;
    const certType = document.querySelector("input[name='certType']:checked").value;
    const leaveFrom = document.querySelector("input[name='leaveFrom']:checked").value;
    const reason = document.querySelector("input[name='reason']:checked").value;
    const from = formatDate(document.getElementById("fromDate").value);
    const to = formatDate(document.getElementById("toDate").value);
    const otherLeave = document.getElementById("otherLeave").value.trim();

    let phrase = "";
    if (certType === "Sick Leave") {
      if (leaveFrom === "Work") phrase = "unfit for work due to illness";
      else if (leaveFrom === "Studies") phrase = "unfit for studies due to illness";
      else phrase = `unfit for ${otherLeave || "duties"} due to illness`;
    } else {
      if (leaveFrom === "Work") phrase = "required to care for another person and should be excused from work";
      else if (leaveFrom === "Studies") phrase = "required to care for another person and should be excused from studies";
      else phrase = `required to care for another person and should be excused from ${otherLeave || "duties"}`;
    }

    const preview = document.getElementById("certificatePreview");
    preview.innerHTML = `
      <strong>Medical Certificate</strong><br><br>
      <p>I certify that in my medical opinion <strong>${fname} ${lname}</strong> is ${phrase} from <strong>${from}</strong> to <strong>${to}</strong> inclusive.</p>
      <p><em>Reason:</em> ${reason}</p>
      <p><small>Please check all information is correct before submission.</small></p>
    `;
  }

  document.querySelectorAll(".continue-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      if (currentStep === 4 && !validateDates()) return;
      if (currentStep === 6) updateCertificatePreview();
      if (currentStep < steps.length - 1) currentStep++;
      showStep(currentStep);
    });
  });

  document.querySelectorAll(".back-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      if (currentStep > 0) currentStep--;
      showStep(currentStep);
    });
  });

  // Show Step 9 (Success) after clicking Submit
  document.getElementById("submitBtn").addEventListener("click", e => {
    e.preventDefault();
    currentStep = 8;
    showStep(currentStep);
  });

  // Toggle Other field
  const otherLeaveField = document.getElementById("otherLeaveField");
  document.querySelectorAll("input[name='leaveFrom']").forEach(radio => {
    radio.addEventListener("change", () => {
      otherLeaveField.style.display = radio.id === "other" ? "block" : "none";
    });
  });

  showStep(currentStep);
});
