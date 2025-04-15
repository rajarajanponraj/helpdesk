export type IssuePermission =
  | 'issue::create'
  | 'issue::read'
  | 'issue::write'
  | 'issue::update'
  | 'issue::delete'
  | 'issue::assign'
  | 'issue::transfer'
  | 'issue::comment';

export type UserPermission =
  | 'user::create'
  | 'user::read'
  | 'user::update'
  | 'user::delete'
  | 'user::manage';

export type RolePermission =
  | 'role::create'
  | 'role::read'
  | 'role::update'
  | 'role::delete'
  | 'role::manage';

export type TeamPermission =
  | 'team::create'
  | 'team::read'
  | 'team::update'
  | 'team::delete'
  | 'team::manage';

export type ClientPermission =
  | 'client::create'
  | 'client::read'
  | 'client::update'
  | 'client::delete'
  | 'client::manage';

export type KnowledgeBasePermission =
  | 'kb::create'
  | 'kb::read'
  | 'kb::update'
  | 'kb::delete'
  | 'kb::manage';

export type SystemPermission =
  | 'settings::view'
  | 'settings::manage'
  | 'webhook::manage'
  | 'integration::manage'
  | 'email_template::manage';

export type TimeTrackingPermission =
  | 'time_entry::create'
  | 'time_entry::read'
  | 'time_entry::update'
  | 'time_entry::delete';

export type ViewPermission =
  | 'docs::manage'
  | 'admin::panel';

export type WebhookPermission =
  | 'webhook::create'
  | 'webhook::read'
  | 'webhook::update'
  | 'webhook::delete';

export type DocumentPermission =
  | 'document::create'
  | 'document::read'
  | 'document::update'
  | 'document::delete'
  | 'document::manage';


export type SellerPermission =
  | 'sellers::create'
  | 'sellers::read'
  | 'sellers::update'
  | 'sellers::delete';

export type StockPermission =
  | 'stocks::create'
  | 'stocks::read'
  | 'stocks::update'
  | 'stocks::delete';

export type PurchasePermission=
  | 'purchases::create'
  | 'purchases::read'
  | 'purchases::update'
  | 'purchases::delete';

export type MovementsPermission=
  | 'movements::create'
  | 'movements::read'
  | 'movements::update'
  | 'movements::delete';

export type VendorPermission =
  | 'vendors::create'
  | 'vendors::read'
  | 'vendors::update'
  | 'vendors::delete';

export type LabStockPermission=
  | 'lab-stocks::read'
  | 'lab-stocks::create'
  | 'lab-stocks::update'
  | 'lab-stocks::delete'
  
  | 'lab-stocks::allocate';

export type ServiceRecordsPermission =
  | 'service-records::create'
  | 'service-records::read'
  | 'service-records::update'
  | 'service-records::delete';

export type ServiceRegisterPermission =
  | 'service-registers::register'
  | 'service-registers::read';

export type ScrapRecordPermission =
  | 'stock-scraps::scrap'
  | 'stock-scraps::read'


export type Permission =
  | IssuePermission
  | UserPermission
  | RolePermission
  | TeamPermission
  | ClientPermission
  | KnowledgeBasePermission
  | SystemPermission
  | TimeTrackingPermission
  | ViewPermission
  | WebhookPermission
  | DocumentPermission
  | SellerPermission
  | StockPermission
  | PurchasePermission
  | MovementsPermission
  | VendorPermission
  | LabStockPermission
  | ServiceRecordsPermission
  | ServiceRegisterPermission
  | ScrapRecordPermission;

// Useful type for grouping permissions by category
export const PermissionCategories = {
  ISSUE: 'Issue Management',
  USER: 'User Management',
  ROLE: 'Role Management',
  TEAM: 'Team Management',
  CLIENT: 'Client Management',
  KNOWLEDGE_BASE: 'Knowledge Base',
  SYSTEM: 'System Settings',
  TIME_TRACKING: 'Time Tracking',
  VIEW: 'Views',
  WEBHOOK: 'Webhook Management',
  DOCUMENT: 'Document Management',
  SELLER: 'Seller Management',
  STOCK : 'Stock Managemement',
  PURCHASE : 'Purchase Management',
  MOVEMENT : 'Movement Management',
  VENDOR : 'Vendor Management',
  LABSTOCK : 'Labstock Management',
  SERVICE_RECORD :'Service Record Management',
  SERVICE_REGISTER : 'Service Register Management',
  SCRAP_RECORD : 'Scrap Record Management'

} as const;

export type PermissionCategory = typeof PermissionCategories[keyof typeof PermissionCategories];

// Helper type for permission groups
export interface PermissionGroup {
  category: PermissionCategory;
  permissions: Permission[];
}
