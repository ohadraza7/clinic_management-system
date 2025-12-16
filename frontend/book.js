var appointmentdetials = {
  DoctorID: "hellow",
  ScheduleID: "",
  Date: "",
  Time: "",
};
console.log(appointmentdetials);
// doctor select onload event
document.querySelector("#did").addEventListener("onload", (e) => {
  e.preventDefault();
  console.log("loaded");
});

// patient table create by this data
const patienttable = async () => {
  const PatientName = document.querySelector("#pid").value;
  const patientPhone = document.querySelector("#ptele").value;
  const Gender = document.querySelector("#gender").value;
  const DoctorName = document.querySelector("#did").value;
  if (sessionStorage.getItem("patientID") === null) {
    const response = await fetch("http://localhost:5000/patient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Name: PatientName,
        Phone: patientPhone,
        Gender: Gender,
      }),
    });
    const result = await response.json();
    appointmentdetials.PatientID = result.PatientID;
    console.log("Patient ID: " + appointmentdetials.PatientID);
    sessionStorage.setItem("patientID", appointmentdetials.PatientID);
    console.log("Saved to session:", appointmentdetials.PatientID);
  } else {
    appointmentdetials.PatientID = sessionStorage.getItem("patientID");
  }
};

const timeSelect = document.querySelector("#time"); // time select element
const dateSelect = document.querySelector("#date"); // date select element

// client side fetch schedules
const schedules = async (doctorID) => {
  patienttable();

  console.log("schedules inside function: " + doctorID);
  const response = await fetch(
    `http://localhost:5000/schedules/${doctorID}`
  ).then((res) => res.json());

  if (timeSelect.options.length > 1 || dateSelect.options.length > 1) {
    timeSelect.innerHTML = '<option value="">Select Time</option>';
    dateSelect.innerHTML = '<option value="">Select Date</option>';
  }
  // populate time and date options
  response.forEach((schedule) => {
    if (
      !Array.from(timeSelect.options).some(
        (option) =>
          option.value === schedule.StartTime + " - " + schedule.EndTime
      )
    ) {
      const option = document.createElement("option"); // time option
      console.log(
        "schedule time: " +
          schedule.Time +
          " , start time: " +
          schedule.StartTime
      );
      option.value = schedule.StartTime + " - " + schedule.EndTime; // option value
      option.textContent = schedule.StartTime + " - " + schedule.EndTime; // option text
      option.dataset.id = schedule.ScheduleID; // store scheduleID in option
      timeSelect.appendChild(option); // append time option
      // avoid duplicate time options
      const optionDate = document.createElement("option"); // date option
      optionDate.value = schedule.AvailableDate.split("T")[0]; // date option value
      optionDate.textContent = schedule.AvailableDate.split("T")[0]; // date option text
      optionDate.dataset.id = schedule.ScheduleID; // store scheduleID in option
      dateSelect.appendChild(optionDate); // append date option
      // avoid duplicate date options
    }
  });
};
// doctor info fetch and specialization auto fill
const Did = document.querySelector("#did");
const speID = document.querySelector("#speID");

const docInfo = async () => {
  const response = await fetch("http://localhost:5000/doctors").then((res) =>
    res.json()
  );

  response.forEach((doctor) => {
    if (
      !Array.from(Did.options).some((option) => option.value === doctor.Name)
    ) {
      // to avoid duplicates
      const option = document.createElement("option");
      option.value = doctor.Name;
      option.textContent = doctor.Name;
      option.dataset.id = doctor.DoctorID; // store doctorID in option
      Did.appendChild(option);
    }
    if (Did.value === "") {
      speID.value = "";
    } else if (doctor.Name === Did.value) {
      // when doctor is selected
      speID.value = doctor.Specialization;
      console.log("Doctor ID: " + doctor.DoctorID);
      appointmentdetials.DoctorID = doctor.DoctorID; // store doctorID in appointmentdetails object
      schedules(doctor.DoctorID); // fetch schedules for selected doctor
    }
  });
};
docInfo();

////// ================== submit form and book appointment ================== /////

document.querySelector("#form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const selectedTimeID =
    timeSelect.options[timeSelect.selectedIndex].dataset.id;
  const selectedDateID =
    dateSelect.options[dateSelect.selectedIndex].dataset.id;
  if (selectedTimeID === selectedDateID) {
    appointmentdetials.ScheduleID = selectedTimeID;
    console.log("Selected ScheduleID: " + appointmentdetials.ScheduleID);
  } else {
    alert(
      "Please select valid time and date" +
        selectedTimeID +
        " " +
        selectedDateID
    );
  }
  const response = await fetch("http://localhost:5000/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      PatientID: appointmentdetials.PatientID,
      DoctorID: appointmentdetials.DoctorID,
      ScheduleID: appointmentdetials.ScheduleID,
      Date: dateSelect.value,
      Time: timeSelect.value,
    }),
  });

  // storing patientID in sessionStorage
  const data = await response.json();
  console.log(data);
  alert(data.message);
});
