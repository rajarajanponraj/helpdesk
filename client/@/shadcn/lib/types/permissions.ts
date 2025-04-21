export type IssuePermission =
  | "issue::create"
  | "issue::read"
  | "issue::write"
  | "issue::update"
  | "issue::delete"
  | "issue::assign"
  | "issue::transfer"
  | "issue::comment";

export type UserPermission =
  | "user::create"
  | "user::read"
  | "user::update"
  | "user::delete"
  | "user::manage";

export type RolePermission =
  | "role::create"
  | "role::read"
  | "role::update"
  | "role::delete"
  | "role::manage";

export type TeamPermission =
  | "team::create"
  | "team::read"
  | "team::update"
  | "team::delete"
  | "team::manage";

export type ClientPermission =
  | "client::create"
  | "client::read"
  | "client::update"
  | "client::delete"
  | "client::manage";

export type KnowledgeBasePermission =
  | "kb::create"
  | "kb::read"
  | "kb::update"
  | "kb::delete"
  | "kb::manage";

export type SystemPermission =
  | "settings::view"
  | "settings::manage"
  | "webhook::manage"
  | "integration::manage"
  | "email_template::manage";

export type TimeTrackingPermission =
  | "time_entry::create"
  | "time_entry::read"
  | "time_entry::update"
  | "time_entry::delete";

export type DocumentPermission =
  | "document::create"
  | "document::read"
  | "document::update"
  | "document::delete"
  | "document::manage";

export type WebhookPermission =
  | "webhook::create"
  | "webhook::read"
  | "webhook::update"
  | "webhook::delete";

  export type SellerPermission =
  | "seller::create"
  | "seller::read"
  | "seller::update"
  | "seller::delete"
  | "seller::manage";

export type StockPermission =
  | "stock::create"
  | "stock::read"
  | "stock::update"
  | "stock::delete"
  | "stock::manage";

export type PurchasePermission =
  | "purchase::create"
  | "purchase::read"
  | "purchase::update"
  | "purchase::delete"
  | "purchase::manage";

  export type MovementPermission =
  | "movement::create"
  | "movement::read"
  | "movement::update"
  | "movement::delete"
  | "movement::manage";

export type VendorPermission =
  | "vendor::create"
  | "vendor::read"
  | "vendor::update"
  | "vendor::delete"
  | "vendor::manage";

export type LabstockPermission =
  | "labstock::create"
  | "labstock::read"
  | "labstock::update"
  | "labstock::delete"
  | "labstock::manage";

  export type ServiceRecordPermission =
  | "service_record::create"
  | "service_record::read"
  | "service_record::update"
  | "service_record::delete"
  | "service_record::manage";

export type ServiceRegisterPermission =
  | "service_register::create"
  | "service_register::read"
  | "service_register::update"
  | "service_register::delete"
  | "service_register::manage";

export type ScrapRecordPermission =
  | "scrap_record::create"
  | "scrap_record::read"
  | "scrap_record::update"
  | "scrap_record::delete"
  | "scrap_record::manage";

  export type Permission =
  | IssuePermission
  | UserPermission
  | RolePermission
  | TeamPermission
  | ClientPermission
  | KnowledgeBasePermission
  | SystemPermission
  | TimeTrackingPermission
  | DocumentPermission
  | WebhookPermission
  | SellerPermission
  | StockPermission
  | PurchasePermission
  | MovementPermission
  | VendorPermission
  | LabstockPermission
  | ServiceRecordPermission
  | ServiceRegisterPermission
  | ScrapRecordPermission;

// Useful type for grouping permissions by category
export const PermissionCategories = {
  ISSUE: "Issue Management",
  USER: "User Management",
  ROLE: "Role Management",
  TEAM: "Team Management",
  CLIENT: "Client Management",
  KNOWLEDGE_BASE: "Knowledge Base",
  SYSTEM: "System Settings",
  TIME_TRACKING: "Time Tracking",
  VIEW: "Views",
  WEBHOOK: "Webhook Management",
  DOCUMENT: "Document Management",
  SELLER: "Seller Management",
  STOCK: "Stock Management",
  PURCHASE: "Purchase Management",
  MOVEMENT: "Movement Management",
  VENDOR: "Vendor Management",
  LABSTOCK: "Labstock Management",
  SERVICE_RECORD: "Service Record Management",
  SERVICE_REGISTER: "Service Register Management",
  SCRAP_RECORD: "Scrap Record Management",
} as const;

