const db = require('../../config/db');

class UserModel {
  async findById(id) {
    return db('users')
      .select('id', 'email', 'name', 'created_at', 'updated_at')
      .where('id', id)
      .first();
  }

  async findByEmail(email) {
    return db('users')
      .where('email', email)
      .first();
  }

  async create(userData) {
    const [id] = await db('users').insert(userData);
    return this.findById(id);
  }

  async update(id, userData) {
    await db('users')
      .where('id', id)
      .update({
        ...userData,
        updated_at: new Date()
      });
    return this.findById(id);
  }
}

module.exports = new UserModel();
