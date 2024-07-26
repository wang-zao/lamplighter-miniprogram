import Base from './base'
const collectionName = 'game_themes'

/**
 * 权限: 所有用户可读
 */
class ThemeModal extends Base {
  constructor() {
    super(collectionName)
  }

  getAllThemes() {
    try {
      return this.model.get();
    } catch (error) {
      throw error
    }
  }
}

export default new ThemeModal()
