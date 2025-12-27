let currentStep = 0;
const sections = document.querySelectorAll(".form-section");
const progressBar = document.querySelector(".progress-bar");
let selectedPaymentLink = null;

function showStep(step) {
  sections.forEach((s, i) => s.classList.toggle("active", i === step));
  progressBar.style.width = ((step + 1) / sections.length) * 100 + "%";
}

function collectData() {
  const data = {
    certType: document.querySelector("input[name='certType']:checked")?.value,
    leaveFrom: document.querySelector("input[name='leaveFrom']:checked")?.value,
    otherLeave: document.getElementById("otherLeave")?.value || "",
    reason: document.querySelector("input[name='reason']:checked")?.value,
    email: document.getElementById("email")?.value,
    firstName: document.getElementById("firstName")?.value,
    lastName: document.getElementById("lastName")?.value,
    dob: document.getElementById("dob")?.value,
    mobile: document.getElementById("mobile")?.value,
    gender: document.querySelector("input[name='gender']:checked")?.value,
    address: document.getElementById("address")?.value,
    city: document.getElementById("city")?.value,
    state: document.getElementById("state")?.value,
    postcode: document.getElementById("postcode")?.value,
    fromDate: document.getElementById("fromDate")?.value,
    toDate: document.getElementById("toDate")?.value,
    symptoms: document.getElementById("symptoms")?.value,
    doctorNote: document.getElementById("doctorNote")?.value,
    selectedPaymentLink
  };
  return data;
}

// Handle "Other" field toggle
document.querySelectorAll("input[name='leaveFrom']").forEach(radio => {
  radio.addEventListener("change", () => {
    document.getElementById("otherLeaveField").style.display =
      radio.id === "other" ? "block" : "none";
  });
});

// Handle navigation buttons
document.querySelectorAll(".continue-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep < sections.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  });
});

document.querySelectorAll(".back-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });
});

// Handle payment option click — just select, don’t navigate yet
document.querySelectorAll(".payment-option").forEach(opt => {
  opt.addEventListener("click", e => {
    e.preventDefault();
    document.querySelectorAll(".payment-option").forEach(o => o.style.borderColor = "#ccc");
    opt.style.borderColor = "#4AA7FF";
    selectedPaymentLink = opt.href;
    console.log("💳 Selected payment link:", selectedPaymentLink);
  });
});

// Handle final submit
const submitBtn = document.getElementById("submitBtn");
if (submitBtn) {
  submitBtn.addEventListener("click", async () => {
    const data = collectData();

    if (!selectedPaymentLink) {
      alert("⚠️ Please select a certificate duration before submitting.");
      return;
    }

    try {
      const res = await fetch("https://vividmedi-backend.onrender.com/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const responseData = await res.json();
      console.log("✅ Backend response:", responseData);

      // Redirect to payment after data successfully logged
      window.location.href = selectedPaymentLink;
    } catch (err) {
      console.error("❌ Error sending data:", err);
      alert("There was an issue submitting your form. Please try again.");
    }
  });
}

// Initialize
showStep(currentStep);
