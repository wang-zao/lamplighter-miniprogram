
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