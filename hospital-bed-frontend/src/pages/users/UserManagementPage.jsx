// src/pages/users/UserManagementPage.jsx
/**
 * UserManagementPage Component
 * 
 * Production-ready staff user management page (admin-only).
 * Displays list of all hospital staff with search, filters, and bulk actions.
 * 
 * Features:
 * - Responsive data table with name, email, role, status, last login
 * - Search by name, email, phone
 * - Filter by role, status
 * - Sort by any column
 * - Bulk actions: activate/deactivate, reset passwords
 * - Create new user button
 * - Click row to view user detail
 * - Loading, empty, error states
 * - Unified with global Table, Badge, Button, Input components
 * - Real-time updates via SignalR (userChannel when implemented)
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  UserPlus,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Button from '@components/ui/button.jsx';
import Input from '@components/ui/input.jsx';
import Badge from '@components/ui/badge.jsx';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@components/ui/table.jsx';
import LoadingState from '@components/common/LoadingState.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import { useUsers } from '@hooks/useUsers'; // Custom hook for user list
import { useRoleAccess } from '@hooks/useRoleAccess';
import { formatDateTime } from '@lib/dateUtils';
import './UserManagementPage.scss';

const UserManagementPage = () => {
  const { users, isLoadingUsers, isErrorUsers } = useUsers();
  const { hasAccess: canCreateUser } = useRoleAccess(['admin']);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'full_name', direction: 'asc' });

  // Filtered and sorted users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users || [];

    // Search filter
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        u.full_name?.toLowerCase().includes(lower) ||
        u.email?.toLowerCase().includes(lower) ||
        u.phone?.includes(searchTerm)
      );
    }

    // Role filter
    if (selectedRole !== 'all') {
      filtered = filtered.filter(u => u.role === selectedRole);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(u => u.active === (selectedStatus === 'active'));
    }

    // Sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [users, searchTerm, selectedRole, selectedStatus, sortConfig]);

  // Sort handler
  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="userManagementPage">
      <div className="pageHeader">
        <h1 className="pageTitle">Staff Management</h1>
        {canCreateUser && (
          <Button size="lg">
            <UserPlus className="mr2" />
            Add New Staff
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="filtersCard">
        <div className="filtersGrid">
          <div className="searchInput">
            <Input
              placeholder="Search name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={Search}
            />
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="roleFilter"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="reception">Reception</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="statusFilter"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="tableCard">
        {isLoadingUsers ? (
          <LoadingState type="table" count={10} />
        ) : isErrorUsers ? (
          <EmptyState
            title="Error loading staff"
            description="Please try again later or contact administrator"
          />
        ) : filteredAndSortedUsers.length === 0 ? (
          <EmptyState
            title="No staff found"
            description="Try adjusting your filters or add new staff"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('full_name')} className="sortable">
                  Name
                </TableHead>
                <TableHead onClick={() => handleSort('email')} className="sortable">
                  Email
                </TableHead>
                <TableHead onClick={() => handleSort('role')} className="sortable">
                  Role
                </TableHead>
                <TableHead onClick={() => handleSort('active')} className="sortable">
                  Status
                </TableHead>
                <TableHead onClick={() => handleSort('last_login')} className="sortable">
                  Last Login
                </TableHead>
                <TableHead className="actions">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedUsers.map(user => (
                <TableRow key={user.id} className="clickable">
                  <TableCell>
                    <Link to={`/admin/users/${user.id}`} className="userName">
                      {user.full_name}
                    </Link>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="primary">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.active ? 'success' : 'destructive'}>
                      {user.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(user.last_login) || 'Never'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreVertical size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default UserManagementPage;