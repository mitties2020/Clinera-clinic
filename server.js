// ===============================
// VIVIDMEDI MULTI-STEP FORM FLOW
// ===============================

const sections = document.querySelectorAll(".form-section");
const progressBar = document.querySelector(".progress-bar");
const continueBtns = document.querySelectorAll(".continue-btn");
const backBtns = document.querySelectorAll(".back-btn");
const submitBtn = document.getElementById("submitBtn");

let currentStep = 0;

// === Helper Functions ===
function updateStep() {
  sections.forEach((section, i) => {
    section.classList.toggle("active", i === currentStep);
  });
  const percent = ((currentStep + 1) / sections.length) * 100;
  progressBar.style.width = `${percent}%`;
}

function formatDate(dateString) {
  const d = new Date(dateString);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
}

// === Step Navigation ===
continueBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep === 4 && !validateDates()) return;
    if (currentStep < sections.length - 1) {
      currentStep++;
      if (currentStep === 6) updatePreview();
      updateStep();
    }
  });
});

backBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      updateStep();
    }
  });
});

// === Show/Hide "Other" Field ===
document.querySelectorAll("input[name='leaveFrom']").forEach((input) => {
  input.addEventListener("change", () => {
    const otherField = document.getElementById("otherLeaveField");
    otherField.style.display = document.getElementById("other").checked
      ? "block"
      : "none";
  });
});

// === Date Validation ===
function validateDates() {
  const fromDate = new Date(document.getElementById("fromDate").value);
  const toDate = new Date(document.getElementById("toDate").value);
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  const diffDays = (toDate - fromDate) / (1000 * 60 * 60 * 24) + 1;

  const errorMsg = document.getElementById("dateError");
  if (fromDate < sevenDaysAgo) {
    errorMsg.innerText = "Start date cannot be more than 7 days ago.";
    errorMsg.style.display = "block";
    return false;
  }
  if (diffDays > 5) {
    errorMsg.innerText = "Leave duration cannot exceed 5 days.";
    errorMsg.style.display = "block";
    return false;
  }
  if (toDate < fromDate) {
    errorMsg.innerText = "End date cannot be before the start date.";
    errorMsg.style.display = "block";
    return false;
  }
  errorMsg.style.display = "none";
  return true;
}

// === Preview Step (Step 7) ===
function updatePreview() {
  const preview = document.getElementById("certificatePreview");
  const certType = document.querySelector("input[name='certType']:checked").value;
  const leaveFrom = document.querySelector("input[name='leaveFrom']:checked").value;
  const otherLeave = document.getElementById("otherLeave").value;
  const reason = document.querySelector("input[name='reason']:checked").value;
  const name = `${document.getElementById("firstName").value} ${document.getElementById("lastName").value}`;
  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;

  let reasonText = reason === "Other" ? document.getElementById("symptoms").value : reason;
  let leaveFor = leaveFrom === "Other" ? otherLeave : leaveFrom;

  preview.innerHTML = `
    <strong>Example Certificate:</strong><br><br>
    I certify that in my medical opinion <b>${name}</b> is unfit for <b>${leaveFor.toLowerCase()}</b>
    due to <b>${reasonText.toLowerCase()}</b> and should be excused from duties from
    <b>${formatDate(fromDate)}</b> to <b>${formatDate(toDate)}</b> inclusive.<br><br>
    Reason: ${reasonText}.
  `;
}

// === Final Submit (Step 8 - Payment Step) ===
if (submitBtn) {
  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Collect all patient data
    const payload = {
      certType: document.querySelector("input[name='certType']:checked").value,
      leaveFrom: document.querySelector("input[name='leaveFrom']:checked").value,
      otherLeave: document.getElementById("otherLeave").value,
      reason: document.querySelector("input[name='reason']:checked").value,
      email: document.getElementById("email").value,
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      dob: document.getElementById("dob").value,
      mobile: document.getElementById("mobile").value,
      gender: document.querySelector("input[name='gender']:checked").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      postcode: document.getElementById("postcode").value,
      fromDate: document.getElementById("fromDate").value,
      toDate: document.getElementById("toDate").value,
      symptoms: document.getElementById("symptoms").value,
      doctorNote: document.getElementById("doctorNote").value,
    };

    // Immediately send patient info to backend
    try {
      const res = await fetch("https://vividmedi-backend.onrender.com/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      console.log("✅ Patient info sent:", json);
      alert("✅ Patient information sent successfully! You can now complete payment.");
      currentStep++;
      updateStep();
    } catch (err) {
      console.error("❌ Error submitting:", err);
      alert("Something went wrong while sending patient info.");
    }
  });
}

// === Init ===
updateStep();
