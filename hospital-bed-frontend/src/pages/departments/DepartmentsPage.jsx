// src/pages/departments/DepartmentsPage.jsx
/**
 * DepartmentsPage Component
 * 
 * Production-ready list view of all hospital departments.
 * Displays department cards with key stats and quick navigation to detail.
 * 
 * Features:
 * - Grid of department cards
 * - Real-time bed stats per department (total, available, occupancy %)
 * - Progress bar for occupancy
 * - Click card to view department detail
 * - Loading, empty, error states
 * - Responsive grid layout
 * - Unified with global Card, Badge, Progress components
 * - Real-time updates via SignalR (bedChannel)
 */

import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Badge from '@components/ui/badge.jsx';
import Progress from '@components/ui/progress.jsx';
import LoadingState from '@components/common/LoadingState.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import { useBedManagement } from '@hooks/useBedManagement';
import './DepartmentsPage.scss';

const DepartmentsPage = () => {
  const { beds, departments, isLoadingBeds } = useBedManagement();

  // Calculate stats per department
  const departmentStats = departments.map(dept => {
    const deptBeds = beds.filter(b => b.department_id === dept.id);
    const total = deptBeds.length;
    const available = deptBeds.filter(b => b.status === 'available').length;
    const occupied = deptBeds.filter(b => b.status === 'occupied').length;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

    return {
      ...dept,
      totalBeds: total,
      availableBeds: available,
      occupiedBeds: occupied,
      occupancyRate,
    };
  });

  if (isLoadingBeds) {
    return <LoadingState count={6} type="grid" />;
  }

  if (departments.length === 0) {
    return (
      <EmptyState
        description="Please contact system administrator"
        title="No departments found"
      />
    );
  }

  return (
    <div className="departments-page">
      <div className="page-header">
        <h1 className="page-title">Hospital Departments</h1>
        <p className="page-subtitle">Overview of all departments and bed availability</p>
      </div>

      <div className="departments-grid">
        {departmentStats.map(department => (
          <Link
            className="department-link"
            key={department.id}
            to={`/departments/${department.id}`}
          >
            <Card interactive className="department-card">
              <div className="department-header">
                <Building2 className="department-icon" />
                <div className="department-info">
                  <h2 className="department-name">{department.name}</h2>
                  <p className="department-description">
                    {department.description || 'Hospital department'}
                  </p>
                </div>
              </div>

              <div className="department-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Beds</span>
                  <span className="stat-value">{department.totalBeds}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Available</span>
                  <span className="stat-value highlight">
                    {department.availableBeds}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Occupied</span>
                  <span className="stat-value">{department.occupiedBeds}</span>
                </div>
              </div>

              <div className="department-progress">
                <div className="progress-info">
                  <span className="progress-label">Occupancy Rate</span>
                  <span className="progress-value">{department.occupancyRate}%</span>
                </div>
                <Progress value={department.occupancyRate} />
              </div>

              <div className="department-status">
                <Badge 
                  variant={department.availableBeds === 0 ? 'destructive' : 'default'}
                >
                  {department.availableBeds === 0 ? 'Full' : `${department.availableBeds} available`}
                </Badge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsPage;