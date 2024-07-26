import Base from './base'
// import $ from './../utils/Tool'
// import log from './../utils/log'
const collectionName = 'test'

/**
 * 权限: 所有用户可读
 */
class TestModal extends Base {
  constructor() {
    super(collectionName)
  }

  getTestData() {
    const size = 10;
    // const matchCondition = { centerid: centerId };
    // .match(where)
      // .sample({ size })
    // console.log('this.model', this.model)
    try {
      // return this.model.get();
      return this.model.aggregate()
        // .match(matchCondition)
        .sample({ size })
        .end()
    } catch (error) {
      // log.error(error)
      throw error
    }
  }
}

export default new TestModal()
