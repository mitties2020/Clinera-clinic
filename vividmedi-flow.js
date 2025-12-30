// vividmedi-flow.js — FINAL stable multi-step flow + Render logging
console.log("✅ vividmedi-flow.js loaded");

// ------------------------------
// DOM
// ------------------------------
const sections = document.querySelectorAll(".form-section");
const progressBar = document.querySelector(".progress-bar");

const continueButtons = document.querySelectorAll(".continue-btn");
const backButtons = document.querySelectorAll(".back-btn");

const paymentTriggers = document.querySelectorAll(".payment-btn, .payment-option");

const squareFrameContainer = document.getElementById("squareFrameContainer");
const squareCheckoutFrame = document.getElementById("squareCheckoutFrame");

// Backend
const SUBMIT_URL = "https://vividmedi-backend.onrender.com/api/submit";

// State
let submissionSent = false;

// ------------------------------
// STEP HELPERS
// ------------------------------
function getActiveStepIndex() {
  return Array.from(sections).findIndex((s) => s.classList.contains("active"));
}

function showSection(index) {
  sections.forEach((sec, i) => {
    sec.classList.toggle("active", i === index);
  });

  if (progressBar) {
    progressBar.style.width = `${((index + 1) / sections.length) * 100}%`;
  }
}

// Init
showSection(0);

// ------------------------------
// OPTIONAL: show/hide Other leave field
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
// BUILD PAYLOAD (sent to backend)
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
    ts: new Date().toISOString(),
  };
}

// ------------------------------
// LOG TO BACKEND (ONCE, NON-BLOCKING)
// ------------------------------
function submitPatientInfoOnce() {
  if (submissionSent) return;
  submissionSent = true;

  const payload = buildPayload();

  fetch(SUBMIT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("📩 Logged to backend:", data);
    })
    .catch((err) => {
      console.error("❌ submitPatientInfoOnce failed:", err);
      submissionSent = false; // allow retry
    });
}

// ------------------------------
// CONTINUE BUTTONS (CRITICAL FIX)
// ------------------------------
continueButtons.forEach((btn) => {
  btn.setAttribute("type", "button"); // 🔥 FORCE non-submit

  btn.addEventListener("click", (e) => {
    e.preventDefault();      // 🔥 STOP form submit
    e.stopPropagation();

    const activeIndex = getActiveStepIndex();
    if (activeIndex === -1) return;

    const nextIndex = Math.min(activeIndex + 1, sections.length - 1);
    showSection(nextIndex);
  });
});

// ------------------------------
// BACK BUTTONS
// ------------------------------
backButtons.forEach((btn) => {
  btn.setAttribute("type", "button"); // 🔥 FORCE non-submit

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const activeIndex = getActiveStepIndex();
    if (activeIndex === -1) return;

    showSection(Math.max(0, activeIndex - 1));
  });
});

// ------------------------------
// PAYMENT TRIGGERS
// ------------------------------
let paymentLock = false;

paymentTriggers.forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (paymentLock) return;
    paymentLock = true;

    const link = el.classList.contains("payment-btn")
      ? el.getAttribute("data-link")
      : el.getAttribute("href");

    if (!link) {
      paymentLock = false;
      return;
    }

    // Fire-and-forget logging
    submitPatientInfoOnce();

    // Open payment immediately
    if (squareFrameContainer && squareCheckoutFrame) {
      squareCheckoutFrame.src = link;
      squareFrameContainer.style.display = "block";
      squareFrameContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.open(link, "_blank", "noopener,noreferrer");
    }

    setTimeout(() => {
      paymentLock = false;
    }, 800);
  });
});
