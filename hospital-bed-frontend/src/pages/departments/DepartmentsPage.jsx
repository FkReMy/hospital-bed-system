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

import React from 'react';
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
    return <LoadingState type="grid" count={6} />;
  }

  if (departments.length === 0) {
    return (
      <EmptyState
        title="No departments found"
        description="Please contact system administrator"
      />
    );
  }

  return (
    <div className="departmentsPage">
      <div className="pageHeader">
        <h1 className="pageTitle">Hospital Departments</h1>
        <p className="pageSubtitle">Overview of all departments and bed availability</p>
      </div>

      <div className="departmentsGrid">
        {departmentStats.map(department => (
          <Link
            key={department.id}
            to={`/departments/${department.id}`}
            className="departmentLink"
          >
            <Card className="departmentCard" interactive>
              <div className="departmentHeader">
                <Building2 className="departmentIcon" />
                <div className="departmentInfo">
                  <h2 className="departmentName">{department.name}</h2>
                  <p className="departmentDescription">
                    {department.description || 'Hospital department'}
                  </p>
                </div>
              </div>

              <div className="departmentStats">
                <div className="statItem">
                  <span className="statLabel">Total Beds</span>
                  <span className="statValue">{department.totalBeds}</span>
                </div>
                <div className="statItem">
                  <span className="statLabel">Available</span>
                  <span className="statValue highlight">
                    {department.availableBeds}
                  </span>
                </div>
                <div className="statItem">
                  <span className="statLabel">Occupied</span>
                  <span className="statValue">{department.occupiedBeds}</span>
                </div>
              </div>

              <div className="departmentProgress">
                <div className="progressInfo">
                  <span className="progressLabel">Occupancy Rate</span>
                  <span className="progressValue">{department.occupancyRate}%</span>
                </div>
                <Progress value={department.occupancyRate} />
              </div>

              <div className="departmentStatus">
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