import Base from './base'
const collectionName = 'user'

const doc = {
  grade: 0, // 词力值
  avatarUrl: '', // 头像
  country: '',
  province: '',
  city: '',
  signDate: '0000-00',
  lastSignDate: '0000-00'
}

/**
 * 权限: 所有用户可读，仅创建者可写
 */
class UserModel extends Base {
  constructor() {
    super(collectionName)
  }
  async getUserOpenId() {
    const res = await wx.cloud.callFunction({
      name: 'user_auth',
    });
    console.log('getOwnInfo, res', res);
    return userInfo;
  }
}

export default new UserModel()
