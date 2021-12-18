
interface GameInfoItem {
  game_chn: string;
  game_icon_url: string;
  game_id: string;
  game_status: string;
  id: number;
  poi_count: number;
  theme_chn: string;
  theme_description: string;
  theme_id: number;
  unlock_min_score: number;
  _id: string;
}

interface ThemeInfoAligned {
  poi_count: number;
  theme_chn: string;
  theme_description: string;
  theme_id: number;
  theme_games: GameInfoAligned[];
}

interface GameInfoAligned {
  game_chn: string;
  game_icon_url: string;
  game_id: string;
  game_status: string;
  id: number;
  unlock_min_score: number;
  _id: string;
}


// new datatypes below, old ones above will be abandoned


interface CityItem {
  id: number;
  name: string;
  country: string;
  lat: number;
  lon: number;
  abs: string;
  pic_url: string;
  flag_url: string;
  city_url: string;
  nation_url: string;
  description: string;
  status?: string;
  label_size?: number;
}

interface CityLabelItem {
  id: number;
  name: string;
  country: string;
  lat: number;
  lon: number;
  abs: string;
  pic_url: string;
  flag_url: string;
  city_url: string;
  nation_url: string;
  description: string;
  status?: string;
  label_size?: number;
}

interface DataCtrl {
  cityList: CityItem[];
  currentCity: CityItem;
  nextCity: CityItem;
}


interface FlyConfig {
  fromLon: number;
  fromLat: number;
  toLon: number;
  toLat: number;
  drawOrbit: boolean;
  speed: number;
  hideLightBulb?: boolean;
}

interface GlobalArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string | string[];
}

interface GameCategory {
  category_id: number;
  category: string;
  category_chn: string;
  category_level: number;
  label: string;
  id: string;
  level_id: number;
  unlock_score: number;
  score: number;
  disabled: boolean;
  selected?: boolean;
}
