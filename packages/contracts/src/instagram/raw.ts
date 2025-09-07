/** biome-ignore-all lint/suspicious/noExplicitAny: this is a generated file */

export interface Instagram {
  num_results: number;
  more_available: boolean;
  items: Item[];
  auto_load_more_enabled: boolean;
  next_max_id: string;
  status: InstagramStatus;
}

export interface Item {
  media: Media;
}

export interface Media {
  pk: string;
  id: string;
  fbid: string;
  device_timestamp: number | string;
  caption_is_edited: boolean;
  strong_id__: string;
  deleted_reason: number;
  has_shared_to_fb: number;
  has_delayed_metadata: boolean;
  mezql_token: string;
  share_count_disabled: boolean;
  should_request_ads: boolean;
  is_reshare_of_text_post_app_media_in_ig: boolean;
  integrity_review_decision: IntegrityReviewDecision;
  client_cache_key: string;
  is_visual_reply_commenter_notice_enabled: boolean;
  like_and_view_counts_disabled: boolean;
  is_post_live_clips_media: boolean;
  is_quiet_post: boolean;
  comment_threading_enabled: boolean;
  is_unified_video: boolean;
  commerciality_status: CommercialityStatus;
  has_privately_liked: boolean;
  filter_type: number;
  taken_at: number;
  can_see_insights_as_brand: boolean;
  media_type: number;
  code: string;
  caption: Caption | null;
  sharing_friction_info: SharingFrictionInfo;
  timeline_pinned_user_ids: number[];
  play_count?: number;
  has_views_fetching: boolean;
  ig_play_count?: number;
  creator_viewer_insights?: any[];
  fb_user_tags: Tags;
  coauthor_producers: CoauthorProducer[];
  coauthor_producer_can_see_organic_insights: boolean;
  invited_coauthor_producers: any[];
  is_in_profile_grid: boolean;
  profile_grid_control_enabled: boolean;
  media_cropping_info?: MediaCroppingInfo;
  user: Owner;
  owner: Owner;
  image_versions2: MediaImageVersions2;
  original_width: number;
  original_height: number;
  is_artist_pick?: boolean;
  media_notes?: MediaNotes;
  media_reposter_bottomsheet_enabled?: boolean;
  enable_media_notes_production: boolean;
  product_type: MediaProductType;
  is_paid_partnership: boolean;
  music_metadata: MusicMetadata | null;
  organic_tracking_token: string;
  is_third_party_downloads_eligible?: boolean;
  ig_media_sharing_disabled: boolean;
  are_remixes_crosspostable?: boolean;
  crosspost_metadata: CrosspostMetadata;
  boost_unavailable_identifier: null;
  boost_unavailable_reason: null;
  boost_unavailable_reason_v2: null;
  subscribe_cta_visible: boolean;
  creative_config?: CreativeConfig;
  is_cutout_sticker_allowed: boolean;
  cutout_sticker_info: any[];
  gen_ai_detection_method: GenAIDetectionMethod;
  fb_aggregated_like_count: number;
  fb_aggregated_comment_count: number;
  has_high_risk_gen_ai_inform_treatment: boolean;
  open_carousel_show_follow_button: boolean;
  is_tagged_media_shared_to_viewer_profile_grid: boolean;
  should_show_author_pog_for_tagged_media_shared_to_profile_grid: boolean;
  is_eligible_for_media_note_recs_nux: boolean;
  is_social_ufi_disabled: boolean;
  is_eligible_for_meta_ai_share: boolean;
  meta_ai_suggested_prompts: any[];
  can_reply: boolean;
  floating_context_items: any[];
  is_eligible_content_for_post_roll_ad: boolean;
  meta_ai_content_deep_dive_prompt_v2?: MetaAIContentDeepDivePromptV2;
  is_open_to_public_submission: boolean;
  preview_comments?: any[];
  hide_view_all_comment_entrypoint: boolean;
  inline_composer_display_condition?: InlineComposerDisplayCondition;
  is_comments_gif_composer_enabled: boolean;
  comment_inform_treatment: CommentInformTreatment;
  has_liked: boolean;
  like_count: number;
  video_subtitles_confidence?: number;
  video_subtitles_locale?: VideoSubtitlesLocale;
  video_sticker_locales: string[];
  is_dash_eligible?: number;
  video_dash_manifest?: string;
  number_of_qualities?: number;
  video_versions?: VideoVersion[];
  video_duration?: number;
  has_audio?: boolean;
  clips_tab_pinned_user_ids: number[];
  clips_metadata?: ClipsMetadata;
  has_viewer_saved: boolean;
  saved_collection_ids: string[];
  can_viewer_save: boolean;
  can_viewer_reshare: boolean;
  shop_routing_user_id: null | string;
  is_organic_product_tagging_eligible: boolean;
  igbio_product: null;
  featured_products: any[];
  product_suggestions: any[];
  is_reuse_allowed: boolean;
  has_more_comments?: boolean;
  max_num_visible_preview_comments: number;
  explore_hide_comments: boolean;
  location?: Location;
  lng?: number;
  lat?: number;
  commerce_integrity_review_decision?: CommerceIntegrityReviewDecision;
  usertags?: Tags;
  photo_of_you?: boolean;
  video_subtitles_uri?: string;
  fb_play_count?: number;
  fb_like_count?: number;
  media_level_comment_controls?: MediaLevelCommentControls;
  commenting_disabled_for_viewer?: boolean;
  comment_count?: number;
  comments_disabled?: boolean;
  clips_mashup_follow_button_info?: ClipsMashupFollowButtonInfo;
  visual_replies_info?: VisualRepliesInfo;
  accessibility_caption?: string;
  original_media_has_visual_reply_media?: boolean;
  can_modify_carousel?: boolean;
  open_carousel_submission_state?: OpenCarouselSubmissionState;
  carousel_media_count?: number;
  carousel_media?: CarouselMedia[];
  carousel_media_pending_post_count?: number;
  carousel_media_ids?: string[];
  collab_follow_button_info?: CollabFollowButtonInfo;
  should_open_collab_bottomsheet_on_facepile_tap?: boolean;
  clips_text?: any[];
  dominant_color?: string;
  product_tags?: Tags;
  is_post_live?: boolean;
  view_count?: number;
  mashup_info?: MashupInfo;
  title?: string;
  nearly_complete_copyright_match?: boolean;
  igtv_exists_in_viewer_series?: boolean;
  thumbnails?: Thumbnails;
  likers?: CoauthorProducer[];
  channel_tag_data?: ChannelTagData;
  clips_attribution_info?: ClipsAttributionInfo;
  carousel_last_edited_at?: number;
  mv_link?: string;
  shimmed_mv_link?: string;
  preview?: string;
  media_overlay_info?: MediaOverlayInfo;
  sponsor_tags?: SponsorTag[];
}

