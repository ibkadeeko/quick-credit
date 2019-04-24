import usersDb from '../db/users.json';

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
    const newUser = {
      id: usersDb.length + 1,
      firstName,
      lastName,
      email,
      password,
      phone,
      status,
      isAdmin,
      registered: new Date(),
    };
    usersDb.push(newUser);
    return usersDb[usersDb.length - 1];
  }
}

export default UserModel;
