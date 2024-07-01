import Base from './base';
const collectionName = 'city_footprint_wikikeywords';

class FootprintModal extends Base {
  constructor() {
    super(collectionName);
  }

  async getFootprintCityById(id) {
    try {
      // id can be a string. make it to integer number first.
      if (typeof id === 'string') {
        id = parseInt(id);
      }
      const { data } = await this.model.where({ id: id }).get();
      return data[0];
    } catch (error) {
      // TODO: show error toasting to user for debuging in the future.
      return null;
    }
  }
}

export default new FootprintModal();