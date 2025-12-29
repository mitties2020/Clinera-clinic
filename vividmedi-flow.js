// vividmedi-flow.js — Send patient info on Step 7 Continue (LIVE vividmedi.com)
console.log("✅ vividmedi-flow.js loaded successfully (LIVE)");

const sections = document.querySelectorAll(".form-section");
const progressBar = document.querySelector(".progress-bar");

// All continue buttons EXCEPT a dedicated submit button (if present)
const continueButtons = document.querySelectorAll(".continue-btn:not(#submitBtn)");
const backButtons = document.querySelectorAll(".back-btn");

// Payment buttons in your index.html: <button class="payment-btn" data-link="...">
const paymentButtons = document.querySelectorAll(".payment-btn");

// Your Render backend submit endpoint
const SUBMIT_URL = "https://vividmedi-backend.onrender.com/api/submit";

let currentStep = 0;

// Prevent duplicate emails if user goes back/forward
let submissionSent = false;
let submissionResponse = null;

// ------------------------------
// Overlay (simple user feedback)
// ------------------------------
const overlay = document.createElement("div");
overlay.style.cssText = `
  position: fixed;
  top:0;left:0;width:100%;height:100%;
  background:rgba(255,255,255,0.85);
  display:none;
  align-items:center;
  justify-content:center;
  font-size:1.1rem;
  color:#111;
  z-index:9999;
  text-align:center;
  padding:20px;
`;
overlay.textContent = "Working...";
document.body.appendChild(overlay);

function showOverlay(msg) {
  overlay.textContent = msg || "Working...";
  overlay.style.display = "flex";
}
function hideOverlay() {
  overlay.style.display = "none";
}

// ------------------------------
// Show section
// ------------------------------
function showSection(index) {
  sections.forEach((sec, i) => sec.classList.toggle("active", i === index));
  if (progressBar) {
    progressBar.style.width = `${((index + 1) / sections.length) * 100}%`;
  }
}
showSection(currentStep);

// ------------------------------
// Optional: show/hide “Other” field for leaveFrom
// ------------------------------
function updateOtherLeaveField() {
  const otherRadio = document.getElementById("other");
  const field = document.getElementById("otherLeaveField");
  if (!otherRadio || !field) return;
  field.style.display = otherRadio.checked ? "block" : "none";
}
document.querySelectorAll("input[name='leaveFrom']").forEach((r) => {
  r.addEventListener("change", updateOtherLeaveField);
});
updateOtherLeaveField();

// ------------------------------
// Build payload from form
// ------------------------------
function buildPayload() {
  return {
    certType: document.querySelector("input[name='certType']:checked")?.value || "",
    leaveFrom: document.querySelector("input[name='leaveFrom']:checked")?.value || "",
    otherLeave: document.getElementById("otherLeave")?.value || "",
    reason: document.querySelector("input[name='reason']:checked")?.value || "",
    email: document.getElementById("email")?.value || "",
    firstName: document.getElementById("firstName")?.value || "",
    lastName: document.getElementById("lastName")?.value || "",
    dob: document.getElementById("dob")?.value || "",
    mobile: document.getElementById("mobile")?.value || "",
    gender: document.querySelector("input[name='gender']:checked")?.value || "",
    address: document.getElementById("address")?.value || "",
    city: document.getElementById("city")?.value || "",
    state: document.getElementById("state")?.value || "",
    postcode: document.getElementById("postcode")?.value || "",
    fromDate: document.getElementById("fromDate")?.value || "",
    toDate: document.getElementById("toDate")?.value || "",
    symptoms: document.getElementById("symptoms")?.value || "",
    doctorNote: document.getElementById("doctorNote")?.value || "",
  };
}

// ------------------------------
// Very light required checks (optional but helps)
// ------------------------------
function basicValidate(payload) {
  const required = ["email", "firstName", "lastName", "dob", "mobile", "address", "city", "state", "postcode", "fromDate", "toDate"];
  const missing = required.filter((k) => !payload[k]);
  return missing;
}

// ------------------------------
// Submit to backend (email admin + store cert)
// ------------------------------
async function submitPatientInfo() {
  if (submissionSent && submissionResponse) {
    return submissionResponse;
  }

  const payload = buildPayload();
  const missing = basicValidate(payload);
  if (missing.length) {
    alert("Please complete all required fields before continuing.");
    throw new Error("Missing required fields: " + missing.join(", "));
  }

  showOverlay("Submitting your details…");

  try {
    const res = await fetch(SUBMIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data?.success) {
      console.error("❌ Submit failed:", res.status, data);
      alert("❌ Submission failed. Please try again.");
      throw new Error("Submit failed");
    }

    submissionSent = true;
    submissionResponse = data;

    console.log("✅ Submission success:", data);
    return data;
  } finally {
    hideOverlay();
  }
}

// ------------------------------
// Continue buttons
// - When user clicks Continue on STEP 7 (index 6), submit, then force step to Payment (index 7)
// ------------------------------
continueButtons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    try {
      // STEP 7 = index 6 (Review page)
      if (currentStep === 6) {
        await submitPatientInfo();

        // ✅ Force to STEP 8 (Payment) = index 7
        currentStep = 7;
        showSection(currentStep);
        return;
      }

      // Normal next step
      if (currentStep < sections.length - 1) {
        currentStep++;
        showSection(currentStep);
      }
    } catch (e) {
      console.error(e);
      // Stay on current step if submit failed
    }
  });
});

// ------------------------------
// Back buttons
// ------------------------------
backButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentStep = Math.max(0, currentStep - 1);
    showSection(currentStep);
  });
});

// ------------------------------
// Payment button behaviour (Square)
// - Opens Square link in new tab
// - Optional: you can embed checkout in iframe if you want (your HTML has ids below)
// ------------------------------
const squareFrameContainer = document.getElementById("squareFrameContainer");
const squareCheckoutFrame = document.getElementById("squareCheckoutFrame");

paymentButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const link = btn.getAttribute("data-link");
    if (!link) return;

    // If you want embedded iframe:
    if (squareFrameContainer && squareCheckoutFrame) {
      squareCheckoutFrame.src = link;
      squareFrameContainer.style.display = "block";
      squareFrameContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // Otherwise open new tab
    window.open(link, "_blank", "noopener,noreferrer");
  });
});
