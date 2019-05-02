import usersDb from '../db/users.json';
import { getDate } from '../utils/helperUtils';

class UserModel {
  static find(email) {
    const exists = usersDb.find(user => user.email === email);
    return exists;
  }

  static findPhone(phone) {
    const exists = usersDb.find(user => user.phone === phone);
    return !!exists;
  }

  static create(params) {
    const {
      firstName, lastName, email, password, phone, status, isAdmin,
    } = params;
    const date = getDate();
    const newUser = {
      id: usersDb.length + 1,
      firstName,
      lastName,
      email,
      password,
      phone,
      status,
      isAdmin,
      registered: date,
    };
    usersDb.push(newUser);
    return usersDb[usersDb.length - 1];
  }

  static verify(email) {
    const index = usersDb.findIndex(user => user.email === email);
    usersDb[index].status = 'verified';
    return usersDb[index];
  }

  static changePassword(email, password) {
    const index = usersDb.findIndex(user => user.email === email);
    usersDb[index].password = password;
    return usersDb[index];
  }
}

export default UserModel;
