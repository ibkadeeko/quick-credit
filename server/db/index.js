import { Pool, types } from 'pg';

const connectionString = process.env.NODE_ENV === 'test' ? process.env.TESTDB : process.env.DATABASE_URL;

types.setTypeParser(1700, val => parseFloat(val));

const pool = new Pool({ connectionString });

export default {
  /**
   * Query Database
   * @param {string} text - Query Text
   * @param {array} params - Query Values
   */
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
