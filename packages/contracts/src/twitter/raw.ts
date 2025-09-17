/** biome-ignore-all lint/suspicious/noExplicitAny: this is a generated file */
/** biome-ignore-all lint/suspicious/noEmptyInterface: this is a generated file */

export interface Twitter {
  data: Data;
  errors?: Error[];
}

export interface Data {
  bookmark_timeline_v2: BookmarkTimelineV2;
}

export interface BookmarkTimelineV2 {
  timeline: Timeline;
}

export interface Timeline {
  instructions: Instruction[];
  responseObjects: ResponseObjects;
}

export interface Instruction {
  type: InstructionType;
  entries: Entry[];
}

export interface Entry {
  entryId: string;
  sortIndex: string;
  content: Content;
}

export interface Content {
  entryType: EntryTypeEnum;
  __typename: EntryTypeEnum;
  itemContent?: ItemContent;
  value?: string;
  cursorType?: CursorType;
  stopOnEmptyResponse?: boolean;
}

export enum EntryTypeEnum {
  TimelineTimelineCursor = "TimelineTimelineCursor",
  TimelineTimelineItem = "TimelineTimelineItem",
}

export enum CursorType {
  Bottom = "Bottom",
  Top = "Top",
}

export interface ItemContent {
  itemType: ItemTypeEnum;
  __typename: ItemTypeEnum;
  tweet_results: TweetResults;
  tweetDisplayType: TweetDisplayType;
}

export enum ItemTypeEnum {
  TimelineTweet = "TimelineTweet",
}

export enum TweetDisplayType {
  Tweet = "Tweet",
  TweetWithVisibilityResults = "TweetWithVisibilityResults",
}

export interface TweetResults {
  result?: TweetResultsResult;
}

export interface TweetResultsResult {
  __typename: TweetDisplayType;
  rest_id?: string;
  core?: FluffyCore;
  unmention_data?: UnmentionData;
  edit_control?: EditControl;
  is_translatable?: boolean;
  views?: Views;
  source?: string;
  grok_analysis_button?: boolean;
  quoted_status_result?: ResultQuotedStatusResult;
  legacy?: StickyLegacy;
  post_video_description?: string;
  note_tweet?: TweetNoteTweet;
  post_image_description?: string;
  tweet?: FluffyTweet;
  limitedActionResults?: LimitedActionResults;
  community_results?: ResultCommunityResults;
  author_community_relationship?: AuthorCommunityRelationship;
  previous_counts?: PreviousCounts;
  card?: PurpleCard;
  article?: Article;
  birdwatch_pivot?: BirdwatchPivot;
}

export interface Article {
  article_results: ArticleResults;
}

export interface ArticleResults {
  result: ArticleResultsResult;
}

export interface ArticleResultsResult {
  rest_id: string;
  id: string;
  title: string;
  preview_text: string;
  cover_media: CoverMedia;
  lifecycle_state: LifecycleState;
  metadata: Metadata;
}

export interface CoverMedia {
  id: string;
  media_key: string;
  media_id: string;
  media_info: MediaInfo;
}

export interface MediaInfo {
  __typename?: string;
  original_img_height: number;
  original_img_width: number;
  original_img_url: string;
  color_info: ColorInfo;
  salient_rect?: SalientRect;
}

export interface ColorInfo {
  palette: Palette[];
}

export interface Palette {
  rgb: RGB;
  percentage: number;
}

export interface RGB {
  blue: number;
  green: number;
  red: number;
}

export interface SalientRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface LifecycleState {
  modified_at_secs: number;
}

export interface Metadata {
  first_published_at_secs: number;
}

export interface AuthorCommunityRelationship {
  community_results: AuthorCommunityRelationshipCommunityResults;
  role: Role;
  user_results: AuthorCommunityRelationshipUserResults;
}

export interface AuthorCommunityRelationshipCommunityResults {
  result: PurpleResult;
}

export interface PurpleResult {
  __typename: PurpleTypename;
  id_str: string;
  name: string;
  description?: string;
  created_at: number;
  question?: string;
  search_tags: string[];
  is_nsfw: boolean;
  primary_community_topic?: PrimaryCommunityTopic;
  actions: Actions;
  admin_results: Results;
  creator_results: Results;
  invites_result: Result;
  join_policy: JoinPolicy;
  invites_policy: InvitesPolicy;
  is_pinned: boolean;
  members_facepile_results: MembersFacepileResult[];
  moderator_count: number;
  member_count: number;
  role: Role;
  rules: Rule[];
  custom_banner_media: BannerMedia;
  default_banner_media: BannerMedia;
  viewer_relationship: ViewerRelationship;
  join_requests_result: JoinRequestsResult;
}

export enum PurpleTypename {
  Community = "Community",
  CommunityUnavailable = "CommunityUnavailable",
}

export interface Actions {
  delete_action_result: DeleteActionResult;
  join_action_result: Result;
  leave_action_result: Result;
  pin_action_result: JoinRequestsResult;
}

export interface DeleteActionResult {
  __typename: DeleteActionResultTypename;
  reason: Reason;
}

export enum DeleteActionResultTypename {
  CommunityDeleteActionUnavailable = "CommunityDeleteActionUnavailable",
}

export enum Reason {
  Unavailable = "Unavailable",
  ViewerNotMember = "ViewerNotMember",
  ViewerRequestRequired = "ViewerRequestRequired",
}

export interface Result {
  __typename: InvitesResultTypename;
  reason?: Reason;
  message?: Message;
}

export enum InvitesResultTypename {
  CommunityInvitesUnavailable = "CommunityInvitesUnavailable",
  CommunityJoinAction = "CommunityJoinAction",
  CommunityJoinActionUnavailable = "CommunityJoinActionUnavailable",
  CommunityLeaveActionUnavailable = "CommunityLeaveActionUnavailable",
}

