import { type CreateCreator, CreatorSchemas } from "@workspace/contracts/creator";
import type { CreateDownloadTask } from "@workspace/contracts/download-task";
import type { Platform } from "@workspace/contracts/platform";
import { type CreatePost, PostSchemas } from "@workspace/contracts/post";
import type { Tiktok } from "@workspace/contracts/raw/tiktok";
import { type CreateTiktokPost, TiktokSchemas } from "@workspace/contracts/tiktok";
import z from "zod";
import type { PlatformHandler, PostImportEntities } from "@/core/platform";
import { postParser } from "./parser/post";

export class TiktokHandler implements PlatformHandler<CreateTiktokPost> {
  platform: Platform = "tiktok";

  _process(data: string) {
    const jsonData = JSON.parse(data) as Tiktok[];

    const parsedPosts = jsonData.flatMap((page) =>
      (page.itemList ?? []).map((item) => postParser(item)),
    );

    const valid: CreateTiktokPost[] = [];
    const invalid: CreateTiktokPost[] = [];

    for (const post of parsedPosts) {
      const result = TiktokSchemas.post.safeParse(post);
      if (result.success) valid.push(post);
      else {
        const pretty = z.prettifyError(result.error);
        console.error(pretty);
        invalid.push(post);
      }
    }

    return { valid: valid, invalid: invalid.length };
  }

  validate(data: string): { valid: number; invalid: number } {
    const { valid, invalid } = this._process(data);
    return { valid: valid.length, invalid };
  }

  parse(data: string): CreateTiktokPost[] {
    const { valid } = this._process(data);
    return valid;
  }

  map(data: CreateTiktokPost[]): PostImportEntities {
    const creators = this.mapCreator(data);
    const posts = this.mapPost(data);
    const mediaDownloadTasks = this.mapMedia(data, creators);

    return {
      creators: creators,
      posts: posts,
      postTaggedCreators: [],
      media: mediaDownloadTasks,
    };
  }

  mapMedia(posts: CreateTiktokPost[], creators: CreateCreator[]): CreateDownloadTask[] {
    const mediaDownloadTasks: CreateDownloadTask[] = [];

    for (const creator of creators) {
      if (!creator.avatar) continue;
      mediaDownloadTasks.push({
        url: creator.avatar,
        platform: "tiktok",
        type: "image",
        externalId: creator.externalId,
        referenceType: "creator",
        key: `tiktok/avatar/${creator.externalId}.jpg`,
      });
    }

    for (const post of posts) {
      post.media.forEach((mediaItem, i) => {
        const commonProps = {
          platform: "tiktok",
          externalId: post.externalId,
          referenceType: "post",
          height: mediaItem.height,
          width: mediaItem.width,
        } as const;

        if (mediaItem.mediaType === "image") {
          mediaDownloadTasks.push({
            ...commonProps,
            url: mediaItem.url,
            type: "image",
            key: `tiktok/post/${post.externalId}-${i}.jpg`,
          });
        }

        if (mediaItem.mediaType === "video") {
          mediaDownloadTasks.push({
            ...commonProps,
            url: mediaItem.url,
            type: "video",
            duration: mediaItem.duration,
            key: `tiktok/post/${post.externalId}-${i}.mp4`,
          });

          // Push video thumbnail as image
          mediaDownloadTasks.push({
            ...commonProps,
            url: mediaItem.thumbnail,
            type: "image",
            key: `tiktok/post/${post.externalId}-${i}.jpg`,
          });
        }
      });
    }

    return mediaDownloadTasks;
  }

  mapPost(data: CreateTiktokPost[]): CreatePost[] {
    const posts: CreatePost[] = data.map((post) => {
      const { creator, createdAt, ...rest } = post;

      return {
        ...rest,
        platform: "tiktok",
        createdAt: createdAt ? new Date(createdAt) : new Date(),
        externalCreator: creator.externalId,
        metadata: {
          ...rest,
        },
      };
    });

    const validPosts = PostSchemas.create.array().safeParse(posts);
    if (!validPosts.success) {
      console.error("Invalid posts:", validPosts.error);
      throw new Error("Failed to map TikTok posts due to validation errors.");
    }

    return validPosts.data;
  }

  mapCreator(data: CreateTiktokPost[]): CreateCreator[] {
    const creators: CreateCreator[] = data.map((post) => {
      const { createdAt, ...rest } = post.creator;

      return {
        ...rest,
        platform: "tiktok",
        createdAt: createdAt ? new Date(createdAt) : new Date(),
        metadata: {
          ...rest,
        },
      };
    });

    const validCreators = CreatorSchemas.create.array().safeParse(creators);
    if (!validCreators.success) {
      console.error("Invalid creators:", validCreators.error);
      throw new Error("Failed to map TikTok creators due to validation errors.");
    }

    return validCreators.data;
  }
}

