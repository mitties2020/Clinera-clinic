<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VividMedi | Medical Certificate Request</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * {margin:0;padding:0;box-sizing:border-box;font-family:'Poppins',sans-serif;}
    body {background:#f9fbfc;display:flex;flex-direction:column;align-items:center;padding:40px 15px;}
    .header {text-align:center;margin-bottom:25px;}
    .brand {font-size:2.2rem;font-weight:600;color:#111;}
    .brand span {color:#4AA7FF;}
    .progress-wrapper {width:100%;max-width:600px;background:#e0e0e0;border-radius:10px;height:8px;margin:15px auto 30px;overflow:hidden;}
    .progress-bar {height:8px;width:12.5%;background:linear-gradient(to right,#4AA7FF,#7BE8D9);transition:width .4s ease;}
    .form-container {background:#fff;width:100%;max-width:600px;padding:35px;border-radius:16px;box-shadow:0 6px 20px rgba(0,0,0,.1);}
    h2 {text-align:center;font-size:1.4rem;margin-bottom:10px;}
    p {text-align:center;color:#666;margin-bottom:25px;font-size:.95rem;}
    .form-section {animation:fadeIn .3s ease;}
    @keyframes fadeIn {from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
    label {display:block;margin:10px 0 5px;font-weight:500;}
    
    /* PERFECT alignment for radio buttons */
    .radio-group {display:grid;grid-template-columns:auto 1fr;row-gap:10px;column-gap:8px;align-items:center;margin-bottom:20px;}
    .radio-group input[type=radio] {accent-color:#4AA7FF;transform:scale(1.2);}
    .radio-group label {margin:0;font-weight:400;}
    
    input,select,textarea {width:100%;padding:10px;border:1px solid #ccc;border-radius:6px;font-size:1rem;}
    .button-row {display:flex;justify-content:center;margin-top:25px;}
    button {padding:14px 40px;border:none;border-radius:6px;font-weight:600;font-size:1rem;color:#fff;cursor:pointer;}
    .continue-btn {background:linear-gradient(to right,#4AA7FF,#7BE8D9);}
  </style>
</head>
<body>
  <div class="header">
    <h1 class="brand">Vivid<span>Medi</span></h1>
    <div class="progress-wrapper"><div class="progress-bar"></div></div>
  </div>

  <div class="form-container" id="step1">
    <h2>Medical Certificate Request</h2>
    <p>Please note: The Partner Doctors are currently unable to review requests for fitness for work certificates as part of your consultation outcome.</p>
    
    <label>I am seeking *</label>
    <div class="radio-group">
      <input type="radio" id="sick" name="certType" value="Sick Leave" checked>
      <label for="sick">Sick Leave</label>
      <input type="radio" id="carer" name="certType" value="Carer's Leave">
      <label for="carer">Carer's Leave</label>
    </div>

    <label>This leave is from *</label>
    <div class="radio-group">
      <input type="radio" id="work" name="leaveFrom" value="Work" checked>
      <label for="work">Work</label>
      <input type="radio" id="studies" name="leaveFrom" value="Studies">
      <label for="studies">Studies</label>
      <input type="radio" id="other" name="leaveFrom" value="Other">
      <label for="other">Other</label>
    </div>

    <div id="otherLeaveField" style="display:none;margin-top:10px;">
      <label>Please specify what this leave is for:</label>
      <input type="text" id="otherLeave" placeholder="e.g. training, volunteer work">
    </div>

    <div class="button-row">
      <button class="continue-btn" id="continueBtn">Continue</button>
    </div>
  </div>

  <script>
    const otherLeaveRadio = document.getElementById("other");
    const otherLeaveField = document.getElementById("otherLeaveField");
    otherLeaveRadio.addEventListener("change", () => {
      otherLeaveField.style.display = "block";
    });
    document.querySelectorAll("input[name='leaveFrom']").forEach(radio => {
      if (radio.id !== "other") {
        radio.addEventListener("change", () => {
          otherLeaveField.style.display = "none";
        });
      }
    });

    // Temporary "continue" click handler for testing
    document.getElementById("continueBtn").addEventListener("click", () => {
      alert("Step 1 complete ✅ — Navigation will continue when Step 2 is added.");
    });
  </script>
</body>
</html>
