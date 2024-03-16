"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RovokeToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }

    // Hide the fields 
    toJSON() {
      return { ...this.get(), id: undefined }
    }
  }
  RovokeToken.init(
    {
      uuid:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      token: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
    
    },
    {
      sequelize,
      modelName: "RevokeToken",
      tableName: "revoke_tokens",
      underscored: true, // createdAt -> created_at
    }
  );
  return RovokeToken;
};
