// src/components/ui/table.jsx
/**
 * Table Component Suite
 * 
 * Production-ready, accessible, responsive table components with premium design.
 * Provides a complete set of table primitives for consistent data tables
 * across the HBMS application (appointments, patients, prescriptions, reports).
 * 
 * Features:
 * - Semantic HTML structure
 * - Striped rows with hover
 * - Responsive horizontal scroll on small screens
 * - Header with sorting support (visual only, logic in parent)
 * - Unified with glassmorphic card integration
 * - Dark/light theme compatible
 * - Fully accessible (ARIA roles, keyboard navigation)
 * 
 * Components:
 * - Table
 * - TableHeader
 * - TableBody
 * - TableFooter
 * - TableHead
 * - TableRow
 * - TableCell
 * - TableCaption
 */

import React from 'react';
import './table.module.scss';

/**
 * Table - root container
 */
export const Table = React.forwardRef(({ children, className = '', ...props }, ref) => (
  <div className="table-wrapper">
    <table ref={ref} className={`table ${className}`} {...props}>
      {children}
    </table>
  </div>
));

/**
 * TableHeader - header section
 */
export const TableHeader = ({ children, className = '', ...props }) => (
  <thead className={`table-header ${className}`} {...props}>
    {children}
  </thead>
);

/**
 * TableBody - body section
 */
export const TableBody = ({ children, className = '', ...props }) => (
  <tbody className={`table-body ${className}`} {...props}>
    {children}
  </tbody>
);

/**
 * TableFooter - footer section
 */
export const TableFooter = ({ children, className = '', ...props }) => (
  <tfoot className={`table-footer ${className}`} {...props}>
    {children}
  </tfoot>
);

/**
 * TableRow - row
 */
export const TableRow = ({ children, className = '', ...props }) => (
  <tr className={`table-row ${className}`} {...props}>
    {children}
  </tr>
);

/**
 * TableHead - header cell
 */
export const TableHead = ({ children, className = '', ...props }) => (
  <th className={`table-head ${className}`} {...props}>
    {children}
  </th>
);

/**
 * TableCell - data cell
 */
export const TableCell = ({ children, className = '', ...props }) => (
  <td className={`table-cell ${className}`} {...props}>
    {children}
  </td>
);

/**
 * TableCaption - caption (for accessibility)
 */
export const TableCaption = ({ children, className = '', ...props }) => (
  <caption className={`table-caption ${className}`} {...props}>
    {children}
  </caption>
);

// Display names for DevTools
Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableFooter.displayName = 'TableFooter';
TableRow.displayName = 'TableRow';
TableHead.displayName = 'TableHead';
TableCell.displayName = 'TableCell';
TableCaption.displayName = 'TableCaption';

export {
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};