export enum Message {
  MustBeAMemberOfTheCommunityToInviteOthers = "Must be a member of the Community to invite others.",
  NotAMember = "Not a member.",
  YouMustRequestToJoinThisCommunity = "You must request to join this Community.",
}

export interface JoinRequestsResult {
  __typename: JoinRequestsResultTypename;
}

export enum JoinRequestsResultTypename {
  CommunityJoinRequestsUnavailable = "CommunityJoinRequestsUnavailable",
  CommunityTweetPinActionUnavailable = "CommunityTweetPinActionUnavailable",
  CommunityUserDefaultModerationState = "CommunityUserDefaultModerationState",
}

export interface Results {
  result: AdminResultsResult;
}

export interface AdminResultsResult {
  __typename: FluffyTypename;
  id?: string;
  rest_id?: string;
  affiliates_highlighted_label?: AffiliatesHighlightedLabel;
  avatar?: Avatar;
  core?: PurpleCore;
  dm_permissions?: DmPermissions;
  has_graduated_access?: boolean;
  is_blue_verified?: boolean;
  legacy?: PurpleLegacy;
  location?: ResultLocation;
  media_permissions?: MediaPermissions;
  parody_commentary_fan_label?: ParodyCommentaryFanLabel;
  profile_image_shape?: ProfileImageShape;
  professional?: Professional;
  privacy?: Privacy;
  relationship_perspectives?: RelationshipPerspectives;
  tipjar_settings?: PurpleTipjarSettings;
  super_follow_eligible?: boolean;
  verification?: PurpleVerification;
  message?: string;
  reason?: string;
}

export enum FluffyTypename {
  User = "User",
  UserUnavailable = "UserUnavailable",
}

export interface AffiliatesHighlightedLabel {
  label?: Label;
}

export interface Label {
  url: LabelURL;
  badge: Badge;
  description: string;
  userLabelType: UserLabelType;
  userLabelDisplayType: UserLabelDisplayType;
}

export interface Badge {
  url: string;
}

export interface LabelURL {
  url: string;
  urlType: URLType;
}

export enum URLType {
  DeepLink = "DeepLink",
}

export enum UserLabelDisplayType {
  Badge = "Badge",
}

export enum UserLabelType {
  BusinessLabel = "BusinessLabel",
}

export interface Avatar {
  image_url?: string;
}

export interface PurpleCore {
  created_at: string;
  name?: string;
  screen_name: string;
}

export interface DmPermissions {
  can_dm: boolean;
  can_dm_on_xchat: boolean;
}

export interface PurpleLegacy {
  default_profile: boolean;
  default_profile_image: boolean;
  description: string;
  entities: PurpleEntities;
  fast_followers_count: number;
  favourites_count: number;
  followers_count: number;
  friends_count: number;
  has_custom_timelines: boolean;
  is_translator: boolean;
  listed_count: number;
  media_count: number;
  normal_followers_count: number;
  pinned_tweet_ids_str: string[];
  possibly_sensitive: boolean;
  profile_banner_url?: string;
  profile_interstitial_type: ProfileInterstitialType;
  statuses_count: number;
  translator_type: TranslatorType;
  want_retweets: boolean;
  withheld_in_countries: string[];
  url?: string;
  withheld_scope?: WithheldScope;
}

export interface PurpleEntities {
  description: DescriptionClass;
  url?: DescriptionClass;
}

export interface DescriptionClass {
  urls: URLElement[];
}

export interface URLElement {
  display_url: string;
  expanded_url: string;
  url: string;
  indices: number[];
}

export enum ProfileInterstitialType {
  Empty = "",
  FakeAccount = "fake_account",
  OffensiveProfileContent = "offensive_profile_content",
  SensitiveMedia = "sensitive_media",
}

export enum TranslatorType {
  None = "none",
  Regular = "regular",
}

export enum WithheldScope {
  User = "user",
}

export interface ResultLocation {
  location?: string;
}

export interface MediaPermissions {
  can_media_tag: boolean;
}

export enum ParodyCommentaryFanLabel {
  Commentary = "Commentary",
  Fan = "Fan",
  None = "None",
  Parody = "Parody",
}

export interface Privacy {
  protected: boolean;
}

export interface Professional {
  rest_id: string;
  professional_type: ProfessionalType;
  category: Category[];
}

export interface Category {
  id: number;
  name: string;
  icon_name: IconName;
}

export enum IconName {
  IconBriefcaseStroke = "IconBriefcaseStroke",
}

export enum ProfessionalType {
  Business = "Business",
  Creator = "Creator",
}

export enum ProfileImageShape {
  Circle = "Circle",
  Square = "Square",
}

export interface RelationshipPerspectives {
  following: boolean;
}

export interface PurpleTipjarSettings {
  is_enabled?: boolean;
  ethereum_handle?: EthereumHandle;
  cash_app_handle?: string;
  venmo_handle?: string;
  patreon_handle?: PatreonHandle;
  bitcoin_handle?: string;
}

export enum EthereumHandle {
  Empty = "",
  The0X9Ef0FD536E5F1Abc688EB83Ef72394C3594FDe8D = "0x9Ef0fD536E5f1abc688EB83Ef72394c3594FDe8D",
  The0XC9839273A72A0Df6Ff8338B3111952A4A08Cbe53 = "0xC9839273a72a0Df6ff8338b3111952A4a08Cbe53",
  The0Xf9F0Cb4AF8D53E7D6097B16B1C3A2FB357282086 = "0xf9f0cb4AF8d53E7d6097B16b1C3A2fB357282086",
}

export enum PatreonHandle {
  Empty = "",
  Mattwallace = "mattwallace",
  Song = "song",
  Tvflam = "tvflam",
}

export interface PurpleVerification {
  verified: boolean;
}

