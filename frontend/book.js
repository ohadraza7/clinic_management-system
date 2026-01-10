let step = 1;
let patientID, doctorID, scheduleID;

document.getElementById("nextBtn").addEventListener("click", function () {
  const name = document.getElementById("patientName").value;
  const phone = document.getElementById("patientPhone").value;
  const gender = document.getElementById("patientGender").value;

  // Clear previous messages
  document.getElementById("nameError").innerText = "";
  document.getElementById("phoneError").innerText = "";
  document.getElementById("genderError").innerText = "";

  let isValid = true;

  // Name Validation
  if (name === "") {
    document.getElementById("nameError").innerText = "Patient name is required";
    alert("Patient name is required");
    isValid = false;
  }

  // Phone Validation
  if (!/^\d{11}$/.test(phone)) {
    document.getElementById("phoneError").innerText =
      "Enter a valid 11-digit phone number";
    alert("Enter a valid 11-digit phone number");
    isValid = false;
  }

  // Gender Validation
  if (gender === "") {
    document.getElementById("genderError").innerText = "Please select gender";
    alert("Please select gender");
    isValid = false;
  }

  if (!isValid) return;

  // If all validations pass
  const patient = {
    name,
    phone,
    gender,
  };

  sessionStorage.setItem("patient", JSON.stringify(patient));

  // Create patient only after validation passes
  PatientCreate();

  // Move to next step
  document.getElementById("step1").style.display = "none";
  document.getElementById("step2").style.display = "block";
});

function nextStep() {
  document.getElementById(`step${step}`).classList.remove("active");
  step++;
  document.getElementById(`step${step}`).classList.add("active");
}

function prevStep() {
  document.getElementById(`step${step}`).classList.remove("active");
  step--;
  document.getElementById(`step${step}`).classList.add("active");
}

// Load doctors
fetch("http://localhost:5000/doctors")
  .then((res) => res.json())
  .then((data) => {
    const d = document.getElementById("doctor");
    data.forEach((doc) => {
      d.innerHTML += `<option value="${doc.DoctorID}" data-spec="${doc.Specialization}">
        ${doc.Name}</option>`;
    });
  });

document.getElementById("doctor").addEventListener("change", (e) => {
  doctorID = e.target.value;
  document.getElementById("specialization").value =
    e.target.selectedOptions[0].dataset.spec;

  fetch(`http://localhost:5000/schedules/${doctorID}`)
    .then((res) => res.json())
    .then((data) => {
      const s = document.getElementById("schedule");
      s.innerHTML = "";
      data.forEach((sc) => {
        s.innerHTML += `<option value="${sc.ScheduleID}">
          ${sc.AvailableDate} (${sc.StartTime} - ${sc.EndTime})
        </option>`;
      });
    });
});

function validatePatient(name, phone, gender) {
  if (!name || !phone || !gender) {
    return false;
  }
  return true;
}

function PatientCreate() {
  const name = document.getElementById("patientName").value.trim();
  const phone = document.getElementById("patientPhone").value.trim();
  const gender = document.getElementById("patientGender").value;

  fetch("http://localhost:5000/patient", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      Name: name,
      Phone: phone,
      Gender: gender,
    }),
  })
    .then((res) => res.json())
    .then((p) => {
      alert(`This is your PatientID Copy It ${p.PatientID}`);
      patientID = p.PatientID;
    });
}

function book() {
  scheduleID = document.getElementById("schedule").value;

  fetch("http://localhost:5000/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      PatientID: patientID,
      DoctorID: doctorID,
      ScheduleID: scheduleID,
    }),
  })
    .then((res) => res.json())
    .then((data) => alert(data.message));
}
