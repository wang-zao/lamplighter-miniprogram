// import $ from './../utils/Tool'

const DB_PREFIX = ''

export default class {
  constructor(collectionName) {
    const env = 'northenv-4gh0748xf50343cf';
    // const env = $.store.get('env')
    const db = wx.cloud.database({ env })
    this.model = db.collection(`${DB_PREFIX}${collectionName}`)
    this._ = db.command
    this.db = db
    this.env = env
  }

  get date() {
    return wx.cloud.database({ env: this.env }).serverDate()
  }

  /**
   * 取服务器偏移量后的时间
   * @param {Number} offset 时间偏移，单位为ms 可+可-
   */
  serverDate(offset = 0) {
    return wx.cloud.database({ env: this.env }).serverDate({ offset })
  }
}
