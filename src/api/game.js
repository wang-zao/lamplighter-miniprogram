const DB_PREFIX = ''

/**
 * 权限: 所有用户可读
 */
class GameModal {
  initDB(collectionName) {
    const env = 'northenv-4gh0748xf50343cf';
    const db = wx.cloud.database({ env })
    this.model = db.collection(`${DB_PREFIX}${collectionName}`)
    this._ = db.command
    this.db = db
    this.env = env
  }

  get date() {
    return wx.cloud.database({ env: this.env }).serverDate()
  }

  serverDate(offset = 0) {
    return wx.cloud.database({ env: this.env }).serverDate({ offset })
  }

  async getGameQuestions(
    collectionName, page, size,
  ) {
    await this.initDB(collectionName);
    try {
      const { data } = await this.model.orderBy('id', 'asc')
        .skip(page * size)
        .limit(size)
        .get()
      return data
    } catch (error) {
      console.log('error!!!', error)
      throw error
    }
  }
}

export default new GameModal()