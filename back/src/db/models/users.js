class UsersModel {
  constructor(knex) {
    this.knex = knex;
  }

  setTrx(trx) {
    this.trx = trx;
  }

  async create(user) {
    try {
      return this.knex("users").transacting(this.trx).insert(user);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findByCursor(user_id, limit) {
    try {
      // 커서 속성을 미리 만들어둬야 할까요?
      const minIdPacket = await this.knex.raw(
        "SELECT MIN(user_id)as minId FROM users;"
      );
      user_id = user_id ? user_id : minIdPacket[0][0].minId; // Replace this with your actual user_id value
      limit = limit ? limit : "10";
      console.log("user_id and limit", user_id, limit);
      return this.knex("users")
        .transacting(this.trx)
        .select("username", "email", "level")
        .where("user_id", ">=", user_id)
        .limit(limit);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findById(user_id) {
    try {
      if (!user_id) {
        return this.knex("users").transacting(this.trx).select("*");
      }
      return this.knex("users")
        .transacting(this.trx)
        .select("*")
        .where("user_id", user_id);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findByEmail(email) {
    try {
      return this.knex("users")
        .transacting(this.trx)
        .select("*")
        .where("email", email);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findByUsername(username) {
    try {
      return this.knex("users")
        .transacting(this.trx)
        .select("*")
        .where("username", username);
    } catch (err) {
      throw new Error(err);
    }
  }

  async update(user_id, toUpdate) {
    try {
      return this.knex("users")
        .transacting(this.trx)
        .where("user_id", user_id)
        .update(toUpdate);
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteById(user_id) {
    try {
      return this.knex("users")
        .transacting(this.trx)
        .where("user_id", user_id)
        .delete();
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = UsersModel;
