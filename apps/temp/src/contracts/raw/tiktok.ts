export interface Tiktok {
  cursor: string;
  extra: Extra;
  hasMore: boolean;
  itemList?: ItemList[];
  log_pb: LogPb;
  statusCode: number;
  status_code: number;
  status_msg: string;
  total?: number;
}

export interface Extra {
  logid: string;
  now: number;
}

export interface ItemList {
  AIGCDescription?: string;
  author: Author;
  authorStats: AuthorStats;
  challenges?: Challenge[];
  collected: boolean;
  contents?: Content[];
  createTime: number;
  desc: string;
  digged: boolean;
  diversificationId?: number;
  duetDisplay: number;
  duetEnabled?: boolean;
  forFriend: boolean;
  id: string;
  itemCommentStatus: number;
  item_control: ItemControl;
  music: Music;
  officalItem: boolean;
  originalItem: boolean;
  privateItem: boolean;
  secret: boolean;
  shareEnabled: boolean;
  stats: Stats;
  statsV2: StatsV2;
  stitchDisplay: number;
  stitchEnabled?: boolean;
  textExtra?: TextExtra2[];
  video: Video;
  videoSuggestWordsList?: VideoSuggestWordsList;
  poi?: Poi;
  imagePost?: ImagePost;
  aigcLabelType?: number;
  brandOrganicType?: number;
  anchors?: Anchor[];
  playlistId?: string;
  isAd?: boolean;
  duetInfo?: DuetInfo;
  adAuthorization?: boolean;
  itemMute?: boolean;
  warnInfo?: WarnInfo[];
  CategoryType?: number;
  authorStatsV2?: AuthorStatsV2;
  backendSourceEventTracking?: string;
  isReviewing?: boolean;
  textLanguage?: string;
  textTranslatable?: boolean;
  stickersOnItem?: StickersOnItem[];
  effectStickers?: EffectSticker[];
  titleLanguage?: string;
  titleTranslatable?: boolean;
}

export interface Author {
  avatarLarger: string;
  avatarMedium: string;
  avatarThumb: string;
  commentSetting: number;
  downloadSetting: number;
  duetSetting: number;
  ftc: boolean;
  id: string;
  isADVirtual: boolean;
  isEmbedBanned: boolean;
  nickname: string;
  openFavorite: boolean;
  privateAccount: boolean;
  relation: number;
  secUid: string;
  secret: boolean;
  signature: string;
  stitchSetting: number;
  uniqueId: string;
  verified: boolean;
  roomId?: string;
  UserStoryStatus?: number;
}

export interface AuthorStats {
  diggCount: number;
  followerCount: number;
  followingCount: number;
  friendCount: number;
  heart: number;
  heartCount: number;
  videoCount: number;
}

export interface Challenge {
  coverLarger: string;
  coverMedium: string;
  coverThumb: string;
  desc: string;
  id: string;
  profileLarger: string;
  profileMedium: string;
  profileThumb: string;
  title: string;
  isCommerce?: boolean;
}

export interface Content {
  desc: string;
  textExtra?: TextExtra[];
}

export interface TextExtra {
  awemeId: string;
  end: number;
  hashtagName: string;
  isCommerce: boolean;
  start: number;
  subType: number;
  type: number;
  secUid?: string;
  userId?: string;
  userUniqueId?: string;
}

export interface ItemControl {
  can_repost: boolean;
  can_comment?: boolean;
  can_creator_redirect?: boolean;
  can_music_redirect?: boolean;
  can_share?: boolean;
}

export interface Music {
  authorName?: string;
  coverLarge: string;
  coverMedium: string;
  coverThumb: string;
  duration?: number;
  id: string;
  original: boolean;
  playUrl?: string;
  title: string;
  album?: string;
  isCopyrighted?: boolean;
  private?: boolean;
  tt2dsp?: Tt2dsp;
}

export interface Tt2dsp {
  tt_to_dsp_song_infos?: TtToDspSongInfo[];
}

export interface TtToDspSongInfo {
  meta_song_id: string;
  platform: number;
  song_id: string;
  token?: Token;
}

export interface Token {
  apple_music_token: AppleMusicToken;
}

export interface AppleMusicToken {
  developer_token: string;
}

export interface Stats {
  collectCount: number;
  commentCount: number;
  diggCount: number;
  playCount: number;
  shareCount: number;
}

export interface StatsV2 {
  collectCount: string;
  commentCount: string;
  diggCount: string;
  playCount: string;
  repostCount: string;
  shareCount: string;
}

export interface TextExtra2 {
  awemeId: string;
  end: number;
  hashtagName: string;
  isCommerce: boolean;
  start: number;
  subType: number;
  type: number;
  secUid?: string;
  userId?: string;
  userUniqueId?: string;
}