export interface Caption {
  bit_flags: number;
  created_at: number;
  created_at_utc: number;
  did_report_as_spam: boolean;
  is_ranked_comment: boolean;
  pk: string;
  share_enabled: boolean;
  content_type: ContentType;
  media_id: string;
  status: CaptionStatus;
  type: number;
  user_id: string;
  strong_id__: string;
  has_translation?: boolean;
  text: string;
  user: CoauthorProducer;
  is_covered: boolean;
  private_reply_status: number;
  text_translation?: string;
  fb_mentioned_users?: any[];
}

export enum ContentType {
  Comment = "comment",
}

export enum CaptionStatus {
  Active = "Active",
}

export interface CoauthorProducer {
  pk: string;
  pk_id: string;
  id: string;
  username: string;
  full_name: string;
  is_private: boolean;
  is_unpublished?: boolean;
  strong_id__: string;
  fbid_v2?: string;
  is_verified: boolean;
  profile_pic_id?: string;
  profile_pic_url: string;
  friendship_status?: { [key: string]: boolean };
  follower_count?: number;
}

export interface CarouselMedia {
  id: string;
  explore_pivot_grid: boolean;
  carousel_parent_id: string;
  strong_id__: string;
  pk: string;
  commerciality_status: CommercialityStatus;
  product_type: CarouselMediaProductType;
  media_type: number;
  accessibility_caption?: string;
  image_versions2: CarouselMediaImageVersions2;
  original_width: number;
  original_height: number;
  preview?: string;
  featured_products: any[];
  fb_user_tags: Tags;
  shop_routing_user_id: null;
  sharing_friction_info: SharingFrictionInfo;
  taken_at: number;
  product_suggestions: any[];
  video_sticker_locales: any[];
  usertags?: Tags;
  video_versions?: VideoVersion[];
  video_duration?: number;
  has_audio?: boolean;
  is_dash_eligible?: number;
  video_dash_manifest?: string;
  number_of_qualities?: number;
}

