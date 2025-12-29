// vividmedi-flow.js — stable step flow + submit on Review (Step 7) + never-stuck submit
console.log("✅ vividmedi-flow.js loaded");

const sections = document.querySelectorAll(".form-section");
const progressBar = document.querySelector(".progress-bar");
const continueButtons = document.querySelectorAll(".continue-btn:not(#submitBtn)");
const backButtons = document.querySelectorAll(".back-btn");
const paymentButtons = document.querySelectorAll(".payment-btn");

const SUBMIT_URL = "https://vividmedi-backend.onrender.com/api/submit";

let submissionSent = false;
let submissionResponse = null;

/* ------------------------------
   Overlay
--------------------------------*/
const overlay = document.createElement("div");
overlay.style.cssText = `
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.85);
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #111;
  z-index: 9999;
  text-align: center;
  padding: 20px;
`;
overlay.textContent = "Working…";
document.body.appendChild(overlay);

function showOverlay(msg) {
  overlay.textContent = msg || "Working…";
  overlay.style.display = "flex";
}
function hideOverlay() {
  overlay.style.display = "none";
}

/* ------------------------------
   Helpers
--------------------------------*/
function getActiveIndex() {
  return Array.from(sections).findIndex((s) => s.classList.contains("active"));
}

function showSection(index) {
  sections.forEach((s, i) => s.classList.toggle("active", i === index));
  if (progressBar) {
    progressBar.style.width = `${((index + 1) / sections.length) * 100}%`;
  }
}

// init
showSection(0);

/* ------------------------------
   Optional: show/hide “Other” field
--------------------------------*/
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

/* ------------------------------
   Payload
--------------------------------*/
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

function missingRequired(p) {
  const req = [
    "email",
    "firstName",
    "lastName",
    "dob",
    "mobile",
    "address",
    "city",
    "state",
    "postcode",
    "fromDate",
    "toDate",
  ];
  return req.filter((k) => !p[k]);
}

/* ------------------------------
   Submit (with timeout + always hides overlay)
--------------------------------*/
async function submitPatientInfo() {
  if (submissionSent) return submissionResponse;

  const payload = buildPayload();
  const missing = missingRequired(payload);
  if (missing.length) {
    alert("Please complete all required fields.");
    throw new Error("Missing fields: " + missing.join(", "));
  }

  showOverlay("Submitting your details…");

  // hard timeout so you never get stuck
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s

  try {
    const res = await fetch(SUBMIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data?.success) {
      console.error("❌ Submit failed:", res.status, data);
      alert("❌ Submission failed. Please try again.");
      throw new Error("Submission failed");
    }

    submissionSent = true;
    submissionResponse = data;

    console.log("✅ Submission success:", data);
    return data;
  } catch (err) {
    console.error("❌ Submit error:", err);

    if (err.name === "AbortError") {
      alert("⚠️ Submission timed out. Please click Continue again.");
    } else {
      alert("❌ Could not submit details. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
    hideOverlay();
  }
}

/* ------------------------------
   Continue buttons
   - Always advance
   - On Review step (contains #certificatePreview), submit BEFORE advancing
--------------------------------*/
continueButtons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const idx = getActiveIndex();
    if (idx === -1) return;

    const isReview = !!sections[idx].querySelector("#certificatePreview");

    if (isReview && !submissionSent) {
      try {
        await submitPatientInfo();
      } catch {
        return; // don't advance if submit failed/timed out
      }
    }

    if (idx < sections.length - 1) {
      showSection(idx + 1);
    }
  });
});

/* ------------------------------
   Back buttons
--------------------------------*/
backButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const idx = getActiveIndex();
    if (idx > 0) showSection(idx - 1);
  });
});

/* ------------------------------
   Payment buttons (Square)
--------------------------------*/
const squareFrameContainer = document.getElementById("squareFrameContainer");
const squareCheckoutFrame = document.getElementById("squareCheckoutFrame");

paymentButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const link = btn.getAttribute("data-link");
    if (!link) return;

    // embed if iframe exists
    if (squareFrameContainer && squareCheckoutFrame) {
      squareCheckoutFrame.src = link;
      squareFrameContainer.style.display = "block";
      squareFrameContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // otherwise open new tab
    window.open(link, "_blank", "noopener,noreferrer");
  });
});