export interface Video {
  VQScore?: string;
  bitrate?: number;
  bitrateInfo?: BitrateInfo[];
  codecType?: string;
  cover: string;
  definition?: string;
  downloadAddr?: string;
  duration: number;
  dynamicCover?: string;
  encodeUserTag?: string;
  encodedType?: string;
  format?: string;
  height: number;
  id: string;
  originCover: string;
  playAddr?: string;
  ratio: string;
  subtitleInfos?: SubtitleInfo[];
  videoQuality?: string;
  volumeInfo: VolumeInfo;
  width: number;
  zoomCover?: ZoomCover;
  PlayAddrStruct?: PlayAddrStruct;
  claInfo?: ClaInfo;
  size?: number;
  videoID?: string;
}

export interface BitrateInfo {
  Bitrate: number;
  BitrateFPS?: number;
  CodecType: string;
  Format?: string;
  GearName: string;
  MVMAF: string;
  PlayAddr: PlayAddr;
  QualityType: number;
  VideoExtra?: string;
}

export interface PlayAddr {
  DataSize: number;
  FileCs: string;
  FileHash: string;
  Height: number;
  Uri: string;
  UrlKey: string;
  UrlList: string[];
  Width: number;
}

export interface SubtitleInfo {
  Format: string;
  LanguageCodeName: string;
  LanguageID: string;
  Size: number;
  Source: string;
  Url: string;
  UrlExpire: number;
  Version: string;
}

export interface VolumeInfo {
  Loudness?: number;
  Peak?: number;
}

export interface ZoomCover {
  "240": string;
  "480": string;
  "720": string;
  "960": string;
}

export interface PlayAddrStruct {
  DataSize: number;
  FileCs: string;
  FileHash: string;
  Height: number;
  Uri: string;
  UrlKey: string;
  UrlList: string[];
  Width: number;
}

export interface ClaInfo {
  captionInfos?: CaptionInfo[];
  captionsType?: number;
  enableAutoCaption: boolean;
  hasOriginalAudio: boolean;
  originalLanguageInfo?: OriginalLanguageInfo;
  noCaptionReason?: number;
}

export interface CaptionInfo {
  captionFormat: string;
  claSubtitleID: string;
  expire: string;
  isAutoGen: boolean;
  isOriginalCaption: boolean;
  language: string;
  languageCode: string;
  languageID: string;
  subID: string;
  subtitleType: string;
  translationType: string;
  url: string;
  urlList: string[];
  variant: string;
}

export interface OriginalLanguageInfo {
  canTranslateRealTimeNoCheck: boolean;
  language: string;
  languageCode: string;
  languageID: string;
}

export interface VideoSuggestWordsList {
  video_suggest_words_struct: VideoSuggestWordsStruct[];
}

export interface VideoSuggestWordsStruct {
  hint_text: string;
  scene: string;
  words: Word[];
}

export interface Word {
  word: string;
  word_id: string;
}

export interface Poi {
  address: string;
  category: string;
  city: string;
  cityCode: string;
  country: string;
  countryCode: string;
  fatherPoiId: string;
  fatherPoiName: string;
  id: string;
  name: string;
  province: string;
  ttTypeCode: string;
  ttTypeNameMedium: string;
  ttTypeNameSuper: string;
  ttTypeNameTiny: string;
  type: number;
  typeCode: string;
}

export interface ImagePost {
  cover: Cover;
  images: Image[];
  shareCover: ShareCover;
  title: string;
}

export interface Cover {
  imageHeight: number;
  imageURL: ImageUrl;
  imageWidth: number;
}

export interface ImageUrl {
  urlList: string[];
}

export interface Image {
  imageHeight: number;
  imageURL: ImageUrl2;
  imageWidth: number;
}

export interface ImageUrl2 {
  urlList: string[];
}

export interface ShareCover {
  imageHeight: number;
  imageURL: ImageUrl3;
  imageWidth: number;
}

export interface ImageUrl3 {
  urlList: string[];
}

export interface Anchor {
  description?: string;
  extraInfo?: ExtraInfo;
  icon?: Icon;
  id: string;
  keyword: string;
  logExtra?: string;
  schema?: string;
  thumbnail?: Thumbnail;
  type: number;
}

export interface ExtraInfo {
  subtype: string;
}

export interface Icon {
  urlList: string[];
}

export interface Thumbnail {
  height: number;
  urlList: string[];
  width: number;
}

export interface DuetInfo {
  duetFromId: string;
}

export interface WarnInfo {
  key: string;
  lang: string;
  text: string;
  type: number;
  url: string;
}

export interface AuthorStatsV2 {
  diggCount: string;
  followerCount: string;
  followingCount: string;
  friendCount: string;
  heart: string;
  heartCount: string;
  videoCount: string;
}

export interface StickersOnItem {
  stickerText: string[];
  stickerType: number;
}

export interface EffectSticker {
  ID: string;
  name: string;
  stickerStats: StickerStats;
}

export interface StickerStats {
  useCount: number;
}

export interface LogPb {
  impr_id: string;
}