export type PermissionCategory =
  (typeof PermissionCategories)[keyof typeof PermissionCategories];

// Helper type for permission groups
export interface PermissionGroup {
  category: PermissionCategory;
  permissions: Permission[];
}

export const PERMISSIONS_CONFIG = [
  {
    category: "Issue Management",
    permissions: [
      "issue::create",
      "issue::read",
      "issue::write",
      "issue::update",
      "issue::delete",
      "issue::assign",
      "issue::transfer",
      "issue::comment",
    ],
  },
  // {
  //   category: "User Management",
  //   permissions: [
  //     "user::create",
  //     "user::read",
  //     "user::update",
  //     "user::delete",
  //     "user::manage",
  //   ],
  // },
  {
    category: "Role Management",
    permissions: [
      "role::create",
      "role::read",
      "role::update",
      "role::delete",
      "role::manage",
    ],
  },
  // {
  //   category: "Team Management",
  //   permissions: [
  //     "team::create",
  //     "team::read",
  //     "team::update",
  //     "team::delete",
  //     "team::manage"
  //   ]
  // },
  // {
  //   category: "Client Management",
  //   permissions: [
  //     "client::create",
  //     "client::read",
  //     "client::update",
  //     "client::delete",
  //     "client::manage",
  //   ],
  // },
  {
    category: "Knowledge Base",
    permissions: [
      "kb::create",
      "kb::read",
      "kb::update",
      "kb::delete",
      "kb::manage"
    ]
  },
  {
    category: "System Settings",
    permissions: [
      "settings::view",
      "settings::manage",
      "webhook::manage",
      "integration::manage",
      "email_template::manage",
    ],
  },
  // {
  //   category: "Time Tracking",
  //   permissions: [
  //     "time_entry::create",
  //     "time_entry::read",
  //     "time_entry::update",
  //     "time_entry::delete"
  //   ]
  // },
  {
    category: "Document Management",
    permissions: [
      "document::create",
      "document::read",
      "document::update",
      "document::delete",
      "document::manage",
    ],
  },
  {
    category: "Webhook Management",
    permissions: [
      "webhook::create",
      "webhook::read",
      "webhook::update",
      "webhook::delete",
    ],
  },
  {
    category: PermissionCategories.SERVICE_REGISTER,
    permissions: [
      "service_register::create",
      "service_register::read",
      "service_register::update",
      "service_register::delete",
      "service_register::manage",
    ],
  },
  {
    category: PermissionCategories.SCRAP_RECORD,
    permissions: [
      "scrap_record::create",
      "scrap_record::read",
      "scrap_record::update",
      "scrap_record::delete",
      "scrap_record::manage",
    ],
  },
  {
    category: PermissionCategories.LABSTOCK,
    permissions: [
      "labstock::create",
      "labstock::read",
      "labstock::update",
      "labstock::delete",
      "labstock::manage",
    ],
  },
  {
    category: PermissionCategories.SERVICE_RECORD,
    permissions: [
      "service_record::create",
      "service_record::read",
      "service_record::update",
      "service_record::delete",
      "service_record::manage",
    ],
  },
  {
    category: PermissionCategories.MOVEMENT,
    permissions: [
      "movement::create",
      "movement::read",
      "movement::update",
      "movement::delete",
      "movement::manage",
    ],
  },
  {
    category: PermissionCategories.VENDOR,
    permissions: [
      "vendor::create",
      "vendor::read",
      "vendor::update",
      "vendor::delete",
      "vendor::manage",
    ],
  },
  {
    category: PermissionCategories.SELLER,
    permissions: [
      "seller::create",
      "seller::read",
      "seller::update",
      "seller::delete",
      "seller::manage",
    ],
  },
  {
    category: PermissionCategories.STOCK,
    permissions: [
      "stock::create",
      "stock::read",
      "stock::update",
      "stock::delete",
      "stock::manage",
    ],
  },
  {
    category: PermissionCategories.PURCHASE,
    permissions: [
      "purchase::create",
      "purchase::read",
      "purchase::update",
      "purchase::delete",
      "purchase::manage",
    ],
  },
] as const;
