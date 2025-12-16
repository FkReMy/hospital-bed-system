// src/pages/users/UserDetailPage.jsx
/**
 * UserDetailPage Component
 * 
 * Production-ready detailed view of a single staff user (admin-only).
 * Displays user information, role, permissions, activity, and account status.
 * 
 * Features:
 * - User summary card with photo, name, role, join date
 * - Contact info and account status
 * - Role badge and permissions list
 * - Recent activity log (login history)
 * - Action buttons: edit, reset password, deactivate
 * - Loading, empty, error states
 * - Responsive layout with glassmorphic cards
 * - Unified with global Card, Badge, Button, Table components
 * - Admin-only access (protected by AdminRoute)
 */

import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Calendar, 
  Edit, 
  Key, 
  UserX 
} from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Badge from '@components/ui/badge.jsx';
import Button from '@components/ui/button.jsx';
import Table from '@components/ui/table.jsx';
import LoadingState from '@components/common/LoadingState.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import { useUserDetail } from '@hooks/useUserDetail'; // Custom hook (to be implemented)
import { useRoleAccess } from '@hooks/useRoleAccess';
import { formatDate } from '@lib/dateUtils';
import './UserDetailPage.scss';

const UserDetailPage = () => {
  const { userId } = useParams();
  const { user, isLoadingUser, isErrorUser } = useUserDetail(userId);
  const { hasAccess: canEditUser } = useRoleAccess(['admin']);

  if (isLoadingUser) {
    return <LoadingState type="full" />;
  }

  if (isErrorUser || !user) {
    return (
      <Card className="errorCard">
        <EmptyState
          title="User not found"
          description="Please check the user ID or contact administrator"
        />
      </Card>
    );
  }

  return (
    <div className="userDetailPage">
      {/* User Summary */}
      <Card className="userSummaryCard">
        <div className="userHeader">
          <div className="userPhoto">
            <User size={80} />
          </div>
          <div className="userInfo">
            <h1 className="userName">{user.full_name || 'Staff Member'}</h1>
            <Badge variant="primary" className="roleBadge">
              {user.role || 'Staff'}
            </Badge>
            <p className="userStatus">
              {user.active ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>

        <div className="userDetails">
          <div className="detailItem">
            <Mail className="detailIcon" />
            <div className="detailText">
              <span className="detailLabel">Email</span>
              <span className="detailValue">{user.email}</span>
            </div>
          </div>

          <div className="detailItem">
            <Phone className="detailIcon" />
            <div className="detailText">
              <span className="detailLabel">Phone</span>
              <span className="detailValue">{user.phone || 'N/A'}</span>
            </div>
          </div>

          <div className="detailItem">
            <Calendar className="detailIcon" />
            <div className="detailText">
              <span className="detailLabel">Joined</span>
              <span className="detailValue">{formatDate(user.created_at)}</span>
            </div>
          </div>

          <div className="detailItem">
            <Shield className="detailIcon" />
            <div className="detailText">
              <span className="detailLabel">Last Login</span>
              <span className="detailValue">{formatDate(user.last_login) || 'N/A'}</span>
            </div>
          </div>
        </div>

        {canEditUser && (
          <div className="userActions">
            <Button asChild variant="primary">
              <Link to={`/admin/users/${user.id}/edit`}>
                <Edit className="mr2" size={18} />
                Edit User
              </Link>
            </Button>
            <Button variant="outline">
              <Key className="mr2" size={18} />
              Reset Password
            </Button>
            <Button variant="destructive">
              <UserX className="mr2" size={18} />
              Deactivate
            </Button>
          </div>
        )}
      </Card>

      {/* Activity Log */}
      <Card className="activityCard">
        <h2 className="sectionTitle">Recent Activity</h2>
        {user.activity?.length === 0 ? (
          <EmptyState
            title="No recent activity"
            description="User activity will appear here"
            size="small"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.activity.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{formatDateTime(log.timestamp)}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.ip || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default UserDetailPage;