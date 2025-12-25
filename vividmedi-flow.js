document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".form-section");
  const progressBar = document.querySelector(".progress-bar");
  let currentStep = 0;

  const otherCertField = document.getElementById("otherPurposeField");
  const otherCertInput = document.getElementById("otherPurpose");

  document.querySelectorAll("input[name='certType']").forEach(r => {
    r.addEventListener("change", () => {
      if (r.value === "Other") otherCertField.style.display = "block";
      else otherCertField.style.display = "none";
    });
  });

  function showStep(index){
    steps.forEach((s,i)=>s.classList.toggle("active",i===index));
    progressBar.style.width=`${((index+1)/steps.length)*100}%`;
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function validateDates(){
    const from=new Date(document.getElementById("fromDate").value);
    const to=new Date(document.getElementById("toDate").value);
    const today=new Date();
    const sevenDaysAgo=new Date(today); sevenDaysAgo.setDate(today.getDate()-7);
    const diffDays=(to-from)/(1000*60*60*24);
    const err=document.getElementById("dateError");
    if(isNaN(from)||isNaN(to))return false;
    if(from<sevenDaysAgo){err.textContent="Start date cannot be more than 7 days before today.";err.style.display="block";return false;}
    if(to<from){err.textContent="End date must be after start date.";err.style.display="block";return false;}
    if(diffDays>=5){err.textContent="Date range cannot exceed 5 days.";err.style.display="block";return false;}
    err.style.display="none";return true;
  }

  function updateCertificatePreview(){
    const fname=document.getElementById("firstName").value;
    const lname=document.getElementById("lastName").value;
    const certType=document.querySelector("input[name='certType']:checked").value;
    const reason=document.querySelector("input[name='reason']:checked").value;
    const from=document.getElementById("fromDate").value;
    const to=document.getElementById("toDate").value;
    const otherText=otherCertInput.value.trim();
    let context="work due to illness";

    if(certType==="Sick Leave") context="work due to illness";
    else if(certType==="Carer's Leave") context="caring responsibilities";
    else if(certType==="Other" && otherText) context=otherText;

    const preview=document.getElementById("certificatePreview");
    preview.innerHTML=`
      <strong>Medical Certificate</strong><br><br>
      <p>I certify that in my medical opinion <strong>${fname} ${lname}</strong> is unfit for <strong>${context}</strong> and should be excused from duties from <strong>${from}</strong> to <strong>${to}</strong> inclusive.</p>
      <p><em>Reason:</em> ${reason}</p>
      <p><small>Please check all information is correct before submission.</small></p>
    `;
  }

  document.querySelectorAll(".continue-btn").forEach(btn=>{
    btn.addEventListener("click",e=>{
      e.preventDefault();
      if(currentStep===2&&!validateDates())return;
      if(currentStep===6)updateCertificatePreview();
      if(currentStep<steps.length-1)currentStep++;
      showStep(currentStep);
    });
  });

  document.querySelectorAll(".back-btn").forEach(btn=>{
    btn.addEventListener("click",e=>{
      e.preventDefault();
      if(currentStep>0)currentStep--;
      showStep(currentStep);
    });
  });

  document.querySelectorAll(".payment-option").forEach(opt=>{
    opt.addEventListener("click",()=>{
      document.querySelectorAll(".payment-option").forEach(o=>o.classList.remove("active"));
      opt.classList.add("active");
    });
  });

  showStep(currentStep);
});
