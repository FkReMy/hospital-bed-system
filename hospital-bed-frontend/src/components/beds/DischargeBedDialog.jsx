// src/components/beds/DischargeBedDialog.jsx
/**
 * DischargeBedDialog Component
 * 
 * Production-ready dialog for discharging a patient from an occupied bed.
 * Used in BedManagementPage, BedCard, and dashboard actions.
 * 
 * Features:
 * - Bed and patient information display
 * - Optional discharge notes field
 * - Validation and submission states
 * - Accessible form with clear feedback
 * - Confirmation before discharge
 * - Unified with global components (Dialog, Textarea, Button, Badge)
 * 
 * Integrates with TanStack Query mutation for bed discharge API call
 */

import React from 'react';
import { format } from 'date-fns';
import { BedDouble, UserX, NotepadText, AlertCircle } from 'lucide-react';
import Dialog from '@components/ui/dialog.jsx';
import DialogContent from '@components/ui/dialog-content.jsx';
import DialogHeader from '@components/ui/dialog-header.jsx';
import DialogTitle from '@components/ui/dialog-title.jsx';
import DialogDescription from '@components/ui/dialog-description.jsx';
import DialogFooter from '@components/ui/dialog-footer.jsx';
import Label from '@components/ui/label.jsx';
import Textarea from '@components/ui/textarea.jsx';
import Button from '@components/ui/button.jsx';
import Badge from '@components/ui/badge.jsx';
import BedStatusBadge from '@components/beds/BedStatusBadge.jsx';
import './DischargeBedDialog.scss';

/**
 * Props:
 * - bed: The occupied bed object (must include id, bed_number, room_number, status, department, current_patient)
 * - open: boolean - controls dialog visibility
 * - onOpenChange: (open: boolean) => void
 * - onSuccess: (dischargeData) => void - called after successful discharge
 * - isSubmitting: boolean
 */
const DischargeBedDialog = ({
  bed,
  open = false,
  onOpenChange,
  onSuccess,
  isSubmitting = false,
}) => {
  const [dischargeNotes, setDischargeNotes] = React.useState('');

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setDischargeNotes('');
    }
  }, [open]);

  const handleDischarge = (e) => {
    e.preventDefault();
    
    const dischargePayload = {
      bed_id: bed.id,
      discharged_at: new Date().toISOString(),
      notes: dischargeNotes?.trim() || null,
    };

    onSuccess?.(dischargePayload);
  };

  if (!bed) return null;

  const patient = bed.current_patient || bed.patient;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="discharge-bed-dialog max-w-lg">
        <DialogHeader>
          <DialogTitle>Discharge Patient from Bed</DialogTitle>
          <DialogDescription>
            Confirm discharge and add optional notes. The bed will be marked as available.
          </DialogDescription>
        </DialogHeader>

        {/* Bed and Patient Information Summary */}
        <div className="bed-patient-summary space-y-4 p-4 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BedDouble className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold text-lg">{bed.bed_number}</p>
                <p className="text-sm text-muted-foreground">
                  Room {bed.room_number} • {bed.department?.name || 'Unknown Department'}
                </p>
              </div>
            </div>
            <BedStatusBadge status={bed.status} />
          </div>

          {patient && (
            <div className="pt-3 border-t border-border">
              <p className="text-sm font-medium text-foreground">Current Patient:</p>
              <p className="text-base font-semibold">{patient.full_name}</p>
              <p className="text-sm text-muted-foreground">
                ID: {patient.id} • DOB: {format(new Date(patient.date_of_birth), 'MMM dd, yyyy')}
              </p>
            </div>
          )}

          {bed.status !== 'occupied' && (
            <div className="flex items-center gap-2 text-warning text-sm">
              <AlertCircle className="w-4 h-4" />
              This bed is not currently occupied.
            </div>
          )}
        </div>

        <form onSubmit={handleDischarge} className="spaceY6">
          {/* Discharge Notes */}
          <div className="spaceY2">
            <Label htmlFor="dischargeNotes">
              <NotepadText className="inline w-4 h-4 mr-2" />
              Discharge Notes (Optional)
            </Label>
            <Textarea
              id="dischargeNotes"
              value={dischargeNotes}
              onChange={(e) => setDischargeNotes(e.target.value)}
              placeholder="Add any relevant notes about the discharge..."
              rows={4}
              disabled={isSubmitting}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {dischargeNotes.length}/500 characters
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting || bed.status !== 'occupied'}
            >
              <UserX className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Discharging...' : 'Discharge Patient'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DischargeBedDialog;
