// src/pages/departments/SpecializationsPage.jsx
/**
 * SpecializationsPage Component
 * 
 * Production-ready static academic project documentation page.
 * Displays the official project cover sheet for submission to Modern Academy.
 * 
 * This is NOT part of the live HBMS application — it is the formal academic submission front page.
 * 
 * Features:
 * - Exact replica of the official project cover sheet
 * - Modern Academy and Ministry branding
 * - Project title, department, academic year
 * - Complete student submission list with sections
 * - Supervisor name
 * - Clean, printable layout
 * - No interactivity or data fetching
 * - Responsive for viewing/printing
 */

import React from 'react';
import './SpecializationsPage.scss';

const SpecializationsPage = () => {
  return (
    <div className="specializationsPage">
      {/* Header with Logos */}
      <header className="pageHeader">
        <div className="logos">
          <div className="logoModernAcademy" />
          <div className="logoMinistry" />
        </div>

        <div className="academyInfo">
          <h1 className="academyName">Modern Academy</h1>
          <h2 className="academySubtitle">For Engineering & Technology</h2>
          <p className="department">Computer Engineering & Information Technology</p>
          <p className="academicYear">Academic Year 2025/2026</p>
        </div>
      </header>

      {/* Project Title */}
      <main className="projectInfo">
        <h1 className="projectTitle">
          Hospital Bed Management System (HBMS)
        </h1>

        <p className="courseCodes">
          Information Systems (CMPN325 & CMP425)
        </p>

        {/* Submitted By */}
        <section className="submittedBy">
          <h3>Submitted By:</h3>
          <ul className="studentsList">
            <li>
              <span className="studentName">Ahmed Abd Elaziem Ahmed</span>
              <span className="section">Section 5</span>
            </li>
            <li>
              <span className="studentName">Ahmed Gamal Abd Elnasser</span>
              <span className="section">Section 5</span>
            </li>
            <li>
              <span className="studentName">Sherif Emad Omer</span>
              <span className="section">Section 5</span>
            </li>
            <li>
              <span className="studentName">Yassmin Ahmed Said</span>
              <span className="section">Section 6</span>
            </li>
            <li>
              <span className="studentName">Mariaa Anglo Wajih</span>
              <span className="section">Section 5</span>
            </li>
            <li>
              <span className="studentName">Nada Mohamed Youssef</span>
              <span className="section">Section 4</span>
            </li>
            <li>
              <span className="studentName">Logyn Ibrahim Mostafa</span>
              <span className="section">Section 2</span>
            </li>
          </ul>
        </section>

        {/* Submitted To */}
        <section className="submittedTo">
          <h3>Submitted to:</h3>
          <p className="supervisorName">Dr. Sherin Omran</p>
        </section>
      </main>
    </div>
  );
};

export default SpecializationsPage;