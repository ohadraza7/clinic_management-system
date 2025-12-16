
      // Set Patient ID here (e.g., saved after login)
        const patientID = sessionStorage.getItem("patientID");
        console.log("Patient ID from session:", patientID);

      fetch(`http://localhost:5000/patient-appointments/${patientID}`)
        .then(res => res.json())
        .then(data => {
          const tbody = document.querySelector("tbody");
          tbody.innerHTML = "";

          data.forEach(a => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${a.AppointmentID}</td>
              <td>${a.DoctorName}</td>
              <td>${a.DoctorSpecialization}</td>
              <td>${a.AppointmentDate}</td>
              <td>${a.StartTime} - ${a.EndTime}</td>
              <td>${a.AppointmentStatus}</td>
            `;
            tbody.appendChild(tr);
            console.log(tr);
            console.log(tbody);
          });
        })
        .catch(err => {
          document.querySelector("tbody").innerHTML =
            `<tr><td colspan="6">Failed to load.</td></tr>`;
          console.error(err);
        });
    