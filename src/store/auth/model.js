/**
 * 用户对象
 * @export
 * @class User
 */
export default class User {
  // eslint-disable-next-line space-before-function-paren
  constructor({
    userId = 0,
    userName,
    password,
    email,
    tel,
    activated
  } = {}) {
    Object.assign(this, {
      userId,
      userName,
      password,
      email,
      tel,
      activated
    })
  }
  from ({
    UserID = 0,
    UserName = '',
    Password = '',
    Email = '',
    Tel = '',
    Activated = 0
  } = {}) {
    Object.assign(this, {
      userId: UserID,
      userName: UserName,
      password: Password,
      email: Email,
      tel: Tel,
      activated: Activated
    })
    return this
  }
  to ({
    userId = 0,
    userName,
    password,
    email,
    tel,
    activated
  } = this) {
    return {
      UserID: userId,
      UserName: userName,
      Password: password,
      Email: email,
      Tel: tel,
      Activated: activated
    }
  }
}