export interface BannerMedia {
  media_info: MediaInfo;
}

export enum InvitesPolicy {
  MemberInvitesAllowed = "MemberInvitesAllowed",
  ModeratorInvitesAllowed = "ModeratorInvitesAllowed",
}

export enum JoinPolicy {
  Open = "Open",
  RestrictedJoinRequestsRequireModeratorApproval = "RestrictedJoinRequestsRequireModeratorApproval",
}

export interface MembersFacepileResult {
  result: MembersFacepileResultResult;
}

export interface MembersFacepileResultResult {
  __typename: FluffyTypename;
  id: string;
  rest_id: string;
  affiliates_highlighted_label: AffiliatesHighlightedLabel;
  avatar: Avatar;
  core: PurpleCore;
  dm_permissions: DmPermissions;
  has_graduated_access: boolean;
  is_blue_verified: boolean;
  legacy: PurpleLegacy;
  location: ResultLocation;
  media_permissions: MediaPermissions;
  parody_commentary_fan_label: ParodyCommentaryFanLabel;
  profile_image_shape: ProfileImageShape;
  professional?: Professional;
  privacy: Privacy;
  relationship_perspectives: RelationshipPerspectives;
  tipjar_settings: PurpleTipjarSettings;
  super_follow_eligible?: boolean;
  verification: PurpleVerification;
}

export interface PrimaryCommunityTopic {
  topic_id: string;
  topic_name: string;
}

export enum Role {
  Admin = "Admin",
  Member = "Member",
  Moderator = "Moderator",
  NonMember = "NonMember",
}

export interface Rule {
  rest_id: string;
  name: string;
  description?: string;
}

export interface ViewerRelationship {
  moderation_state: JoinRequestsResult;
}

export interface AuthorCommunityRelationshipUserResults {
  result: FluffyResult;
}

export interface FluffyResult {
  __typename: FluffyTypename;
  id: string;
  rest_id: string;
  affiliates_highlighted_label: UnmentionData;
  avatar: Avatar;
  core: PurpleCore;
  dm_permissions: DmPermissions;
  has_graduated_access: boolean;
  is_blue_verified: boolean;
  legacy: PurpleLegacy;
  location: ResultLocation;
  media_permissions: MediaPermissions;
  parody_commentary_fan_label: ParodyCommentaryFanLabel;
  profile_image_shape: ProfileImageShape;
  privacy: Privacy;
  relationship_perspectives: RelationshipPerspectives;
  tipjar_settings: FluffyTipjarSettings;
  verification: PurpleVerification;
  professional?: Professional;
  super_follow_eligible?: boolean;
}

export interface UnmentionData {}

export interface FluffyTipjarSettings {
  is_enabled?: boolean;
  patreon_handle?: PatreonHandle;
  ethereum_handle?: EthereumHandle;
}

export interface BirdwatchPivot {
  callToAction: CallToAction;
  destinationUrl: string;
  footer: Footer;
  note: Note;
  subtitle: Footer;
  title: string;
  shorttitle: string;
  visualStyle: string;
  iconType: string;
  footerIconType: string;
}

export interface CallToAction {
  prompt: string;
  title: string;
  destinationUrl: string;
}

export interface Footer {
  text: string;
  entities: Entity[];
}

export interface Entity {
  fromIndex: number;
  toIndex: number;
  ref: Ref;
}

export interface Ref {
  type: string;
  url: string;
  urlType: string;
}

export interface Note {
  rest_id: string;
  language: Lang;
  is_community_note_translatable: boolean;
}

export enum Lang {
  Ar = "ar",
  CS = "cs",
  Da = "da",
  En = "en",
  Es = "es",
  Fa = "fa",
  Fi = "fi",
  In = "in",
  LV = "lv",
  Pl = "pl",
  Qme = "qme",
  Ro = "ro",
  Tr = "tr",
  Und = "und",
  Ur = "ur",
  Zh = "zh",
  Zxx = "zxx",
}

export interface PurpleCard {
  rest_id: string;
  legacy: FluffyLegacy;
}

export interface FluffyLegacy {
  binding_values: PurpleBindingValue[];
  card_platform: CardPlatform;
  name: string;
  url: string;
  user_refs_results: PurpleUserRefsResult[];
}

export interface PurpleBindingValue {
  key: string;
  value: PurpleValue;
}

export interface PurpleValue {
  image_value?: ImageValue;
  type: ValueType;
  string_value?: string;
  scribe_key?: ScribeKey;
  user_value?: UserValue;
  image_color_value?: ColorInfo;
  boolean_value?: boolean;
}

export interface ImageValue {
  height: number;
  width: number;
  url: string;
  alt?: Alt;
}

export enum Alt {
  اعترافاتفيلسوفجهادي = "اعترافات فيلسوف جهادي",
}

export enum ScribeKey {
  CardURL = "card_url",
  PublisherID = "publisher_id",
  VanityURL = "vanity_url",
}

export enum ValueType {
  Boolean = "BOOLEAN",
  Image = "IMAGE",
  ImageColor = "IMAGE_COLOR",
  String = "STRING",
  User = "USER",
}

export interface UserValue {
  id_str: string;
  path: any[];
}

export interface CardPlatform {
  platform: Platform;
}

export interface Platform {
  audience: Audience;
  device: Device;
}

export interface Audience {
  name: AudienceName;
}

export enum AudienceName {
  Production = "production",
}

export interface Device {
  name: DeviceName;
  version: string;
}

export enum DeviceName {
  Swift = "Swift",
}

export interface PurpleUserRefsResult {
  result: TentacledResult;
}

