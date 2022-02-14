import Base from './base'
const collectionName = 'settings'

/**
 * 权限: 所有用户可读
 */
class SettingsModal extends Base {
  constructor() {
    super(collectionName)
  }

  getAllSettings() {
    try {
      return this.model.get();
    } catch (error) {
      throw error
    }
  }
}

export default new SettingsModal()
