import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();

app.use(express.json());
app.use(cors());

// patient data insertion
app.post("/patient", (req, res) => {
  const { Name, Phone, Gender } = req.body;
  console.log("name: " + Name, "phone: " + Phone, "gender: " + Gender);
  const sql = `
        INSERT INTO Patient (Name, Phone, Gender)
        VALUES (?, ?, ?);

    `;

  db.query(sql, [Name, Phone, Gender], (err, results) => {
    if (err) {
      console.log("Error: " + err);
      return res.json({ error: err });
    }
    res.json({
      message: "Patient Data Inserted!",
      PatientID: results.insertId,
    });
    console.log(results);
  });
});

// schedule data extract to backend from data base
app.get("/schedules/:doctorID", (req, res) => {
  const doctorID = req.params.doctorID;
  const sql = `
        SELECT * from Schedule WHERE DoctorID = ?
    `;

  db.query(sql, [doctorID], (err, results) => {
    if (err) {
      console.log("Error: " + err);
      return res.json({ error: err });
    }
    console.log(results);
    res.json(results);
  });
});

// Book appointment
app.post("/book", (req, res) => {
  const { PatientID, DoctorID, ScheduleID } = req.body;
  console.log(req.body);
  const sql = `

      
      INSERT INTO Appointment (PatientID, DoctorID, ScheduleID)
      VALUES (?, ?, ?)
  `;

  db.query(sql, [PatientID, DoctorID, ScheduleID], (err) => {
    if (err) {
      console.log("Error: " + err);
      return res.json({ error: err });
    }
    res.json({ message: "Appointment Booked!" });
  });
});

// doctor list
app.get("/doctors", (req, res) => {
  const doclist = `
        SELECT * from Doctor`;

  db.query(doclist, (err, results) => {
    if (err) {
      return res.json({ error: err });
    }
    res.json(results);
  });
});

// View appointments
app.get("/appointments", (req, res) => {
  const sql = `

    SELECT 
    Appointment.AppointmentID AS AppointmentID,
    Patient.Name AS PatientName,
    Patient.Phone AS PatientPhone,
    Patient.Gender AS PatientGender,
    Doctor.Name AS DoctorName,
    Doctor.Specialization AS DoctorSpecialization,
    Schedule.AvailableDate AS AppointmentDate,
    Schedule.StartTime AS StartTime,
    Schedule.EndTime AS EndTime,
    Appointment.Status AS AppointmentStatus
    FROM Appointment
    JOIN Patient ON Appointment.PatientID = Patient.PatientID
    JOIN Doctor ON Appointment.DoctorID = Doctor.DoctorID
    JOIN Schedule ON Appointment.ScheduleID = Schedule.ScheduleID;
    `;

  db.query(sql, (err, result) => {
    if (err) return res.json({ error: err });
    res.json(result);
  });
});

app.get("/patient-appointments/:patientID", (req, res) => {
  console.log("Fetching appointments for patient ID:", req.params.patientID);
  const patientID = req.params.patientID;

  const query = `
      SELECT 
          a.AppointmentID,
          p.Name AS PatientName,
          p.Phone AS PatientPhone,
          d.Name AS DoctorName,
          d.Specialization AS DoctorSpecialization,
          s.AvailableDate AS AppointmentDate,
          s.StartTime,
          s.EndTime,
          a.Status AS AppointmentStatus
      FROM Appointment a
      JOIN Patient p ON a.PatientID = p.PatientID
      JOIN Doctor d ON a.DoctorID = d.DoctorID
      JOIN Schedule s ON a.ScheduleID = s.ScheduleID
      WHERE a.PatientID = ?
    `;

  db.query(query, [patientID], (err, results) => {
    if (err) return res.json({ error: err });
    res.json(results);
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