export interface TentacledResult {
  __typename: FluffyTypename;
  id: string;
  rest_id: string;
  affiliates_highlighted_label: UnmentionData;
  avatar: Avatar;
  core: PurpleCore;
  dm_permissions: DmPermissions;
  has_graduated_access: boolean;
  is_blue_verified: boolean;
  legacy: TentacledLegacy;
  location: ResultLocation;
  media_permissions: MediaPermissions;
  parody_commentary_fan_label: ParodyCommentaryFanLabel;
  profile_image_shape: ProfileImageShape;
  privacy: Privacy;
  relationship_perspectives: RelationshipPerspectives;
  tipjar_settings: UnmentionData;
  verification: FluffyVerification;
  professional?: Professional;
}

export interface TentacledLegacy {
  default_profile: boolean;
  default_profile_image: boolean;
  description: string;
  entities: PurpleEntities;
  fast_followers_count: number;
  favourites_count: number;
  followers_count: number;
  friends_count: number;
  has_custom_timelines: boolean;
  is_translator: boolean;
  listed_count: number;
  media_count: number;
  normal_followers_count: number;
  pinned_tweet_ids_str: string[];
  possibly_sensitive: boolean;
  profile_banner_url?: string;
  profile_interstitial_type: string;
  statuses_count: number;
  translator_type: TranslatorType;
  url?: string;
  want_retweets: boolean;
  withheld_in_countries: any[];
}

export interface FluffyVerification {
  verified: boolean;
  verified_type?: VerifiedType;
}

export enum VerifiedType {
  Business = "Business",
  Government = "Government",
}

export interface ResultCommunityResults {
  result: StickyResult;
}

export interface StickyResult {
  __typename: PurpleTypename;
  id_str?: string;
  viewer_relationship?: ViewerRelationship;
}

export interface FluffyCore {
  user_results: PurpleUserResults;
}

export interface PurpleUserResults {
  result: IndigoResult;
}

export interface IndigoResult {
  __typename: FluffyTypename;
  id: string;
  rest_id: string;
  affiliates_highlighted_label: AffiliatesHighlightedLabel;
  avatar: Avatar;
  core: PurpleCore;
  dm_permissions: DmPermissions;
  has_graduated_access: boolean;
  is_blue_verified: boolean;
  legacy: PurpleLegacy;
  location: ResultLocation;
  media_permissions: MediaPermissions;
  parody_commentary_fan_label: ParodyCommentaryFanLabel;
  profile_image_shape: ProfileImageShape;
  privacy: Privacy;
  relationship_perspectives: RelationshipPerspectives;
  tipjar_settings: TentacledTipjarSettings;
  verification: FluffyVerification;
  professional?: Professional;
  super_follow_eligible?: boolean;
}

export interface TentacledTipjarSettings {
  is_enabled?: boolean;
  bitcoin_handle?: string;
  ethereum_handle?: string;
  gofundme_handle?: string;
  patreon_handle?: string;
  cash_app_handle?: string;
  bandcamp_handle?: string;
  pay_pal_handle?: string;
  venmo_handle?: string;
}

export interface EditControl {
  edit_tweet_ids?: string[];
  editable_until_msecs?: string;
  is_edit_eligible?: boolean;
  edits_remaining?: string;
  initial_tweet_id?: string;
  edit_control_initial?: EditControlInitial;
}

export interface EditControlInitial {
  edit_tweet_ids: string[];
  editable_until_msecs: string;
  is_edit_eligible: boolean;
  edits_remaining: string;
}

export interface StickyLegacy {
  bookmark_count: number;
  bookmarked: boolean;
  created_at: string;
  conversation_id_str: string;
  display_text_range: number[];
  entities: Entit;
  favorite_count: number;
  favorited: boolean;
  full_text: string;
  is_quote_status: boolean;
  lang: Lang;
  quote_count: number;
  quoted_status_id_str?: string;
  quoted_status_permalink?: QuotedStatusPermalink;
  reply_count: number;
  retweet_count: number;
  retweeted: boolean;
  user_id_str: string;
  id_str: string;
  extended_entities?: PurpleExtendedEntities;
  possibly_sensitive?: boolean;
  possibly_sensitive_editable?: boolean;
  in_reply_to_screen_name?: string;
  in_reply_to_status_id_str?: string;
  in_reply_to_user_id_str?: string;
  scopes?: Scopes;
  place?: Place;
}

export interface Entit {
  hashtags: Hashtag[];
  symbols: Hashtag[];
  timestamps?: any[];
  urls: URLElement[];
  user_mentions: UserMention[];
  media?: EntitiesMedia[];
}

export interface Hashtag {
  indices: number[];
  text: string;
}

export interface EntitiesMedia {
  display_url: string;
  expanded_url: string;
  id_str: string;
  indices: number[];
  media_key: string;
  media_url_https: string;
  type: MediaType;
  url: string;
  additional_media_info?: PurpleAdditionalMediaInfo;
  ext_media_availability: EXTMediaAvailability;
  sizes: Sizes;
  original_info: OriginalInfo;
  allow_download_status?: AllowDownloadStatus;
  video_info?: VideoInfo;
  media_results: MediaResults;
  features?: Features;
  source_status_id_str?: string;
  source_user_id_str?: string;
  ext_alt_text?: string;
}

export interface PurpleAdditionalMediaInfo {
  monetizable: boolean;
  source_user?: PurpleSourceUser;
  title?: string;
  description?: DescriptionEnum;
  embeddable?: boolean;
  call_to_actions?: CallToActions;
}

export interface CallToActions {
  watch_now?: Badge;
  visit_site?: Badge;
}

export enum DescriptionEnum {
  Empty = "",
  MoreOnAljazeeraCOM = "More on Aljazeera.com",
}

export interface PurpleSourceUser {
  user_results: FluffyUserResults;
}

export interface FluffyUserResults {
  result: IndecentResult;
}

