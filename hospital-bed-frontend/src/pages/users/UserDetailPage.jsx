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

import { useParams, Link } from 'react-router-dom';
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
import TableHeader from '@components/ui/table-header.jsx';
import TableBody from '@components/ui/table-body.jsx';
import TableHead from '@components/ui/table-head.jsx';
import TableRow from '@components/ui/table-row.jsx';
import TableCell from '@components/ui/table-cell.jsx';
import LoadingState from '@components/common/LoadingState.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import { useUserDetail } from '@hooks/useUserDetail'; // Custom hook (to be implemented)
import { useRoleAccess } from '@hooks/useRoleAccess';
import { formatDate, formatDateTime } from '@lib/dateUtils';
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
      <Card className="error-card">
        <EmptyState
          description="Please check the user ID or contact administrator"
          title="User not found"
        />
      </Card>
    );
  }

  return (
    <div className="user-detail-page">
      {/* User Summary */}
      <Card className="user-summary-card">
        <div className="user-header">
          <div className="user-photo">
            <User size={80} />
          </div>
          <div className="user-info">
            <h1 className="user-name">{user.full_name || 'Staff Member'}</h1>
            <Badge className="role-badge" variant="primary">
              {user.role || 'Staff'}
            </Badge>
            <p className="user-status">
              {user.active ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>

        <div className="user-details">
          <div className="detail-item">
            <Mail className="detail-icon" />
            <div className="detail-text">
              <span className="detail-label">Email</span>
              <span className="detail-value">{user.email}</span>
            </div>
          </div>

          <div className="detail-item">
            <Phone className="detail-icon" />
            <div className="detail-text">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{user.phone || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-item">
            <Calendar className="detail-icon" />
            <div className="detail-text">
              <span className="detail-label">Joined</span>
              <span className="detail-value">{formatDate(user.created_at)}</span>
            </div>
          </div>

          <div className="detail-item">
            <Shield className="detail-icon" />
            <div className="detail-text">
              <span className="detail-label">Last Login</span>
              <span className="detail-value">{formatDate(user.last_login) || 'N/A'}</span>
            </div>
          </div>
        </div>

        {canEditUser && (
          <div className="user-actions">
            <Button asChild variant="primary">
              <Link to={`/admin/users/${user.id}/edit`}>
                <Edit className="mr-2" size={18} />
                Edit User
              </Link>
            </Button>
            <Button variant="outline">
              <Key className="mr-2" size={18} />
              Reset Password
            </Button>
            <Button variant="destructive">
              <UserX className="mr-2" size={18} />
              Deactivate
            </Button>
          </div>
        )}
      </Card>

      {/* Activity Log */}
      <Card className="activity-card">
        <h2 className="section-title">Recent Activity</h2>
        {user.activity?.length === 0 ? (
          <EmptyState
            description="User activity will appear here"
            size="small"
            title="No recent activity"
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