export enum CommercialityStatus {
  NotCommercial = "not_commercial",
}

export interface Tags {
  in: In[];
}

export interface In {
  position?: number[];
  user?: CoauthorProducer;
  product?: Product;
  is_removable?: boolean;
  destination?: number;
}

export interface Product {
  name: string;
  price: string;
  current_price: string;
  full_price: string;
  product_id: string;
  compound_product_id: string;
  full_price_stripped: string;
  current_price_stripped: string;
  full_price_amount: string;
  current_price_amount: string;
  retailer_id: string;
  has_viewer_saved: boolean;
  main_image: Image;
  main_image_id: string;
  thumbnail_image: Image;
  review_status: CommerceIntegrityReviewDecision;
  external_url: string;
  checkout_style: string;
  merchant: Merchant;
  description: string;
  has_variants: boolean;
  can_share_to_story: boolean;
}

export interface Image {
  image_versions2: MainImageImageVersions2;
  preview: string;
}

export interface MainImageImageVersions2 {
  candidates: HDProfilePicURLInfo[];
}

export interface HDProfilePicURLInfo {
  width: number;
  height: number;
  url: string;
}

export interface Merchant {
  pk: number;
  username: string;
  id: string;
  strong_id__: string;
  is_verified: boolean;
  profile_pic_url: string;
}

export enum CommerceIntegrityReviewDecision {
  Approved = "approved",
  Empty = "",
}

export interface CarouselMediaImageVersions2 {
  candidates: HDProfilePicURLInfo[];
  scrubber_spritesheet_info_candidates?: ScrubberSpritesheetInfoCandidates;
}

export interface ScrubberSpritesheetInfoCandidates {
  default: Thumbnails;
}

export interface Thumbnails {
  video_length: number;
  thumbnail_width: number;
  thumbnail_height: number;
  thumbnail_duration: number;
  sprite_urls: string[];
  thumbnails_per_row: number;
  total_thumbnail_num_per_sprite: number;
  max_thumbnails_per_sprite: number;
  sprite_width: number;
  sprite_height: number;
  rendered_width: number;
  file_size_kb: number;
}

export enum CarouselMediaProductType {
  CarouselItem = "carousel_item",
}

export interface SharingFrictionInfo {
  bloks_app_url: null | string;
  should_have_sharing_friction: boolean;
  sharing_friction_payload: null | string;
}

export interface VideoVersion {
  bandwidth: number;
  height: number;
  id: string;
  type: number;
  url: string;
  width: number;
}

export interface ChannelTagData {
  title: string;
  thread_igid: string;
  subtitle: string;
  invite_link: string;
  is_member: boolean;
  group_image_uri: string;
  group_image_background_uri: string;
  thread_subtype: number;
  creator_broadcast_chat_thread_preview_response: CreatorBroadcastChatThreadPreviewResponse;
  number_of_members: number;
  creator_igid: null;
  is_creator_verified: boolean;
  should_badge_channel: null;
  creator_username: string;
  social_context_username: null;
  social_channel_invite_id: null;
}

export interface CreatorBroadcastChatThreadPreviewResponse {
  is_added_to_inbox: boolean;
  audience_type: number;
  is_subscriber: null;
  is_follower: null;
  is_collaborator: null;
  is_invited_collaborator: null;
}

export interface ClipsAttributionInfo {
  attribution_app_id: string;
  attribution_app_name: string;
  pivot_page_header: PivotPageHeader;
}

export interface PivotPageHeader {
  content_url: string;
  developer_app_logo_url: string;
  media_count: string;
  profile: CoauthorProducer;
}

export interface ClipsMashupFollowButtonInfo {
  show_follow_bottom_sheet_button: boolean;
  is_original_author_in_author_exp: boolean;
}

