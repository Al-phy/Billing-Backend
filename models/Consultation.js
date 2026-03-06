const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Consultation = sequelize.define('Consultation', {
    patientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patientMobile: {
        type: DataTypes.STRING,
        allowNull: true
    },
    doctorName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    occupation: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    gender: { type: DataTypes.ENUM('Male', 'Female', 'Other') },
    email: { type: DataTypes.STRING },
    nextOfKin: { type: DataTypes.JSON }, // { name, relationship, contact }
    familyHistory: { type: DataTypes.JSON }, // { father, mother, others }
    patientHistory: { type: DataTypes.JSON }, // { height, weight, bp, build, foodHabit, addiction, menstrualHistory, bowel, sleep, appetite, urine }
    ashtavidhaPariksha: { type: DataTypes.JSON }, // { nadi, mutra, mala, jihwa, shabda, sparsha, drik, akruthi }
    presentComplaints: { type: DataTypes.TEXT },
    historyOfPresentComplaints: { type: DataTypes.TEXT },
    pastHistory: { type: DataTypes.JSON }, // { majorIllness, treatmentDone, outcome }
    clinicalNotes: { type: DataTypes.TEXT },
    prescription: { type: DataTypes.TEXT },
    consultationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    consultationTime: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Consultation;
