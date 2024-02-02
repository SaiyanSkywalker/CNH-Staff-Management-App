import { DataTypes, Sequelize } from "sequelize";

const UnitAndShiftCapacity = (sequelize: Sequelize) => {
    let Role = sequelize.define(
      "Role",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        modelName: "Role",
        tableName: "Role",
      }
    );

    let ShiftCapacity = sequelize.define(
        "ShiftCapacity",
        {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          shift: DataTypes.DATE,
          capacity: DataTypes.INTEGER
        },
        {
          modelName: "ShiftCapacity",
          tableName: "ShiftCapacity",
        }
      );

    let Unit =  sequelize.define(
        "Unit",
        {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        laborLevelEntryId: {
          type: DataTypes.INTEGER,
        }, 
        name: DataTypes.STRING,
        description: DataTypes.STRING
        },
        {
            modelName: "Unit",
            tableName: "Unit",
        },
    );

    let UserInformation = sequelize.define(
      "UserInformation",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        password: DataTypes.STRING
      },
      {
        modelName: "UserInformation",
        tableName: "UserInformation",
      }
    );

    //one to one. ShiftCapacity has exactly one Unit associated with it and Unit has exactly one ShiftCapacity.

    ShiftCapacity.belongsTo(Unit, {
        targetKey: 'id', // referenced from ShiftCapacity
        foreignKey:  //creates foreign key in Unit
        {
            name: 'unitId',        
            allowNull: false    
        },
        onDelete: 'RESTRICT',  //restrict from deleting shift capacity since a unit requires it
        onUpdate: 'CASCADE'    //if shift capacity changes, then so should unit
    });

    UserInformation.belongsTo(Role, {
      targetKey: 'id',
      foreignKey: {
        name: 'roleId',
        allowNull: false //what happens if a role is deleted? should we delete user?
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE' //if role changes then the user's information should be updated.
    });

    UserInformation.belongsTo(Unit, {
      targetKey: 'id',
      foreignKey: {
        name: 'unitId',
        allowNull: false //what happens if a role is deleted? should we delete user?
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE' //if role changes then the user's information should be updated.
    })

    return { ShiftCapacity, Unit, Role }
};

export default UnitAndShiftCapacity;


//foreign key reference of exactly one shift capacity to a unit. A unit should have EXACTLY ONE 
//capacityId. A capacityID can belong to zero or more units.


/*
Concerns:

  // What to do if a shift capacity record gets deleted that messes up the Unit? Restrict makes sense.

  // What happens if a role is deleted? should we delete user information or set to null, or restrict it?

*/