export interface ClipsMetadata {
  breaking_content_info: null;
  breaking_creator_info: null;
  clips_creation_entry_point: ClipsCreationEntryPoint;
  featured_label: null;
  is_public_chat_welcome_video: boolean;
  is_shared_to_fb: boolean;
  professional_clips_upsell_type: number;
  reels_on_the_rise_info: null;
  show_tips: null;
  achievements_info: AchievementsInfo;
  additional_audio_info: AdditionalAudioInfo;
  asset_recommendation_info: null;
  audio_ranking_info: AudioRankingInfo | null;
  audio_type: AudioType | null;
  branded_content_tag_info: BrandedContentTagInfo;
  challenge_info: null;
  content_appreciation_info: ContentAppreciationInfo;
  contextual_highlight_info: null;
  cutout_sticker_info: any[];
  disable_use_in_clips_client_cache: boolean;
  external_media_info: null;
  is_fan_club_promo_video: boolean;
  mashup_info: MashupInfo;
  merchandising_pill_info: null;
  music_canonical_id: string;
  music_info: MusicInfo | null;
  nux_info: null;
  original_sound_info: OriginalSoundInfo | null;
  originality_info: null;
  reusable_text_attribute_string: null | string;
  reusable_text_info: ReusableTextInfo[] | null;
  shopping_info: null;
  show_achievements: boolean;
  template_info: null;
  viewer_interaction_settings: null;
}

export interface AchievementsInfo {
  num_earned_achievements: null;
  show_achievements: boolean;
}

export interface AdditionalAudioInfo {
  additional_audio_username: null;
  audio_reattribution_info: AudioReattributionInfo;
}

export interface AudioReattributionInfo {
  should_allow_restore: boolean;
}

export interface AudioRankingInfo {
  best_audio_cluster_id?: string;
}

export enum AudioType {
  LicensedMusic = "licensed_music",
  OriginalSounds = "original_sounds",
}

export interface BrandedContentTagInfo {
  can_add_tag: boolean;
}

export enum ClipsCreationEntryPoint {
  Clips = "clips",
  Empty = "",
  Feed = "feed",
}

export interface ContentAppreciationInfo {
  enabled: boolean;
  entry_point_container: EntryPointContainer | null;
}

export interface EntryPointContainer {
  pill: Pill;
  comment: Comment;
  overflow: null;
  ufi: null;
}

export interface Comment {
  action_type: ActionType;
}

export enum ActionType {
  Gifting = "gifting",
}

export interface Pill {
  action_type: ActionType;
  priority: number;
}

export interface MashupInfo {
  can_toggle_mashups_allowed: boolean;
  formatted_mashups_count: null;
  has_been_mashed_up: boolean;
  has_nonmimicable_additional_audio: boolean;
  is_creator_requesting_mashup: boolean;
  is_light_weight_check: boolean;
  is_light_weight_reuse_allowed_check: boolean;
  is_pivot_page_available: boolean;
  is_reuse_allowed: boolean;
  mashup_type: MashupType | null;
  mashups_allowed: boolean;
  non_privacy_filtered_mashups_media_count: number;
  privacy_filtered_mashups_media_count: null;
  original_media: MashupInfoOriginalMedia | null;
}

export enum MashupType {
  GreenScreen = "green_screen",
  RemixComposition = "remix_composition",
}

export interface MashupInfoOriginalMedia {
  is_light_weight_check: boolean;
  media_type: MediaType;
  pk: string;
  product_type: ClipsCreationEntryPoint;
  is_pivot_page_available: boolean;
  mashups_allowed: boolean;
  non_privacy_filtered_mashups_media_count: number;
  user: User;
}

export enum MediaType {
  Video = "VIDEO",
}

export interface User {
  fbid_v2: string;
  third_party_downloads_enabled: number;
  pk: string;
  pk_id: string;
  id: string;
  username: string;
  full_name: string;
  is_private: boolean;
  strong_id__: string;
  has_anonymous_profile_picture: boolean;
  media_count: number;
  following_count: number;
  account_badges: any[];
  is_verified: boolean;
  profile_pic_id: string;
  profile_pic_url: string;
}

export interface MusicInfo {
  music_canonical_id: null;
  music_asset_info: MusicAssetInfo;
  music_consumption_info: MusicConsumptionInfo;
}

