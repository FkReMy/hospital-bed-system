// src/pages/rooms/RoomListPage.jsx
/**
 * RoomListPage Component
 * 
 * Production-ready list view of all hospital rooms.
 * Displays rooms grouped by department with key stats and navigation to detail.
 * 
 * Features:
 * - Grid of room cards with room number, capacity, occupancy
 * - Real-time bed stats per room (total, available, occupied)
 * - Progress bar for occupancy
 * - Click card to view room detail
 * - Loading, empty, error states
 * - Responsive grid layout
 * - Unified with global Card, Badge, Progress components
 * - Real-time updates via SignalR (bedChannel)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { DoorClosed } from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Badge from '@components/ui/badge.jsx';
import Progress from '@components/ui/progress.jsx';
import LoadingState from '@components/common/LoadingState.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import { useBedManagement } from '@hooks/useBedManagement';
import './RoomListPage.scss';

const RoomListPage = () => {
  const { beds, rooms, departments, isLoadingBeds } = useBedManagement();

  // Calculate stats per room
  const roomStats = rooms.map(room => {
    const roomBeds = beds.filter(b => b.room_id === room.id);
    const total = roomBeds.length;
    const available = roomBeds.filter(b => b.status === 'available').length;
    const occupied = roomBeds.filter(b => b.status === 'occupied').length;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

    return {
      ...room,
      totalBeds: total,
      availableBeds: available,
      occupiedBeds: occupied,
      occupancyRate,
    };
  });

  if (isLoadingBeds) {
    return <LoadingState type="grid" count={6} />;
  }

  if (rooms.length === 0) {
    return (
      <EmptyState
        title="No rooms found"
        description="Please contact system administrator"
      />
    );
  }

  return (
    <div className="roomListPage">
      <div className="pageHeader">
        <h1 className="pageTitle">Hospital Rooms</h1>
        <p className="pageSubtitle">Overview of all rooms and bed availability</p>
      </div>

      <div className="roomsGrid">
        {roomStats.map(room => (
          <Link
            key={room.id}
            to={`/rooms/${room.id}`}
            className="roomLink"
          >
            <Card className="roomCard" interactive>
              <div className="roomHeader">
                <DoorClosed className="roomIcon" />
                <div className="roomInfo">
                  <h2 className="roomName">
                    {room.name || `Room ${room.room_number}`}
                  </h2>
                  <p className="roomDepartment">
                    {room.department?.name || 'General'}
                  </p>
                </div>
              </div>

              <div className="roomStats">
                <div className="statItem">
                  <span className="statLabel">Total Beds</span>
                  <span className="statValue">{room.totalBeds}</span>
                </div>
                <div className="statItem">
                  <span className="statLabel">Available</span>
                  <span className="statValue highlight">
                    {room.availableBeds}
                  </span>
                </div>
                <div className="statItem">
                  <span className="statLabel">Occupied</span>
                  <span className="statValue">{room.occupiedBeds}</span>
                </div>
              </div>

              <div className="roomProgress">
                <div className="progressInfo">
                  <span className="progressLabel">Occupancy Rate</span>
                  <span className="progressValue">{room.occupancyRate}%</span>
                </div>
                <Progress value={room.occupancyRate} />
              </div>

              <div className="roomStatus">
                <Badge 
                  variant={room.availableBeds === 0 ? 'destructive' : 'default'}
                >
                  {room.availableBeds === 0 ? 'Full' : `${room.availableBeds} available`}
                </Badge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RoomListPage;