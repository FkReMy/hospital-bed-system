// src/components/patients/PatientCard.jsx
/**
 * PatientCard Component
 * 
 * Clean and spacious card following the new Hospital Palette design.
 * Use this pattern for Patient Summaries, Bed Cards, and Reports.
 * 
 * Features:
 * - Clean, Calm, and Trustworthy aesthetic
 * - Primary text for headers
 * - Secondary text for body content
 * - Status badges with semantic colors
 * - Primary and Secondary button patterns
 * - Generous padding for cleanliness
 * - Subtle shadows
 */

import Badge from '@components/ui/badge.jsx';
import styles from './PatientCard.module.scss';

/**
 * Props:
 * - patient: Full patient object with id, name, condition, blood_group, gender
 */
const PatientCard = ({ patient }) => {
  if (!patient) return null;

  return (
    <div className={styles.card}>
      {/* Header with Primary Text */}
      <div className={styles.header}>
        <h3 className={styles.name}>{patient.full_name || patient.name}</h3>
        <Badge className={styles.statusBadge} size="sm" variant="success">
          Admitted
        </Badge>
      </div>
      
      {/* Body with Secondary Text for readability */}
      <div className={styles.content}>
        <p className={styles.infoRow}>
          <span className={styles.label}>ID:</span> 
          <span className={styles.value}>
            {patient.id ? patient.id.slice(0, 8) : 'N/A'}
          </span>
        </p>
        <p className={styles.infoRow}>
          <span className={styles.label}>Blood Group:</span> 
          <span className={styles.value}>
            {patient.blood_group || 'N/A'}
          </span>
        </p>
        <p className={styles.infoRow}>
          <span className={styles.label}>Gender:</span> 
          <span className={styles.value}>
            {patient.gender || 'N/A'}
          </span>
        </p>
        {patient.condition && (
          <p className={styles.infoRow}>
            <span className={styles.label}>Condition:</span> 
            <span className={styles.value}>{patient.condition}</span>
          </p>
        )}
      </div>

      {/* Actions: Primary for main task, Secondary for info */}
      <div className={styles.actions}>
        <button className={styles.btnSecondary}>View History</button>
        <button className={styles.btnPrimary}>Update Vitals</button>
      </div>
    </div>
  );
};

export default PatientCard;