export interface MusicAssetInfo {
  allows_saving: boolean;
  artist_id: null | string;
  audio_asset_id: string;
  audio_cluster_id: string;
  cover_artwork_thumbnail_uri: string;
  cover_artwork_uri: string;
  dark_message: null;
  dash_manifest: null;
  display_artist: string;
  duration_in_ms: number;
  fast_start_progressive_download_url: string;
  has_lyrics: boolean;
  highlight_start_times_in_ms: number[];
  id: string;
  ig_username: null | string;
  is_eligible_for_audio_effects: boolean;
  is_eligible_for_vinyl_sticker: boolean;
  is_explicit: boolean;
  licensed_music_subtype: LicensedMusicSubtype;
  progressive_download_url: string;
  reactive_audio_download_url: null;
  sanitized_title: null;
  subtitle: Subtitle;
  title: string;
  web_30s_preview_download_url: null | string;
  lyrics: null;
}

export enum LicensedMusicSubtype {
  Default = "DEFAULT",
}

export enum Subtitle {
  Empty = "",
  Instrumental = "Instrumental",
  Remix = "Remix",
  RighteousRemix = "Righteous Remix",
  SlowedDown = "Slowed Down",
  SlowedReverb = "SLOWED + REVERB",
  SuperSlowed = "super slowed",
}

export interface MusicConsumptionInfo {
  allow_media_creation_with_music: boolean;
  audio_asset_start_time_in_ms: number;
  contains_lyrics: null;
  derived_content_id: null;
  display_labels: null;
  formatted_clips_media_count: null;
  ig_artist: CoauthorProducer | null;
  is_bookmarked: boolean;
  is_trending_in_clips: boolean;
  overlap_duration_in_ms: number;
  placeholder_profile_pic_url: string;
  should_allow_music_editing: boolean;
  should_mute_audio: boolean;
  should_mute_audio_reason: ShouldMuteAudioReason;
  should_mute_audio_reason_type: MuteReason | null;
  should_render_soundwave: boolean;
  trend_rank: null;
  previous_trend_rank: null;
  audio_filter_infos: any[];
  audio_muting_info: AudioMutingInfo;
}

export interface AudioMutingInfo {
  mute_audio: boolean;
  mute_reason_str: ShouldMuteAudioReason;
  allow_audio_editing: boolean;
  show_muted_audio_toast: boolean;
  mute_reason?: MuteReason;
}

export enum MuteReason {
  SongNotAvailable = "song_not_available",
}

export enum ShouldMuteAudioReason {
  Empty = "",
  ThisSongIsCurrentlyUnavailable = "This song is currently unavailable.",
}

export interface OriginalSoundInfo {
  allow_creator_to_rename: boolean;
  audio_asset_id: string;
  attributed_custom_audio_asset_id: null;
  can_remix_be_shared_to_fb: boolean;
  can_remix_be_shared_to_fb_expansion: boolean;
  dash_manifest: string;
  duration_in_ms: number;
  formatted_clips_media_count: null;
  hide_remixing: boolean;
  ig_artist: CoauthorProducer;
  is_audio_automatically_attributed: boolean;
  is_eligible_for_audio_effects: boolean;
  is_eligible_for_vinyl_sticker: boolean;
  is_explicit: boolean;
  is_original_audio_download_eligible: boolean;
  is_reuse_disabled: boolean;
  is_xpost_from_fb: boolean;
  music_canonical_id: null;
  oa_owner_is_music_artist: boolean;
  original_audio_subtype: OriginalAudioSubtype;
  original_audio_title: string;
  original_media_id: string;
  progressive_download_url: string;
  should_mute_audio: boolean;
  time_created: number;
  trend_rank: null;
  previous_trend_rank: null;
  overlap_duration_in_ms: null;
  audio_asset_start_time_in_ms: null;
  audio_filter_infos: any[];
  audio_parts: any[];
  audio_parts_by_filter: any[];
  consumption_info: ConsumptionInfo;
  xpost_fb_creator_info: null;
  fb_downstream_use_xpost_metadata: FbDownstreamUseXpostMetadata;
}

