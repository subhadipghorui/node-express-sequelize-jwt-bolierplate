'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      // define association here
      // UserId -> by default FK
      this.belongsTo(User, { foreignKey: 'user_id', as: 'user' })
    }
    toJSON() {
      return { ...this.get(), id: undefined, user_id: undefined }
    }
  }
  Post.init( {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'posts',
    modelName: 'Post',
    underscored: true, // createdAt -> created_at
  });
  return Post;
};