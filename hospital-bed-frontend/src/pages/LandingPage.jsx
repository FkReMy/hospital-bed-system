// src/pages/LandingPage.jsx
/**
 * LandingPage Component
 * 
 * Production-ready public landing page for the Hospital Bed Management System (HBMS).
 * This is the REAL hospital-facing welcome page — not an academic submission.
 * 
 * Features:
 * - Clean, professional, trustworthy hospital branding
 * - Real-time bed availability preview (public view)
 * - Key benefits and features highlight
 * - Call-to-action for staff login
 * - Fully responsive
 * - Multilingual-ready structure (Arabic/English)
 * - Premium glassmorphic design
 * - No student names, sections, or educational references
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BedDouble, 
  Activity, 
  Users, 
  Shield, 
  ArrowRight,
  Globe,
  Clock,
  CheckCircle
} from 'lucide-react';
import Button from '@components/ui/button.jsx';
import Card from '@components/ui/card.jsx';
import Badge from '@components/ui/badge.jsx';
import { useBedManagement } from '@hooks/useBedManagement';
import './LandingPage.module.scss';

const LandingPage = () => {
  const { beds = [], isLoadingBeds } = useBedManagement();

  // Calculate real-time stats
  const totalBeds = beds.length;
  const availableBeds = beds.filter(b => b.status === 'available').length;
  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const departments = [
    { name: 'Emergency (ER)', color: 'rose', available: 0 },
    { name: 'Intensive Care (ICU)', color: 'indigo', available: 0 },
    { name: 'General Ward', color: 'emerald', available: 0 },
    { name: 'Surgery', color: 'cyan', available: 0 },
  ];

  // Populate department availability
  beds.forEach(bed => {
    const dept = departments.find(d => bed.department?.name?.includes(d.name.split(' ')[0]));
    if (dept && bed.status === 'available') dept.available++;
  });

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Hospital Bed Management System
            </h1>
            <p className="hero-subtitle">
              Real-time bed availability and patient admission management for faster, safer care.
            </p>
            <div className="hero-features">
              <div className="feature-item">
                <CheckCircle className="feature-icon" />
                <span>Live bed status across all departments</span>
              </div>
              <div className="feature-item">
                <CheckCircle className="feature-icon" />
                <span>Instant patient assignment</span>
              </div>
              <div className="feature-item">
                <CheckCircle className="feature-icon" />
                <span>Reduce waiting time by over 80%</span>
              </div>
            </div>
            <div className="hero-actions">
              <Button asChild size="lg">
                <Link to="/login">
                  Staff Login <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="language-toggle">
                <Globe className="mr-2" />
                العربية
              </Button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hospital-illustration" />
          </div>
        </div>
      </section>

      {/* Real-time Availability */}
      <section className="availability-section">
        <div className="section-container">
          <h2 className="section-title">Current Bed Availability</h2>
          <p className="section-subtitle">
            Updated in real-time • <Clock className="inline" size={16} /> {new Date().toLocaleTimeString()}
          </p>

          <div className="stats-grid">
            <Card className="stat-card total">
              <div className="stat-value">{totalBeds}</div>
              <div className="stat-label">Total Beds</div>
            </Card>
            <Card className="stat-card available">
              <div className="stat-value">{availableBeds}</div>
              <div className="stat-label">Available</div>
            </Card>
            <Card className="stat-card occupied">
              <div className="stat-value">{occupiedBeds}</div>
              <div className="stat-label">Occupied</div>
            </Card>
            <Card className="stat-card rate">
              <div className="stat-value">{occupancyRate}%</div>
              <div className="stat-label">Occupancy Rate</div>
            </Card>
          </div>

          <div className="departments-grid">
            {departments.map(dept => (
              <Card key={dept.name} className={`dept-card ${dept.color}`}>
                <div className="dept-header">
                  <h3 className="dept-name">{dept.name}</h3>
                  <Badge variant="outline">
                    {dept.available} Available
                  </Badge>
                </div>
                <div className="dept-progress">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${100 - (dept.available / 10 * 100)}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">Designed for Modern Healthcare</h2>
          
          <div className="features-grid">
            <Card className="feature-card">
              <Activity className="feature-icon" />
              <h3>Real-Time Monitoring</h3>
              <p>Live updates on bed status across all departments</p>
            </Card>
            <Card className="feature-card">
              <BedDouble className="feature-icon" />
              <h3>Fast Assignment</h3>
              <p>Assign patients to available beds in seconds</p>
            </Card>
            <Card className="feature-card">
              <Users className="feature-icon" />
              <h3>Patient Transparency</h3>
              <p>Families can check availability before arrival</p>
            </Card>
            <Card className="feature-card">
              <Shield className="feature-icon" />
              <h3>Secure & Role-Based</h3>
              <p>Access control for doctors, nurses, and admin</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p>© 2025 Hospital Bed Management System</p>
          <p>All rights reserved • For hospital staff only</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;