export interface IndecentResult {
  __typename: FluffyTypename;
  id: string;
  rest_id: string;
  affiliates_highlighted_label: AffiliatesHighlightedLabel;
  avatar: Avatar;
  core: PurpleCore;
  dm_permissions: DmPermissions;
  has_graduated_access: boolean;
  is_blue_verified: boolean;
  legacy: TentacledLegacy;
  location: ResultLocation;
  media_permissions: MediaPermissions;
  parody_commentary_fan_label: ParodyCommentaryFanLabel;
  profile_image_shape: ProfileImageShape;
  professional?: Professional;
  privacy: Privacy;
  relationship_perspectives: RelationshipPerspectives;
  tipjar_settings: PurpleTipjarSettings;
  verification: FluffyVerification;
  super_follow_eligible?: boolean;
}

export interface AllowDownloadStatus {
  allow_download?: boolean;
}

export interface EXTMediaAvailability {
  status: Status;
}

export enum Status {
  Available = "Available",
}

export interface Features {
  large: OrigClass;
  medium: OrigClass;
  small: OrigClass;
  orig: OrigClass;
  all?: All;
}

export interface All {
  tags: Tag[];
}

export interface Tag {
  user_id: string;
  name: TagName;
  screen_name: ScreenName;
  type: WithheldScope;
}

export enum TagName {
  FikriStudio = "Fikri Studio",
  HamdyEltony = "Hamdy Eltony",
  IwanTypeإيوانتايب = "Iwan Type إيوان تايب",
  Nξxus = "NΞXUS",
  WaelDesigner = "Wael Designer",
  شعاراتعربية = "شعارات عربية",
}

export enum ScreenName {
  ArabicLogos = "arabic_logos",
  FikriStudio = "FikriStudio",
  HamdyEltony = "hamdy_eltony",
  IwanType = "IwanType",
  NexusToNova = "NEXUS_TO_NOVA",
  WaelDesigner = "WaelDesigner",
}

export interface OrigClass {
  faces: FocusRect[];
}

export interface FocusRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface MediaResults {
  result: MediaResultsResult;
}

export interface MediaResultsResult {
  media_key: string;
}

export interface OriginalInfo {
  height: number;
  width: number;
  focus_rects: FocusRect[];
}

export interface Sizes {
  large: ThumbClass;
  medium: ThumbClass;
  small: ThumbClass;
  thumb: ThumbClass;
}

export interface ThumbClass {
  h: number;
  w: number;
  resize: Resize;
}

export enum Resize {
  Crop = "crop",
  Fit = "fit",
}

export enum MediaType {
  AnimatedGIF = "animated_gif",
  Photo = "photo",
  Video = "video",
}

export interface VideoInfo {
  aspect_ratio: number[];
  duration_millis?: number;
  variants: Variant[];
}

export interface Variant {
  content_type: ContentType;
  url: string;
  bitrate?: number;
}

export enum ContentType {
  ApplicationXMPEGURL = "application/x-mpegURL",
  VideoMp4 = "video/mp4",
}

export interface UserMention {
  id_str: string;
  name: string;
  screen_name: string;
  indices: number[];
}

export interface PurpleExtendedEntities {
  media: PurpleMedia[];
}

export interface PurpleMedia {
  display_url: string;
  expanded_url: string;
  id_str: string;
  indices: number[];
  media_key: string;
  media_url_https: string;
  type: MediaType;
  url: string;
  additional_media_info?: FluffyAdditionalMediaInfo;
  ext_media_availability: EXTMediaAvailability;
  sizes: Sizes;
  original_info: OriginalInfo;
  allow_download_status?: AllowDownloadStatus;
  video_info?: VideoInfo;
  media_results: MediaResults;
  features?: Features;
  source_status_id_str?: string;
  source_user_id_str?: string;
  ext_alt_text?: string;
}

export interface FluffyAdditionalMediaInfo {
  monetizable: boolean;
  source_user?: FluffySourceUser;
  title?: Title;
  description?: string;
  embeddable?: boolean;
  call_to_actions?: CallToActions;
}

export interface FluffySourceUser {
  user_results: TentacledUserResults;
}

export interface TentacledUserResults {
  result: HilariousResult;
}

export interface HilariousResult {
  __typename: FluffyTypename;
  id: string;
  rest_id: string;
  affiliates_highlighted_label: AffiliatesHighlightedLabel;
  avatar: Avatar;
  core: PurpleCore;
  dm_permissions: DmPermissions;
  has_graduated_access: boolean;
  is_blue_verified: boolean;
  legacy: PurpleLegacy;
  location: ResultLocation;
  media_permissions: MediaPermissions;
  parody_commentary_fan_label: ParodyCommentaryFanLabel;
  profile_image_shape: ProfileImageShape;
  professional?: Professional;
  privacy: Privacy;
  relationship_perspectives: RelationshipPerspectives;
  tipjar_settings: PurpleTipjarSettings;
  verification: FluffyVerification;
  super_follow_eligible?: boolean;
}

export enum Title {
  Empty = "",
  TheAssassin2025 = "The Assassin (2025)",
  رئيسبلديةاسطنبوليشتكيللألمانوالغربيينمنتركيا = "رئيس بلدية اسطنبول يشتكي للألمان والغربيين من تركيا!",
}

export interface Place {
  bounding_box: BoundingBox;
  country: string;
  country_code: string;
  full_name: string;
  name: string;
  id: string;
  place_type: string;
  url: string;
}

export interface BoundingBox {
  coordinates: Array<Array<number[]>>;
  type: string;
}

export interface QuotedStatusPermalink {
  url: string;
  expanded: string;
  display: string;
}

export interface Scopes {
  followers: boolean;
}

export interface LimitedActionResults {
  limited_actions: LimitedAction[];
}

export interface LimitedAction {
  action: Action;
  prompt: Prompt;
}

