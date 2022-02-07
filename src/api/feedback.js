import Base from './base'
const collectionName = 'feedbacks'

/**
 * 权限: 所有用户可读写
 */
class FeedBackModal extends Base {
  constructor() {
    super(collectionName)
  }

  addNewFeedBack(feedback) {
    const createDate = new Date().toString();
    return this.model.add({ data: {
      createDate,
      ...feedback,
    } });
  }
}

export default new FeedBackModal()
