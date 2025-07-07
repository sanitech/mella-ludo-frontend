import React, { useState, useEffect } from "react";
import {
  BAN_TYPES,
  BAN_TYPE_LABELS,
  BAN_TYPE_DESCRIPTIONS,
  DURATION_OPTIONS,
  BanType,
} from "../../constants/banTypes";

interface BanFormProps {
  onSubmit: (banData: {
    banType: BanType;
    duration: number;
    reason: string;
    evidence: string;
    notes: string;
  }) => void;
  onCancel: () => void;
  loading?: boolean;
  initialData?: {
    banType?: BanType;
    duration?: number;
    reason?: string;
    evidence?: string;
    notes?: string;
  };
}

const BanForm: React.FC<BanFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  initialData = {},
}) => {
  const [banType, setBanType] = useState<BanType>(
    initialData.banType || BAN_TYPES.PERMANENT
  );
  const [banDuration, setBanDuration] = useState(initialData.duration || 0);
  const [banReason, setBanReason] = useState(initialData.reason || "");
  const [banEvidence, setBanEvidence] = useState(initialData.evidence || "");
  const [banNotes, setBanNotes] = useState(initialData.notes || "");

  // Update duration when ban type changes
  useEffect(() => {
    if (banType === BAN_TYPES.PERMANENT || banType === BAN_TYPES.WARNING) {
      setBanDuration(0);
    } else if (banDuration === 0) {
      // Set default duration for temporary ban types
      setBanDuration(24); // 1 day default
    }
  }, [banType]);

  const formatDuration = (duration: number) => {
    if (duration === 0) return "Permanent";
    if (duration < 24) return `${duration} hour(s)`;
    if (duration < 168) return `${Math.floor(duration / 24)} day(s)`;
    return `${Math.floor(duration / 168)} week(s)`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      banType,
      duration: banDuration,
      reason: banReason,
      evidence: banEvidence,
      notes: banNotes,
    });
  };

  const isFormValid = () => {
    const hasReason = banReason.trim().length > 0;
    const hasValidDuration =
      banType === BAN_TYPES.PERMANENT ||
      banType === BAN_TYPES.WARNING ||
      banDuration > 0;
    return hasReason && hasValidDuration;
  };

  const requiresDuration = banType === BAN_TYPES.TEMPORARY;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Ban Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ban Type *
        </label>
        <select
          className="input-field w-full"
          value={banType}
          onChange={(e) => setBanType(e.target.value as BanType)}
          disabled={loading}
        >
          {Object.entries(BAN_TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {BAN_TYPE_DESCRIPTIONS[banType]}
        </p>
      </div>

      {/* Duration (for temporary bans) */}
      {requiresDuration && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Quick Preset
              </label>
              <select
                className="input-field w-full"
                value={banDuration}
                onChange={(e) => setBanDuration(parseInt(e.target.value) || 0)}
                disabled={loading}
              >
                {DURATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Custom Hours
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                placeholder="Enter custom duration in hours"
                value={banDuration}
                onChange={(e) => setBanDuration(parseInt(e.target.value) || 0)}
                disabled={loading}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Duration: {formatDuration(banDuration)}
          </p>
        </div>
      )}

      {/* Reason */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reason for Ban *
        </label>
        <textarea
          className="input-field w-full"
          rows={3}
          placeholder="Enter reason for banning this user..."
          value={banReason}
          onChange={(e) => setBanReason(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      {/* Evidence */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Evidence (Optional)
        </label>
        <textarea
          className="input-field w-full"
          rows={2}
          placeholder="Enter evidence or proof of violation..."
          value={banEvidence}
          onChange={(e) => setBanEvidence(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          className="input-field w-full"
          rows={2}
          placeholder="Enter any additional notes or comments..."
          value={banNotes}
          onChange={(e) => setBanNotes(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Form Actions */}
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={!isFormValid() || loading}
          className="btn-danger flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Ban User"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex-1"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BanForm;