export enum Action {
  Reply = "Reply",
}

export interface Prompt {
  __typename: PromptTypename;
  cta_type: CtaType;
  headline: Footer;
  subtext: Footer;
}

export enum PromptTypename {
  CtaLimitedActionPrompt = "CtaLimitedActionPrompt",
}

export enum CtaType {
  SeeConversation = "SeeConversation",
}

export interface TweetNoteTweet {
  is_expandable: boolean;
  note_tweet_results: PurpleNoteTweetResults;
}

export interface PurpleNoteTweetResults {
  result: AmbitiousResult;
}

export interface AmbitiousResult {
  id: string;
  text: string;
  entity_set: Entit;
  richtext?: Richtext;
  media?: ResultMedia;
}

export interface ResultMedia {
  inline_media: any[];
}

export interface Richtext {
  richtext_tags: RichtextTag[];
}

export interface RichtextTag {
  from_index: number;
  to_index: number;
  richtext_types: RichtextType[];
}

export enum RichtextType {
  Bold = "Bold",
}

export interface PreviousCounts {
  bookmark_count: number;
  favorite_count: number;
  quote_count: number;
  reply_count: number;
  retweet_count: number;
}

export interface ResultQuotedStatusResult {
  result?: CunningResult;
}

export interface CunningResult {
  __typename: TentacledTypename;
  rest_id?: string;
  post_video_description?: string;
  core?: FluffyCore;
  unmention_data?: UnmentionData;
  edit_control?: EditControl;
  is_translatable?: boolean;
  views?: Views;
  source?: string;
  grok_analysis_button?: boolean;
  legacy?: IndecentLegacy;
  note_tweet?: TweetNoteTweet;
  post_image_description?: string;
  quotedRefResult?: QuotedRefResult;
  tombstone?: Tombstone;
  card?: FluffyCard;
  previous_counts?: PreviousCounts;
}

export enum TentacledTypename {
  Tweet = "Tweet",
  TweetTombstone = "TweetTombstone",
}

export interface FluffyCard {
  rest_id: string;
  legacy: IndigoLegacy;
}

export interface IndigoLegacy {
  binding_values: FluffyBindingValue[];
  card_platform: CardPlatform;
  name: string;
  url: string;
  user_refs_results: FluffyUserRefsResult[];
}

export interface FluffyBindingValue {
  key: string;
  value: FluffyValue;
}

export interface FluffyValue {
  string_value?: string;
  type: ValueType;
  scribe_key?: ScribeKey;
  image_value?: ImageValue;
  user_value?: UserValue;
  image_color_value?: ColorInfo;
}

export interface FluffyUserRefsResult {
  result: MagentaResult;
}

export interface MagentaResult {
  __typename: FluffyTypename;
  id: string;
  rest_id: string;
  affiliates_highlighted_label: UnmentionData;
  avatar: Avatar;
  core: PurpleCore;
  dm_permissions: DmPermissions;
  has_graduated_access: boolean;
  is_blue_verified: boolean;
  legacy: TentacledLegacy;
  location: ResultLocation;
  media_permissions: MediaPermissions;
  parody_commentary_fan_label: ParodyCommentaryFanLabel;
  profile_image_shape: ProfileImageShape;
  privacy: Privacy;
  relationship_perspectives: RelationshipPerspectives;
  tipjar_settings: UnmentionData;
  verification: FluffyVerification;
}

export interface IndecentLegacy {
  bookmark_count: number;
  bookmarked: boolean;
  created_at: string;
  conversation_id_str: string;
  display_text_range: number[];
  entities: Entit;
  extended_entities?: FluffyExtendedEntities;
  favorite_count: number;
  favorited: boolean;
  full_text: string;
  is_quote_status: boolean;
  lang: Lang;
  possibly_sensitive?: boolean;
  possibly_sensitive_editable?: boolean;
  quote_count: number;
  reply_count: number;
  retweet_count: number;
  retweeted: boolean;
  user_id_str: string;
  id_str: string;
  in_reply_to_screen_name?: string;
  in_reply_to_status_id_str?: string;
  in_reply_to_user_id_str?: string;
  quoted_status_id_str?: string;
  quoted_status_permalink?: QuotedStatusPermalink;
}

export interface FluffyExtendedEntities {
  media: FluffyMedia[];
}

export interface FluffyMedia {
  display_url: string;
  expanded_url: string;
  id_str: string;
  indices: number[];
  media_key: string;
  media_url_https: string;
  type: MediaType;
  url: string;
  additional_media_info?: TentacledAdditionalMediaInfo;
  ext_media_availability: EXTMediaAvailability;
  sizes: Sizes;
  original_info: OriginalInfo;
  allow_download_status?: AllowDownloadStatus;
  video_info?: VideoInfo;
  media_results: MediaResults;
  features?: Features;
  source_status_id_str?: string;
  source_user_id_str?: string;
}

export interface TentacledAdditionalMediaInfo {
  monetizable: boolean;
  title?: string;
  description?: DescriptionEnum;
  embeddable?: boolean;
  source_user?: TentacledSourceUser;
}

export interface TentacledSourceUser {
  user_results: StickyUserResults;
}

export interface StickyUserResults {
  result: FriskyResult;
}

export interface FriskyResult {
  __typename: FluffyTypename;
  id: string;
  rest_id: string;
  affiliates_highlighted_label: UnmentionData;
  avatar: Avatar;
  core: PurpleCore;
  dm_permissions: DmPermissions;
  has_graduated_access: boolean;
  is_blue_verified: boolean;
  legacy: PurpleLegacy;
  location: ResultLocation;
  media_permissions: MediaPermissions;
  parody_commentary_fan_label: ParodyCommentaryFanLabel;
  profile_image_shape: ProfileImageShape;
  professional?: Professional;
  privacy: Privacy;
  relationship_perspectives: RelationshipPerspectives;
  tipjar_settings: PurpleTipjarSettings;
  verification: FluffyVerification;
}

