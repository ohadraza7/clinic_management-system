const API_URL = "http://localhost:5000/appointments";

fetch(API_URL)
  .then((res) => res.json())
  .then((data) => {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    data.forEach((row) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
              <td>${row.AppointmentID}</td>
              <td>${row.PatientName}</td>
              <td>${row.PatientPhone}</td>
              <td>${row.PatientGender}</td>
              <td>${row.DoctorName}</td>
              <td>${row.DoctorSpecialization}</td>
              <td>${row.AppointmentDate}</td>
              <td>${row.StartTime}</td>
              <td>${row.EndTime}</td>
              <td>${row.AppointmentStatus}</td>
            `;

      tbody.appendChild(tr);
    });
  })
  .catch((err) => {
    console.error("Error loading:", err);
    document.querySelector(
      "tbody"
    ).innerHTML = `<tr><td colspan="10">Error loading appointments.</td></tr>`;
  });