export interface ConsumptionInfo {
  display_media_id: null;
  is_bookmarked: boolean;
  is_trending_in_clips: boolean;
  should_mute_audio_reason: string;
  should_mute_audio_reason_type: null;
}

export interface FbDownstreamUseXpostMetadata {
  downstream_use_xpost_deny_reason: DetectionMethod;
}

export enum DetectionMethod {
  C2PaMetadataEdited = "C2PA_METADATA_EDITED",
  IptcMetadataEdited = "IPTC_METADATA_EDITED",
  None = "NONE",
  SelfDisclosureFlow = "SELF_DISCLOSURE_FLOW",
}

export enum OriginalAudioSubtype {
  Default = "default",
  DefaultOutlines = "default_outlines",
  Disabled = "disabled",
  Inverted = "inverted",
  InvertedOutlines = "inverted_outlines",
}

export interface ReusableTextInfo {
  id: string;
  text: string;
  start_time_ms: number;
  end_time_ms: number;
  width: number;
  height: number;
  offset_x: number;
  offset_y: number;
  z_index: number;
  rotation_degree: number;
  scale: number;
  alignment: Alignment;
  colors: Color[];
  text_format_type: string;
  font_size: number;
  text_emphasis_mode: OriginalAudioSubtype;
  is_animated: number;
}

export enum Alignment {
  Center = "center",
  Left = "left",
  Right = "right",
}

export interface Color {
  count: number;
  hex_rgba_color: string;
}

export interface CollabFollowButtonInfo {
  show_follow_button: boolean;
  is_owner_in_author_exp: boolean;
}

export interface CommentInformTreatment {
  action_type: null;
  should_have_inform_treatment: boolean;
  text: string;
  url: null;
}

export interface CreativeConfig {
  capture_type: CaptureType;
  effect_ids?: number[];
  creation_tool_info: CreationToolInfo[];
  attribution_user: null;
  effect_preview: null;
  face_effect_id: null;
  effect_configs: null;
}

export enum CaptureType {
  ClipsV2 = "clips_v2",
}

export interface CreationToolInfo {
  camera_tool: number;
  duration_selector_seconds: number;
  speed_selector: number;
  color_filters: string;
  appearance_effect: number;
  timer_selector_seconds: number;
  magic_cut_start_time: number;
  magic_cut_end_time: number;
}

export interface CrosspostMetadata {
  fb_downstream_use_xpost_metadata: FbDownstreamUseXpostMetadata;
}

export interface GenAIDetectionMethod {
  detection_method: DetectionMethod;
}

export interface MediaImageVersions2 {
  candidates: HDProfilePicURLInfo[];
  additional_candidates?: AdditionalCandidates;
  scrubber_spritesheet_info_candidates?: ScrubberSpritesheetInfoCandidates;
}

export interface AdditionalCandidates {
  igtv_first_frame: HDProfilePicURLInfo;
  first_frame: HDProfilePicURLInfo;
  smart_frame: HDProfilePicURLInfo | null;
}

export enum InlineComposerDisplayCondition {
  ImpressionTrigger = "impression_trigger",
  Never = "never",
}

export enum IntegrityReviewDecision {
  Approved = "approved",
  Pending = "pending",
}

export interface Location {
  name: string;
  address: string;
  city: string;
  has_viewer_saved: boolean;
  pk: string;
  short_name: string;
  facebook_places_id: string;
  external_source: ExternalSource;
  lng?: number;
  lat?: number;
}

export enum ExternalSource {
  FacebookPlaces = "facebook_places",
}

export interface MediaCroppingInfo {
  four_by_three_crop?: ECrop;
  square_crop?: ECrop;
}

export interface ECrop {
  crop_left: number;
  crop_right: number;
  crop_top: number;
  crop_bottom: number;
}

export enum MediaLevelCommentControls {
  Any = "any",
  Follower = "follower",
  Following = "following",
  FollowingAndFollower = "following_and_follower",
  Unknown = "unknown",
}

export interface MediaNotes {
  items: any[];
}

export interface MediaOverlayInfo {
  overlay_type: string;
  overlay_layout: number;
  buttons: Button[];
  icon: Icon;
  title: string;
  description: string;
  sub_category: string;
  session_id: string;
}