export interface QuotedRefResult {
  result?: QuotedRefResultResult;
}

export interface QuotedRefResultResult {
  __typename: TweetDisplayType;
  rest_id?: string;
  tweet?: PurpleTweet;
}

export interface PurpleTweet {
  rest_id: string;
}

export interface Tombstone {
  __typename: string;
  text: Text;
}

export interface Text {
  rtl: boolean;
  text: string;
  entities: Entity[];
}

export interface Views {
  count?: string;
  state: State;
}

export enum State {
  Enabled = "Enabled",
  EnabledWithCount = "EnabledWithCount",
}

export interface FluffyTweet {
  rest_id: string;
  post_image_description?: string;
  core: TweetCore;
  unmention_data: UnmentionData;
  edit_control: EditControl;
  previous_counts?: PreviousCounts;
  is_translatable: boolean;
  views: Views;
  source: string;
  grok_analysis_button: boolean;
  legacy: TweetLegacy;
  post_video_description?: string;
  note_tweet?: TweetNoteTweet;
  quoted_status_result?: TweetQuotedStatusResult;
  card?: TweetCard;
  birdwatch_pivot?: BirdwatchPivot;
}

export interface TweetCard {
  rest_id: string;
  legacy: HilariousLegacy;
}

export interface HilariousLegacy {
  binding_values: TentacledBindingValue[];
  card_platform: CardPlatform;
  name: string;
  url: string;
  user_refs_results: any[];
}

export interface TentacledBindingValue {
  key: string;
  value: TentacledValue;
}

export interface TentacledValue {
  string_value: string;
  type: ValueType;
  scribe_key?: ScribeKey;
}

export interface TweetCore {
  user_results: IndigoUserResults;
}

export interface IndigoUserResults {
  result: MischievousResult;
}

export interface MischievousResult {
  __typename: FluffyTypename;
  id: string;
  rest_id: string;
  affiliates_highlighted_label: UnmentionData;
  avatar: Avatar;
  core: PurpleCore;
  dm_permissions: DmPermissions;
  has_graduated_access: boolean;
  is_blue_verified: boolean;
  legacy: PurpleLegacy;
  location: ResultLocation;
  media_permissions: MediaPermissions;
  parody_commentary_fan_label: ParodyCommentaryFanLabel;
  profile_image_shape: ProfileImageShape;
  professional?: Professional;
  privacy: Privacy;
  relationship_perspectives: RelationshipPerspectives;
  tipjar_settings: StickyTipjarSettings;
  verification: PurpleVerification;
  super_follow_eligible?: boolean;
}

export interface StickyTipjarSettings {
  is_enabled?: boolean;
  patreon_handle?: string;
  cash_app_handle?: string;
}

export interface TweetLegacy {
  bookmark_count: number;
  bookmarked: boolean;
  created_at: string;
  conversation_control: ConversationControl;
  conversation_id_str: string;
  display_text_range: number[];
  entities: Entit;
  extended_entities?: TentacledExtendedEntities;
  favorite_count: number;
  favorited: boolean;
  full_text: string;
  is_quote_status: boolean;
  lang: Lang;
  possibly_sensitive?: boolean;
  possibly_sensitive_editable?: boolean;
  quote_count: number;
  reply_count: number;
  retweet_count: number;
  retweeted: boolean;
  user_id_str: string;
  id_str: string;
  quoted_status_id_str?: string;
  quoted_status_permalink?: QuotedStatusPermalink;
  scopes?: Scopes;
}

export interface ConversationControl {
  policy: Policy;
  conversation_owner_results: ConversationOwnerResults;
}

export interface ConversationOwnerResults {
  result: ConversationOwnerResultsResult;
}

export interface ConversationOwnerResultsResult {
  __typename: FluffyTypename;
  core: TentacledCore;
}

export interface TentacledCore {
  screen_name: string;
}

export enum Policy {
  ByInvitation = "ByInvitation",
  Community = "Community",
  Subscribers = "Subscribers",
  Verified = "Verified",
}

export interface TentacledExtendedEntities {
  media: TentacledMedia[];
}

export interface TentacledMedia {
  display_url: string;
  expanded_url: string;
  id_str: string;
  indices: number[];
  media_key: string;
  media_url_https: string;
  type: MediaType;
  url: string;
  ext_media_availability: EXTMediaAvailability;
  features?: Features;
  sizes: Sizes;
  original_info: OriginalInfo;
  allow_download_status?: AllowDownloadStatus;
  media_results: MediaResults;
  additional_media_info?: StickyAdditionalMediaInfo;
  video_info?: VideoInfo;
  ext_alt_text?: string;
  source_status_id_str?: string;
  source_user_id_str?: string;
}

export interface StickyAdditionalMediaInfo {
  monetizable: boolean;
  source_user?: StickySourceUser;
}

export interface StickySourceUser {
  user_results: IndecentUserResults;
}

export interface IndecentUserResults {
  result: BraggadociousResult;
}

export interface BraggadociousResult {
  __typename: FluffyTypename;
  id: string;
  rest_id: string;
  affiliates_highlighted_label: UnmentionData;
  avatar: Avatar;
  core: PurpleCore;
  dm_permissions: DmPermissions;
  has_graduated_access: boolean;
  is_blue_verified: boolean;
  legacy: AmbitiousLegacy;
  location: ResultLocation;
  media_permissions: MediaPermissions;
  parody_commentary_fan_label: ParodyCommentaryFanLabel;
  profile_image_shape: ProfileImageShape;
  privacy: Privacy;
  relationship_perspectives: RelationshipPerspectives;
  tipjar_settings: UnmentionData;
  verification: PurpleVerification;
}

