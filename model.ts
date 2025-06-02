import { DataTypes, Sequelize } from 'sequelize';

export default function initializeModels(sequelize: Sequelize) {
    // Permission Model
    const Permission = sequelize.define('Permission', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.TEXT,
        },
        resource: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        tableName: 'permissions',
        schema: 'public',
        timestamps: true,
        paranoid: true,
    });

    // Role Model
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.TEXT,
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        }
    }, {
        tableName: 'roles',
        schema: 'public',
        timestamps: true,
        paranoid: true,
    });

    // User Model
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [6, 100]
            }
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        lastLogin: {
            type: DataTypes.DATE,
        }
    }, {
        tableName: 'users',
        schema: 'public',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                fields: ['email'],
            },
            {
                fields: ['isActive'],
            }
        ]
    });

    // UserRole (Junction table for User-Role many-to-many relationship)
    const UserRole = sequelize.define('UserRole', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        scope: {
            type: DataTypes.STRING,
            comment: 'Scope of the role (e.g., "global", "team", "project")'
        },
        resourceId: {
            type: DataTypes.INTEGER,
            comment: 'ID of the resource (team/project) if scope is not global'
        }
    }, {
        tableName: 'user_roles',
        schema: 'public',
        timestamps: true,
    });

    // RolePermission (Junction table for Role-Permission many-to-many relationship)
    const RolePermission = sequelize.define('RolePermission', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        conditions: {
            type: DataTypes.JSONB,
            defaultValue: {},
            comment: 'Additional conditions for the permission (e.g., {"own": true} for own resources only)'
        }
    }, {
        tableName: 'role_permissions',
        schema: 'public',
        timestamps: true,
    });

    // Team Model
    const Team = sequelize.define('Team', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.TEXT,
        }
    }, {
        tableName: 'teams',
        schema: 'public',
        timestamps: true,
        paranoid: true,
    });

    // Project Model
    const Project = sequelize.define('Project', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.ENUM('active', 'completed', 'archived'),
            defaultValue: 'active',
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            validate: {
                isAfterStartDate(value) {
                    if (value && value <= this.startDate) {
                        throw new Error('End date must be after start date');
                    }
                }
            }
        }
    }, {
        tableName: 'projects',
        schema: 'public',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                fields: ['status'],
            },
            {
                fields: ['startDate'],
            }
        ]
    });

    // Task Model
    const Task = sequelize.define('Task', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.ENUM('todo', 'in_progress', 'review', 'completed'),
            defaultValue: 'todo',
            allowNull: false
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high'),
            defaultValue: 'medium',
            allowNull: false
        },
        dueDate: {
            type: DataTypes.DATE,
            validate: {
                isAfterCreation(value) {
                    if (value && value <= new Date()) {
                        throw new Error('Due date must be in the future');
                    }
                }
            }
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {}
        }
    }, {
        tableName: 'tasks',
        schema: 'public',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                fields: ['status'],
            },
            {
                fields: ['priority'],
            },
            {
                fields: ['dueDate'],
            }
        ]
    });

    // TimeEntry Model
    const TimeEntry = sequelize.define('TimeEntry', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            validate: {
                isAfterStartTime(value) {
                    if (value && value <= this.startTime) {
                        throw new Error('End time must be after start time');
                    }
                }
            }
        },
        duration: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        description: {
            type: DataTypes.TEXT,
        },
        isManualEntry: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        tableName: 'time_entries',
        schema: 'public',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                fields: ['startTime'],
            },
            {
                fields: ['userId'],
            },
            {
                fields: ['taskId'],
            }
        ]
    });

    // Notification Model
    const Notification = sequelize.define('Notification', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        type: {
            type: DataTypes.ENUM('task', 'project', 'team', 'system'),
            allowNull: false
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        relatedId: {
            type: DataTypes.INTEGER,
        },
        payload: {
            type: DataTypes.JSONB,
            defaultValue: {}
        }
    }, {
        tableName: 'notifications',
        schema: 'public',
        timestamps: true,
        indexes: [
            {
                fields: ['isRead'],
            },
            {
                fields: ['type'],
            },
            {
                fields: ['userId'],
            }
        ]
    });

    // Comment Model
    const Comment = sequelize.define('Comment', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        tableName: 'comments',
        schema: 'public',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                fields: ['taskId'],
            },
            {
                fields: ['userId'],
            }
        ]
    });

    // associations with onDelete and onUpdate constraints
    User.belongsToMany(Team, {
        through: 'UserTeam',
        onDelete: 'CASCADE',
    });
    Team.belongsToMany(User, {
        through: 'UserTeam',
        onDelete: 'CASCADE',
    });

    Team.hasMany(Project, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
    Project.belongsTo(Team);

    Project.hasMany(Task, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
    Task.belongsTo(Project);

    User.hasMany(Task, {
        foreignKey: 'assigneeId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    });
    Task.belongsTo(User, {
        as: 'assignee',
        foreignKey: 'assigneeId',
    });

    User.hasMany(TimeEntry, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
    TimeEntry.belongsTo(User);

    Task.hasMany(TimeEntry, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
    TimeEntry.belongsTo(Task);

    User.hasMany(Notification, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
    Notification.belongsTo(User);

    User.hasMany(Comment, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
    Comment.belongsTo(User);

    Task.hasMany(Comment, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
    Comment.belongsTo(Task);

    // associations for roles and permissions
    Role.belongsToMany(Permission, {
        through: RolePermission,
        onDelete: 'CASCADE',
    });
    Permission.belongsToMany(Role, {
        through: RolePermission,
        onDelete: 'CASCADE',
    });

    User.belongsToMany(Role, {
        through: UserRole,
        onDelete: 'CASCADE',
    });
    Role.belongsToMany(User, {
        through: UserRole,
        onDelete: 'CASCADE',
    });


    Team.hasMany(UserRole, {
        foreignKey: 'resourceId',
        constraints: false,
        scope: {
            scope: 'team'
        }
    });
    UserRole.belongsTo(Team, {
        foreignKey: 'resourceId',
        constraints: false
    });


    Project.hasMany(UserRole, {
        foreignKey: 'resourceId',
        constraints: false,
        scope: {
            scope: 'project'
        }
    });
    UserRole.belongsTo(Project, {
        foreignKey: 'resourceId',
        constraints: false
    });

    return {
        User,
        Team,
        Project,
        Task,
        TimeEntry,
        Notification,
        Comment,
        Role,
        Permission,
        UserRole,
        RolePermission,
    };
}
