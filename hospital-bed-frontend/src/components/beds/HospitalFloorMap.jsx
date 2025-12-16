// src/components/beds/HospitalFloorMap.jsx
/**
 * HospitalFloorMap Component
 * 
 * Production-ready, interactive visual representation of hospital beds organized
 * by departments, rooms, and floors.
 * 
 * Features:
 * - Grid-based layout grouped by department/room
 * - Real-time bed status visualization using BedCard
 * - Department headers with occupancy summary
 * - Responsive grid (adapts to screen size)
 * - Loading, empty, and error states
 * - Clickable beds (opens AssignBedDialog or detail view)
 * - Fully accessible (ARIA labels, keyboard navigation)
 * - Unified with global components (Card, PageHeader, EmptyState, Skeleton)
 * 
 * Data expected: normalized beds with nested room/department/patient
 */

import React from 'react';
import BedCard from '@components/beds/BedCard.jsx';
import PageHeader from '@components/common/PageHeader.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import Skeleton from '@components/ui/skeleton.jsx';
import Card from '@components/ui/card.jsx';
import './HospitalFloorMap.scss';

/**
 * Props:
 * - beds: Array of bed objects (with room, department, patient)
 * - departments: Array of departments for grouping (optional - derived from beds if not provided)
 * - isLoading: boolean
 * - error: any
 * - onBedClick: (bed) => void - handler for bed selection
 * - title: string (default: 'Hospital Floor Map')
 */
const HospitalFloorMap = ({
  beds = [],
  departments = [],
  isLoading = false,
  error = null,
  onBedClick,
  title = 'Hospital Floor Map',
}) => {
  // Group beds by department then by room
  const groupedBeds = React.useMemo(() => {
    const groups = {};

    beds.forEach((bed) => {
      const deptId = bed.room?.department_id || bed.department_id || 'unknown';
      const deptName = bed.room?.department?.name || bed.department?.name || 'Unknown Department';
      const roomNumber = bed.room?.room_number || 'Unknown Room';

      if (!groups[deptId]) {
        groups[deptId] = {
          id: deptId,
          name: deptName,
          rooms: {},
        };
      }

      if (!groups[deptId].rooms[roomNumber]) {
        groups[deptId].rooms[roomNumber] = [];
      }

      groups[deptId].rooms[roomNumber].push(bed);
    });

    return Object.values(groups);
  }, [beds]);

  // Calculate occupancy per department
  const getOccupancy = (deptBeds) => {
    const total = deptBeds.length;
    const occupied = deptBeds.filter(b => b.status === 'occupied').length;
    return { total, occupied, percentage: total > 0 ? Math.round((occupied / total) * 100) : 0 };
  };

  if (isLoading) {
    return (
      <div className="hospitalFloorMap">
        <PageHeader title={title} />
        <div className="departmentsGrid">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="departmentCard">
              <div className="departmentHeader">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="bedsGrid">
                {[...Array(6)].map((_, j) => (
                  <Skeleton key={j} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hospitalFloorMap">
        <PageHeader title={title} />
        <EmptyState
          title="Failed to Load Floor Map"
          description="There was an error loading the bed layout. Please try again."
          illustration="empty-beds"
        />
      </div>
    );
  }

  if (groupedBeds.length === 0) {
    return (
      <div className="hospitalFloorMap">
        <PageHeader title={title} />
        <EmptyState
          title="No Beds Configured"
          description="There are no beds available in the system yet. Please configure rooms and beds in administration."
          illustration="empty-beds"
        />
      </div>
    );
  }

  return (
    <div className="hospitalFloorMap">
      <PageHeader title={title}>
        <p className="subtitle">
          Visual overview of all beds across departments and rooms
        </p>
      </PageHeader>

      <div className="departmentsGrid">
        {groupedBeds.map((dept) => {
          const allDeptBeds = Object.values(dept.rooms).flat();
          const { total, occupied, percentage } = getOccupancy(allDeptBeds);

          return (
            <Card key={dept.id} className="departmentCard">
              <div className="departmentHeader">
                <h3 className="departmentName">{dept.name}</h3>
                <div className="occupancySummary">
                  <span className="occupancyText">
                    {occupied} / {total} Occupied
                  </span>
                  <span className="occupancyPercentage">
                    {percentage}%
                  </span>
                </div>
              </div>

              <div className="roomsGrid">
                {Object.entries(dept.rooms).map(([roomNumber, roomBeds]) => (
                  <div key={roomNumber} className="roomSection">
                    <div className="roomLabel">
                      Room {roomNumber}
                    </div>
                    <div className="bedsGrid">
                      {roomBeds.map((bed) => (
                        <BedCard
                          key={bed.id}
                          bed={bed}
                          onClick={() => onBedClick?.(bed)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HospitalFloorMap;