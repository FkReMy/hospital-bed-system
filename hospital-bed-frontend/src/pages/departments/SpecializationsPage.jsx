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
import './SpecializationsPage.module.scss';

const SpecializationsPage = () => {
  return (
    <div className="specializations-page">
      {/* Header with Logos */}
      <header className="page-header">
        <div className="logos">
          <div className="logo-modern-academy" />
          <div className="logo-ministry" />
        </div>

        <div className="academy-info">
          <h1 className="academy-name">Modern Academy</h1>
          <h2 className="academy-subtitle">For Engineering & Technology</h2>
          <p className="department">Computer Engineering & Information Technology</p>
          <p className="academic-year">Academic Year 2025/2026</p>
        </div>
      </header>

      {/* Project Title */}
      <main className="project-info">
        <h1 className="project-title">
          Hospital Bed Management System (HBMS)
        </h1>

        <p className="course-codes">
          Information Systems (CMPN325 & CMP425)
        </p>

        {/* Submitted By */}
        <section className="submitted-by">
          <h3>Submitted By:</h3>
          <ul className="students-list">
            <li>
              <span className="student-name">Ahmed Abd Elaziem Ahmed</span>
              <span className="section">Section 5</span>
            </li>
            <li>
              <span className="student-name">Ahmed Gamal Abd Elnasser</span>
              <span className="section">Section 5</span>
            </li>
            <li>
              <span className="student-name">Sherif Emad Omer</span>
              <span className="section">Section 5</span>
            </li>
            <li>
              <span className="student-name">Yassmin Ahmed Said</span>
              <span className="section">Section 6</span>
            </li>
            <li>
              <span className="student-name">Mariaa Anglo Wajih</span>
              <span className="section">Section 5</span>
            </li>
            <li>
              <span className="student-name">Nada Mohamed Youssef</span>
              <span className="section">Section 4</span>
            </li>
            <li>
              <span className="student-name">Logyn Ibrahim Mostafa</span>
              <span className="section">Section 2</span>
            </li>
          </ul>
        </section>

        {/* Submitted To */}
        <section className="submitted-to">
          <h3>Submitted to:</h3>
          <p className="supervisor-name">Dr. Sherin Omran</p>
        </section>
      </main>
    </div>
  );
};

export default SpecializationsPage;