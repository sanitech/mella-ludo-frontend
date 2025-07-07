// Ban types that match the backend Ban model enum
export const BAN_TYPES = {
  TEMPORARY: "TEMPORARY",
  PERMANENT: "PERMANENT",
  WARNING: "WARNING",
} as const;

export type BanType = (typeof BAN_TYPES)[keyof typeof BAN_TYPES];

// Ban status types that match the backend Ban model enum
export const BAN_STATUS = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  MANUALLY_REMOVED: "MANUALLY_REMOVED",
  PENDING: "PENDING",
  APPEALED: "APPEALED",
} as const;

export type BanStatus = (typeof BAN_STATUS)[keyof typeof BAN_STATUS];

// Ban severity levels
export const BAN_SEVERITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;

export type BanSeverity = (typeof BAN_SEVERITY)[keyof typeof BAN_SEVERITY];

// Ban type display labels
export const BAN_TYPE_LABELS = {
  [BAN_TYPES.TEMPORARY]: "Temporary Ban",
  [BAN_TYPES.PERMANENT]: "Permanent Ban",
  [BAN_TYPES.WARNING]: "Warning",
} as const;

// Ban status display labels
export const BAN_STATUS_LABELS = {
  [BAN_STATUS.ACTIVE]: "Active",
  [BAN_STATUS.EXPIRED]: "Expired",
  [BAN_STATUS.MANUALLY_REMOVED]: "Manually Removed",
  [BAN_STATUS.PENDING]: "Pending",
  [BAN_STATUS.APPEALED]: "Appealed",
} as const;

// Ban severity display labels
export const BAN_SEVERITY_LABELS = {
  [BAN_SEVERITY.LOW]: "Low",
  [BAN_SEVERITY.MEDIUM]: "Medium",
  [BAN_SEVERITY.HIGH]: "High",
  [BAN_SEVERITY.CRITICAL]: "Critical",
} as const;

// Ban type descriptions
export const BAN_TYPE_DESCRIPTIONS = {
  [BAN_TYPES.TEMPORARY]: "Temporary restriction with automatic expiration",
  [BAN_TYPES.PERMANENT]: "Permanent restriction with no expiration",
  [BAN_TYPES.WARNING]: "Warning notice without restriction",
} as const;

// Ban type colors for UI
export const BAN_TYPE_COLORS = {
  [BAN_TYPES.TEMPORARY]: "bg-yellow-100 text-yellow-800",
  [BAN_TYPES.PERMANENT]: "bg-red-100 text-red-800",
  [BAN_TYPES.WARNING]: "bg-orange-100 text-orange-800",
} as const;

// Ban status colors for UI
export const BAN_STATUS_COLORS = {
  [BAN_STATUS.ACTIVE]: "bg-red-100 text-red-800",
  [BAN_STATUS.EXPIRED]: "bg-gray-100 text-gray-800",
  [BAN_STATUS.MANUALLY_REMOVED]: "bg-green-100 text-green-800",
  [BAN_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [BAN_STATUS.APPEALED]: "bg-blue-100 text-blue-800",
} as const;

// Default duration presets (in hours)
export const BAN_DURATION_PRESETS = {
  [BAN_TYPES.WARNING]: 0,
  [BAN_TYPES.TEMPORARY]: 24,
  [BAN_TYPES.PERMANENT]: 0,
} as const;

// Duration options for temporary bans
export const DURATION_OPTIONS = [
  { value: 1, label: "1 Hour" },
  { value: 6, label: "6 Hours" },
  { value: 12, label: "12 Hours" },
  { value: 24, label: "1 Day" },
  { value: 72, label: "3 Days" },
  { value: 168, label: "1 Week" },
  { value: 336, label: "2 Weeks" },
  { value: 720, label: "1 Month" },
  { value: 2160, label: "3 Months" },
  { value: 4320, label: "6 Months" },
  { value: 8760, label: "1 Year" },
] as const;