// const cookie =
//   "_ttp=31QP5BJ252XeXxfx9n8ucFumcAC; ttwid=1%7CU9eIxHrVr_QK5mx7boex8W5khLp4mM2vbrLtG6Eivps%7C1746206593%7C7272b636e819b12fddb15f964a3e0c609ce2e505a062b0d0a423d153c60513ad; tt_chain_token=MuA7b15ftRxwWLz0Nk1gxA==; delay_guest_mode_vid=8; cookie-consent={%22optional%22:true%2C%22ga%22:true%2C%22af%22:true%2C%22fbp%22:true%2C%22lip%22:true%2C%22bing%22:true%2C%22ttads%22:true%2C%22reddit%22:true%2C%22hubspot%22:true%2C%22version%22:%22v10%22}; uid_tt=cfbc575c29f5fbba056186a3ae8a7152e76e10bfca968af342a10e6fbb9e872c; uid_tt_ss=cfbc575c29f5fbba056186a3ae8a7152e76e10bfca968af342a10e6fbb9e872c; sid_tt=bb887af9002706bc1c5ec39dc45a0e6a; sessionid=bb887af9002706bc1c5ec39dc45a0e6a; sessionid_ss=bb887af9002706bc1c5ec39dc45a0e6a; store-idc=alisg; store-country-code=tr; store-country-code-src=uid; tt-target-idc=alisg; tt-target-idc-sign=Xh8q9AhRvjfoi0Q8Z83tMXPohHiWvaHrQ1ughQzRbnR0rO6RtybRkbuyWvZ34LSe-gK_sfZQQQ31FoJnFczNExrkLFzTM1iqljyBuPG25iXaVwG9whBgwUCE6v46wlgVwUMWzmzMFdYSP-Hi4lBNAnjBVJglbEY6cC4YeWdLxd-dzl4ZxJppFmfwwn4xBG3MkMlvKLshZSndb8LJMefPZ6iAWa6jpDsZJzXzG1WrUgdeqenpiKTIsU2sMrOQZqQTHd4zHe4mmgCreTGgCzABi_dkHQpy9qVr70rezeIiI-xEUOIjHUitB18l0l3VTTuZmTTFMeWB694tmtfEjo_IZbzVVu5ScqVSgRZNpiBle92Uoo28bGxm7PvO101O-NPlyQMzSn1476-rroayT4km0uGJbCHjpP6Mmofum6IlqytB1FnGscoB8IyyqsWCWwYFjyNwF06-OQLboLscclHaqKcwEG8GJnFaftOIs2_xlUNE3l6sW5WKyt6lICDBI2Yp; tiktok_webapp_theme=dark; sid_guard=bb887af9002706bc1c5ec39dc45a0e6a%7C1755369082%7C15552000%7CThu%2C+12-Feb-2026+18%3A31%3A22+GMT; sid_ucp_v1=1.0.0-KGVjNTk3OWUwYzZmZjIyMjBjNjcwMDViNTU1YjU5NmMwOTQzZDM1YmUKGQiGgL6CsJib8FoQ-pyDxQYYsws4CEASSAQQAxoCbXkiIGJiODg3YWY5MDAyNzA2YmMxYzVlYzM5ZGM0NWEwZTZh; ssid_ucp_v1=1.0.0-KGVjNTk3OWUwYzZmZjIyMjBjNjcwMDViNTU1YjU5NmMwOTQzZDM1YmUKGQiGgL6CsJib8FoQ-pyDxQYYsws4CEASSAQQAxoCbXkiIGJiODg3YWY5MDAyNzA2YmMxYzVlYzM5ZGM0NWEwZTZh; _ttp=31QP5BJ252XeXxfx9n8ucFumcAC; tiktok_webapp_theme_source=auto; tt_csrf_token=8PyTpNEL-fjOZjhac-fRV5lA-4gaDsVJnfu0; passport_fe_beating_status=true; perf_feed_cache={%22expireTimestamp%22:1758470400000%2C%22itemIds%22:[%227547399754225831175%22%2C%227551777095249038610%22%2C%227548964302397426962%22]}; store-country-sign=MEIEDArVKQj_A_e4FRHykwQgfYauu-DX8RumWkOK8W4TYbkEDwkWUEmuRsKu-wWfPt8EEDlRlJadBVcPRJqMUv8LQwg; odin_tt=f9af5057eb62b492c0ec62f8397da11104003295058108e9868d6d45c18ea8a4abcf999b3a2bafcdf4ea351c88f965fcfe81459388cb2055e4a0bdc74fbcbfdf5808a82f6b5d22199027908c0df06ceb; msToken=Xd8St7UTqMx90OhrYFQQf0MY6vfmpcV1hIvK-Fkzp-GBGCvkbpro4ZwD7b7R3vgo4pxTuGy45-uNG_dhXPM0yegDGBVnWCqVaidvzLSH0EH4I6s5s_S9X3v8noibEBT1SS3HKloBwdU_V8f4Py1PqeATNw==; msToken=1CNo0yJRLKknVmCYLsruqB2UXLHH9Z2gEnOZC09ZbA7LTebMMPZzeJ0JkanAex_kiEojGESQIv9_Dzqk2N6WP8irEh5sCWnoTD7COTwDIAIFRU6qOu-p_A_WMmzOOVVM46Cv9_Q1U9U1Iw661P4Tm7WScA==";
