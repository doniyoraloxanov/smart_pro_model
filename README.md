=== USER MODEL ===
Purpose: Core user management and authentication

Fields:
- id (PK): Unique identifier
- email: User's email (unique)
- password: Hashed password
- firstName: User's first name
- lastName: User's last name
- isActive: Account status flag
- lastLogin: Last login timestamp

Relationships:
- Can belong to multiple teams (UserTeam junction)
- Can be assigned multiple tasks
- Creates time entries
- Receives notifications
- Makes comments

=== ROLE MODEL ===
Purpose: Defines access levels and permissions hierarchy

Fields:
- id (PK): Unique identifier
- name: Role name (unique)
- description: Role description
- isDefault: Default role flag
- level: Hierarchy level (0-3)

Relationships:
- Links to users through UserRole
- Contains multiple permissions through RolePermission

=== PERMISSION MODEL ===
Purpose: Granular access control definitions

Fields:
- id (PK): Unique identifier
- name: Permission name (unique)
- description: Permission description
- resource: Target resource
- action: Allowed action

Relationships:
- Links to roles through RolePermission

=== TEAM MODEL ===
Purpose: Organizational unit management

Fields:
- id (PK): Unique identifier
- name: Team name
- description: Team description

Relationships:
- Contains multiple users (UserTeam junction)
- Owns multiple projects

=== PROJECT MODEL ===
Purpose: Project management and tracking

Fields:
- id (PK): Unique identifier
- name: Project name
- description: Project description
- status: Project status (active/completed/archived)
- startDate: Project start date
- endDate: Project end date

Relationships:
- Belongs to one team
- Contains multiple tasks

=== TASK MODEL ===
Purpose: Work item management

Fields:
- id (PK): Unique identifier
- title: Task title
- description: Task description
- status: Task status (todo/in_progress/review/completed)
- priority: Task priority (low/medium/high)
- dueDate: Task deadline
- metadata: Additional task data (JSONB)

Relationships:
- Belongs to one project
- Assigned to one user
- Has multiple time entries
- Has multiple comments

=== TIME ENTRY MODEL ===
Purpose: Time tracking and management

Fields:
- id (PK): Unique identifier
- startTime: Work start time
- endTime: Work end time
- duration: Time spent
- description: Work description
- isManualEntry: Manual/automatic entry flag

Relationships:
- Belongs to one user
- Belongs to one task

=== NOTIFICATION MODEL ===
Purpose: System notifications

Fields:
- id (PK): Unique identifier
- title: Notification title
- message: Notification content
- type: Notification type (task/project/team/system)
- isRead: Read status
- relatedId: Related entity ID
- payload: Additional data (JSONB)

Relationships:
- Belongs to one user

=== COMMENT MODEL ===
Purpose: Task discussion management

Fields:
- id (PK): Unique identifier
- content: Comment text

Relationships:
- Belongs to one task
- Created by one user

=== JUNCTION TABLES ===

UserRole
Purpose: User-Role assignment management

Fields:
- id (PK): Unique identifier
- scope: Role scope (global/team/project)
- resourceId: Scoped resource ID

Relationships:
- Links users to roles
- Supports scoped permissions

RolePermission
Purpose: Role-Permission assignment

Fields:
- id (PK): Unique identifier
- conditions: Permission conditions (JSONB)

Relationships:
- Links roles to permissions
- Supports conditional permissions
