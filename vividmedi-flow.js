// vividmedi-flow.js — stable step flow + submit on Review (Step 7)
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
  z-index: 9999;
`;
overlay.textContent = "Submitting…";
document.body.appendChild(overlay);

function showOverlay(msg) {
  overlay.textContent = msg || "Submitting…";
  overlay.style.display = "flex";
}
function hideOverlay() {
  overlay.style.display = "none";
}

/* ------------------------------
   Helpers
--------------------------------*/
function getActiveIndex() {
  return Array.from(sections).findIndex(s => s.classList.contains("active"));
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
  const req = ["email","firstName","lastName","dob","mobile","address","city","state","postcode","fromDate","toDate"];
  return req.filter(k => !p[k]);
}

/* ------------------------------
   Submit
--------------------------------*/
async function submitPatientInfo() {
  if (submissionSent) return submissionResponse;

  const payload = buildPayload();
  const missing = missingRequired(payload);
  if (missing.length) {
    alert("Please complete all required fields.");
    throw new Error("Missing fields");
  }

  showOverlay("Submitting your details…");

  const res = await fetch(SUBMIT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  hideOverlay();

  if (!res.ok || !data.success) {
    throw new Error("Submission failed");
  }

  submissionSent = true;
  submissionResponse = data;
  return data;
}

/* ------------------------------
   Continue buttons
--------------------------------*/
continueButtons.forEach(btn => {
  btn.addEventListener("click", async () => {
    const idx = getActiveIndex();
    if (idx === -1) return;

    const isReview = !!sections[idx].querySelector("#certificatePreview");

    if (isReview && !submissionSent) {
      try {
        await submitPatientInfo();
      } catch {
        return; // stay on review if submit fails
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
backButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const idx = getActiveIndex();
    if (idx > 0) showSection(idx - 1);
  });
});

/* ------------------------------
   Payment buttons
--------------------------------*/
const squareFrameContainer = document.getElementById("squareFrameContainer");
const squareCheckoutFrame = document.getElementById("squareCheckoutFrame");

paymentButtons.forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    const link = btn.getAttribute("data-link");
    if (!link) return;

    if (squareFrameContainer && squareCheckoutFrame) {
      squareCheckoutFrame.src = link;
      squareFrameContainer.style.display = "block";
      squareFrameContainer.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(link, "_blank", "noopener");
    }
  });
});
