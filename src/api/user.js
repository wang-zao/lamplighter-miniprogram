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


  register() {
    return this.model.add({ data: { ...doc, createTime: this.date } })
  }

  getUserInfo(openid) {
    return this.model.where({ _openid: openid }).limit(1).get()
  }

  /**
   * 获取自己的用户信息
   */
  async getOwnInfo() {
    const { result: userInfo } = await $.callCloud('model_user_getInfo')
    if (userInfo === null) { // 新用户
      await this.register()
      return (await this.getOwnInfo())
    }
    $.store.set('openid', userInfo._openid)
    return userInfo
  }

  /**
   * 更新用户信息 (小程序端更新数据库基础库版本需>=2.9.4)
   * @param {Object} userInfo 用户信息
   */
  updateInfo({ avatarUrl, nickName, gender, country, province, city }) {
    return this.model.where({ _openid: '{openid}' }).update({ data: { avatarUrl, nickName, gender, country, province, city } })
  }
}

export default new UserModel()
