/// <reference path="./index.d.ts" />


const BASE_URL = 'http://navigate.zhwpxz.com';
const formatData = (result: any) => {
  if (!result || result.length !== 2 || !result[1] || !result[1].data || !result[1].data.data) {
    return [];
  }
  const data = result[1].data.data;
  return data;
}


class API {
  
  async getGameQuestions(categoryId: number): Promise<{ data: Array<CityItem> }> {
    const params = { categoryId };
    const res = await uni.request({
      url: `${BASE_URL}/game_questions`,
      method: 'GET',
      data: params,
    });
    return (formatData(res));
  }

  // userRegister(username, password): Promise<{ data: { data: any } }> {
  //   const params = {
  //     account: username,
  //     nickname: username,
  //     password,
  //   };
  //   return api.post('/register', params);
  // }

  // userLogin(username, password): Promise<{ data: { data: any } }> {
  //   const params = {
  //     account: username,
  //     password,
  //   };
  //   return api.post('/login', params);
  // }

  // updateScore(score): Promise<{ data: { data: any } }> {
  //   const params = {
  //     score: score,
  //   };
  //   return api.post('/update', params);
  // }

  // userLogout(): Promise<{ data: { data: any } }> {
  //   return api.get('/logout');
  // }

  // getUserInfo(): Promise<{ data: { data: any } }> {
  //   return api.get('/users/currentUser');
  // }

  // updateUserInfo(params: {
  //   score?: number,
  //   nickname?: string,
  //   score_levels?: string,
  // }): Promise<{ data: { data: any } }> {
  //   return api.post('/users/updateInfo', params);
  // }

  // getAllRankings(): Promise<{ data: { data: any } }> {
  //   return api.get('/users/rank');
  // }

  async getAllCategories(): Promise<{ data: any }> {
    const res = await uni.request({
      url: `${BASE_URL}/game_category`,
      method: 'GET',
    });
    return formatData(res);
  }

}

export default new API();
