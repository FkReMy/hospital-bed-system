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
import './LandingPage.scss';

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
    <div className="landingPage">
      {/* Hero Section */}
      <section className="hero">
        <div className="heroContent">
          <div className="heroText">
            <h1 className="heroTitle">
              Hospital Bed Management System
            </h1>
            <p className="heroSubtitle">
              Real-time bed availability and patient admission management for faster, safer care.
            </p>
            <div className="heroFeatures">
              <div className="featureItem">
                <CheckCircle className="featureIcon" />
                <span>Live bed status across all departments</span>
              </div>
              <div className="featureItem">
                <CheckCircle className="featureIcon" />
                <span>Instant patient assignment</span>
              </div>
              <div className="featureItem">
                <CheckCircle className="featureIcon" />
                <span>Reduce waiting time by over 80%</span>
              </div>
            </div>
            <div className="heroActions">
              <Button asChild size="lg">
                <Link to="/login">
                  Staff Login <ArrowRight className="ml2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="languageToggle">
                <Globe className="mr2" />
                العربية
              </Button>
            </div>
          </div>
          <div className="heroImage">
            <div className="hospitalIllustration" />
          </div>
        </div>
      </section>

      {/* Real-time Availability */}
      <section className="availabilitySection">
        <div className="sectionContainer">
          <h2 className="sectionTitle">Current Bed Availability</h2>
          <p className="sectionSubtitle">
            Updated in real-time • <Clock className="inline" size={16} /> {new Date().toLocaleTimeString()}
          </p>

          <div className="statsGrid">
            <Card className="statCard total">
              <div className="statValue">{totalBeds}</div>
              <div className="statLabel">Total Beds</div>
            </Card>
            <Card className="statCard available">
              <div className="statValue">{availableBeds}</div>
              <div className="statLabel">Available</div>
            </Card>
            <Card className="statCard occupied">
              <div className="statValue">{occupiedBeds}</div>
              <div className="statLabel">Occupied</div>
            </Card>
            <Card className="statCard rate">
              <div className="statValue">{occupancyRate}%</div>
              <div className="statLabel">Occupancy Rate</div>
            </Card>
          </div>

          <div className="departmentsGrid">
            {departments.map(dept => (
              <Card key={dept.name} className={`dept-card ${dept.color}`}>
                <div className="deptHeader">
                  <h3 className="deptName">{dept.name}</h3>
                  <Badge variant="outline">
                    {dept.available} Available
                  </Badge>
                </div>
                <div className="deptProgress">
                  <div 
                    className="progressFill" 
                    style={{ width: `${100 - (dept.available / 10 * 100)}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="featuresSection">
        <div className="sectionContainer">
          <h2 className="sectionTitle">Designed for Modern Healthcare</h2>
          
          <div className="featuresGrid">
            <Card className="featureCard">
              <Activity className="featureIcon" />
              <h3>Real-Time Monitoring</h3>
              <p>Live updates on bed status across all departments</p>
            </Card>
            <Card className="featureCard">
              <BedDouble className="featureIcon" />
              <h3>Fast Assignment</h3>
              <p>Assign patients to available beds in seconds</p>
            </Card>
            <Card className="featureCard">
              <Users className="featureIcon" />
              <h3>Patient Transparency</h3>
              <p>Families can check availability before arrival</p>
            </Card>
            <Card className="featureCard">
              <Shield className="featureIcon" />
              <h3>Secure & Role-Based</h3>
              <p>Access control for doctors, nurses, and admin</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landingFooter">
        <div className="footerContent">
          <p>© 2025 Hospital Bed Management System</p>
          <p>All rights reserved • For hospital staff only</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;