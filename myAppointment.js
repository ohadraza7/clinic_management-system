const patientID = prompt("Enter your Patient ID:");
const BASE_URL = "http://localhost:5000";

if (!patientID || patientID.trim() === "") {
  alert("Patient ID is required.");
  throw new Error("Patient ID missing");
}

fetch(`${BASE_URL}/patient-appointments/${patientID}`)
  .then((res) => res.json())
  .then((data) => {
    const tbody = document.getElementById("mydata");

    // If patient does not exist or has no records
    if (!Array.isArray(data) || data.length === 0) {
      alert("Invalid Patient ID. No records found.");
      return; // HALT system
    }

    data.forEach((a) => {
      tbody.innerHTML += `
        <tr>
          <td>${a.DoctorName}</td>
          <td>${a.AppointmentDate}</td>
          <td>${a.StartTime} - ${a.EndTime}</td>
          <td>${a.AppointmentStatus}</td>
        </tr>`;
    });
  })
  .catch(() => {
    alert("Unable to fetch appointments. Please try again.");
  });
