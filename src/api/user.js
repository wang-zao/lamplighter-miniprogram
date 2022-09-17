import Base from './base'
const collectionName = 'user'

/**
 * 权限: 所有用户可读，仅创建者可写
 */
class UserModel extends Base {
  constructor() {
    super(collectionName)
  }

  // 创建一个新的用户结构体
  generateNewUserStruct() {
    const createDate = new Date().toString();
    return {
      openid: '',
      nickName: '游客',
      country: '',
      province: '',
      city: '',
      avatarUrl: '',
      gender: 0,
      score: 0,
      createDate,
      scoreLastUpdateDate: createDate,
      notes: '',
      language: '',
    }
  }

  // 1.自动获取自己的OpenId
  async getUserOpenId() {
    const res = await wx.cloud.callFunction({
      name: 'user_auth',
    });
    return res;
  }

  // 2.检查一下是不是老用户
  async getExistingUserProfile() {
    const { result: { openid }} = await this.getUserOpenId();
    const { data } = await this.model.where({ openid: openid }).limit(1).get();
    if (data.length === 0) {
      return null;
    }
    return data[0];
  }

  // 3.如果不是老用户，是新用户，自动按照游客注册
  async registerAsTourist() {
    const { result: { openid }} = await this.getUserOpenId();
    const newProfile = this.generateNewUserStruct()
    newProfile.openid = openid;
    return this.model.add({ data: newProfile });
  }


  /**
   * 4.更新用户完整信息 (小程序端更新数据库基础库版本需>=2.9.4)
   * @param {Object} userInfo 用户信息
   */
  updateInfo({
    avatarUrl, nickName, gender, country, province, city, language,
  }) {
    return this.model.where({ _openid: '{openid}' }).update({ data: {
      avatarUrl, nickName, gender, country, province, city, language,
    } });
  }

  updateUnlockedCities(unlockedCities) {
    const unlockedString = JSON.stringify(unlockedCities);
    console.log('updateUnlockedCities', unlockedString);
    return this.model.where({ _openid: '{openid}' }).update({ data: {
      unlockedCities: unlockedString,
    } });
  }

  // 5.上传分数
  updateScore(newScore) {
    const scoreLastUpdateDate = new Date().toString();
    return this.model.where({ _openid: '{openid}' }).update({ data: {
      score: newScore,
      scoreLastUpdateDate,
    } });
  }

  async loadRankings(page, size) {
    try {
      const { data } = await this.model.orderBy('score', 'desc')
        .skip(page * size)
        .limit(size)
        .get();
      console.log('loadRankings', data);
      return data;
    } catch (error) {
      console.log('error!!!', error)
      throw error
    }
  }

  async getAllUserCount() {
    try {
      const { total } = await this.model.count();
      return total;
    } catch (error) {
      console.log('error!!!', error)
      throw error
    }
  }

  async getUserRankingNumber(userScore) {
    try {
      const { total } = await this.model.where({ score: this._.gt(userScore) }).count();
      return total + 1;
    } catch (error) {
      console.log('error!!!', error)
      throw error
    }
  }
}

export default new UserModel()