export interface AmbitiousLegacy {
  default_profile: boolean;
  default_profile_image: boolean;
  description: string;
  entities: FluffyEntities;
  fast_followers_count: number;
  favourites_count: number;
  followers_count: number;
  friends_count: number;
  has_custom_timelines: boolean;
  is_translator: boolean;
  listed_count: number;
  media_count: number;
  normal_followers_count: number;
  pinned_tweet_ids_str: string[];
  possibly_sensitive: boolean;
  profile_banner_url: string;
  profile_interstitial_type: string;
  statuses_count: number;
  translator_type: TranslatorType;
  want_retweets: boolean;
  withheld_in_countries: any[];
}

export interface FluffyEntities {
  description: DescriptionClass;
}

export interface TweetQuotedStatusResult {
  result: Result1;
}

export interface Result1 {
  __typename: TweetDisplayType;
  rest_id: string;
  core: StickyCore;
  unmention_data: UnmentionData;
  edit_control: EditControl;
  previous_counts?: PreviousCounts;
  is_translatable: boolean;
  views: Views;
  source: string;
  note_tweet?: PurpleNoteTweet;
  grok_analysis_button: boolean;
  legacy: CunningLegacy;
  post_video_description?: string;
}

export interface StickyCore {
  user_results: HilariousUserResults;
}

export interface HilariousUserResults {
  result: Result2;
}

export interface Result2 {
  __typename: FluffyTypename;
  id: string;
  rest_id: string;
  affiliates_highlighted_label: UnmentionData;
  avatar: Avatar;
  core: PurpleCore;
  dm_permissions: DmPermissions;
  has_graduated_access: boolean;
  is_blue_verified: boolean;
  legacy: PurpleLegacy;
  location: ResultLocation;
  media_permissions: MediaPermissions;
  parody_commentary_fan_label: ParodyCommentaryFanLabel;
  profile_image_shape: ProfileImageShape;
  professional?: Professional;
  privacy: Privacy;
  relationship_perspectives: RelationshipPerspectives;
  tipjar_settings: IndigoTipjarSettings;
  verification: FluffyVerification;
  super_follow_eligible?: boolean;
}

export interface IndigoTipjarSettings {
  is_enabled?: boolean;
  bitcoin_handle?: string;
  patreon_handle?: string;
}

export interface CunningLegacy {
  bookmark_count: number;
  bookmarked: boolean;
  created_at: string;
  conversation_id_str: string;
  display_text_range: number[];
  entities: Entit;
  favorite_count: number;
  favorited: boolean;
  full_text: string;
  is_quote_status: boolean;
  lang: Lang;
  quote_count: number;
  reply_count: number;
  retweet_count: number;
  retweeted: boolean;
  user_id_str: string;
  id_str: string;
  extended_entities?: StickyExtendedEntities;
  possibly_sensitive?: boolean;
  possibly_sensitive_editable?: boolean;
}

export interface StickyExtendedEntities {
  media: StickyMedia[];
}

export interface StickyMedia {
  display_url: string;
  expanded_url: string;
  id_str: string;
  indices: number[];
  media_key: string;
  media_url_https: string;
  type: MediaType;
  url: string;
  ext_media_availability: EXTMediaAvailability;
  features?: Features;
  sizes: Sizes;
  original_info: OriginalInfo;
  allow_download_status?: AllowDownloadStatus;
  media_results: MediaResults;
  source_status_id_str?: string;
  source_user_id_str?: string;
  additional_media_info?: IndigoAdditionalMediaInfo;
  video_info?: VideoInfo;
}

export interface IndigoAdditionalMediaInfo {
  monetizable: boolean;
  source_user?: IndigoSourceUser;
}

export interface IndigoSourceUser {
  user_results: AmbitiousUserResults;
}

export interface AmbitiousUserResults {
  result: Result3;
}

export interface Result3 {
  __typename: FluffyTypename;
  id: string;
  rest_id: string;
  affiliates_highlighted_label: UnmentionData;
  avatar: Avatar;
  core: PurpleCore;
  dm_permissions: DmPermissions;
  has_graduated_access: boolean;
  is_blue_verified: boolean;
  legacy: TentacledLegacy;
  location: ResultLocation;
  media_permissions: MediaPermissions;
  parody_commentary_fan_label: ParodyCommentaryFanLabel;
  profile_image_shape: ProfileImageShape;
  professional: Professional;
  privacy: Privacy;
  relationship_perspectives: RelationshipPerspectives;
  tipjar_settings: IndecentTipjarSettings;
  verification: PurpleVerification;
}

export interface IndecentTipjarSettings {
  is_enabled: boolean;
}

export interface PurpleNoteTweet {
  is_expandable: boolean;
  note_tweet_results: FluffyNoteTweetResults;
}

export interface FluffyNoteTweetResults {
  result: Result4;
}

export interface Result4 {
  id: string;
  text: string;
  entity_set: Entit;
}

export enum InstructionType {
  TimelineAddEntries = "TimelineAddEntries",
}

export interface ResponseObjects {
  feedbackActions: any[];
  immediateReactions: any[];
}

export interface Error {
  message: string;
  locations: LocationElement[];
  path: Array<number | string>;
  extensions: Extensions;
  code: number;
  kind: string;
  name: string;
  source: string;
  tracing: Tracing;
}

export interface Extensions {
  name: string;
  source: string;
  code: number;
  kind: string;
  tracing: Tracing;
}

export interface Tracing {
  trace_id: TraceID;
}

export enum TraceID {
  The0F337193D894A1CF = "0f337193d894a1cf",
  The29709926Afb86780 = "29709926afb86780",
  The35A920B4Cdc18415 = "35a920b4cdc18415",
}

export interface LocationElement {
  line: number;
  column: number;
}