export interface Button {
  action: number;
  action_url: null | string;
  button_type: number;
  has_chevron: boolean;
  headline_text: null;
  is_text_centered: boolean;
  secondary_text: null;
  text: string;
  icon: null;
  secondary_text_color: null;
  text_color: TextColor;
}

export interface TextColor {
  dark: string;
  light: string;
}

export interface Icon {
  icon_glyph: number;
  icon_type: number;
  name: string;
}

export interface MetaAIContentDeepDivePromptV2 {
  media_eligibility_result: MediaEligibilityResult;
}

export enum MediaEligibilityResult {
  IneligibleViewerCountry = "INELIGIBLE_VIEWER_COUNTRY",
}

export interface MusicMetadata {
  audio_type: AudioType | null;
  music_canonical_id: string;
  pinned_media_ids: any[] | null;
  music_info: MusicInfo | null;
  original_sound_info: null;
}

export enum OpenCarouselSubmissionState {
  Closed = "closed",
}

export interface Owner {
  fbid_v2: string;
  feed_post_reshare_disabled: boolean;
  full_name: string;
  id: string;
  is_private: boolean;
  is_unpublished: boolean;
  pk: string;
  pk_id: string;
  show_account_transparency_details: boolean;
  strong_id__: string;
  third_party_downloads_enabled: number;
  username: string;
  account_type: number;
  can_see_quiet_post_attribution: boolean;
  is_active_on_text_post_app: boolean;
  account_badges: any[];
  fan_club_info: FanClubInfo;
  friendship_status: FriendshipStatus;
  has_anonymous_profile_picture: boolean;
  hd_profile_pic_url_info: HDProfilePicURLInfo;
  hd_profile_pic_versions?: HDProfilePicURLInfo[];
  is_favorite: boolean;
  is_verified: boolean;
  profile_pic_id?: string;
  profile_pic_url: string;
  transparency_product_enabled: boolean;
  is_embeds_disabled: boolean;
  latest_reel_media: number;
}

export interface FanClubInfo {
  autosave_to_exclusive_highlight: boolean | null;
  connected_member_count: number | null;
  fan_club_id: null | string;
  fan_club_name: null | string;
  has_created_ssc: null;
  has_enough_subscribers_for_ssc: null;
  is_fan_club_gifting_eligible: boolean | null;
  is_fan_club_referral_eligible: boolean | null;
  is_free_trial_eligible: boolean | null;
  largest_public_bc_id: null;
  subscriber_count: number | null;
  fan_consideration_page_revamp_eligiblity: FanConsiderationPageRevampEligiblity | null;
}

export interface FanConsiderationPageRevampEligiblity {
  should_show_social_context: boolean;
  should_show_content_preview: boolean;
}

export interface FriendshipStatus {
  following: boolean;
  is_bestie: boolean;
  is_feed_favorite: boolean;
  is_restricted: boolean;
}

export enum MediaProductType {
  CarouselContainer = "carousel_container",
  Clips = "clips",
  Feed = "feed",
  Igtv = "igtv",
}

export interface SponsorTag {
  sponsor: CoauthorProducer;
  permission: boolean;
  sponsor_id: null;
  username: null;
  is_pending: boolean;
}

export enum VideoSubtitlesLocale {
  ArAR = "ar_AR",
  DeDE = "de_DE",
  EnUS = "en_US",
  EsCL = "es_CL",
  FrCA = "fr_CA",
  HiFB = "hi_FB",
  IDID = "id_ID",
  JaJP = "ja_JP",
  KoKR = "ko_KR",
  MyMM = "my_MM",
  PtBR = "pt_BR",
  RuRU = "ru_RU",
  SvSE = "sv_SE",
  ThTH = "th_TH",
  TrTR = "tr_TR",
  UrPK = "ur_PK",
  ViVN = "vi_VN",
  ZhCN = "zh_CN",
}

export interface VisualRepliesInfo {
  can_viewer_link_back_to_original_media_from_vcr: boolean;
  comment_info: CommentInfo;
  original_media: VisualRepliesInfoOriginalMedia;
}

export interface CommentInfo {
  comment_id: string;
  commenter_username: string;
}

export interface VisualRepliesInfoOriginalMedia {
  pk: string;
}

export enum InstagramStatus {
  Ok = "ok",
}
