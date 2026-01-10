fetch("http://localhost:5000/appointments")
  .then((res) => res.json())
  .then((data) => {
    const tbody = document.getElementById("data");
    data.forEach((a) => {
      tbody.innerHTML += `
        <tr>
          <td>${a.AppointmentID}</td>
          <td>${a.PatientName}</td>
          <td>${a.DoctorName}</td>
          <td>${a.AppointmentDate}</td>
          <td>${a.AppointmentStatus}</td>
        </tr>`;
    });
  });
