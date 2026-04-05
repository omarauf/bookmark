import { type ItemImport, ItemSchemas } from "@workspace/contracts/item";
import type { Platform } from "@workspace/contracts/platform";
import type { ItemList, Tiktok } from "@workspace/contracts/raw/tiktok";
import type { PlatformHandler } from "@/core/platform";
import { jsonParse } from "@/utils/object";
import { relation } from "../common/relation";
import { toDownloadTasks } from "./download-job";
import { creatorParser } from "./parser/creator";
import { postParser } from "./parser/post";

export class TiktokHandler implements PlatformHandler {
  platform: Platform = "tiktok";

  validate(data: string): { valid: number; invalid: number } {
    const jsonData = jsonParse<Tiktok[]>(data) || [];

    let valid = 0;
    let invalid = 0;

    for (const post of jsonData) {
      for (const item of post.itemList ?? []) {
        const parsed = this._handler(item);
        if (parsed) valid++;
        else invalid++;
      }
    }

    return { valid, invalid };
  }

  handler(data: string): ItemImport {
    const jsonData = jsonParse<Tiktok[]>(data);

    if (jsonData === undefined) {
      return { items: [], relations: [], downloadTask: [] };
    }

    const results = jsonData
      .flatMap((post) => post.itemList ?? [])
      .map(this._handler)
      .filter(Boolean) as ItemImport[];

    return {
      items: results.flatMap((r) => r.items),
      relations: results.flatMap((r) => r.relations),
      downloadTask: results.flatMap((r) => r.downloadTask),
    };
  }

  private _handler(post: ItemList): ItemImport | undefined {
    if (!post) return undefined;

    const creator = creatorParser(post.author);
    const postItem = postParser(post);

    const downloadJob = toDownloadTasks(post);

    const createdRelations = relation(postItem, creator, "created_by");

    const items = [postItem, creator];
    const relations = createdRelations;

    const itemImportItemImport = { items, relations, downloadJob };

    const result = ItemSchemas.import.safeParse(itemImportItemImport);
    if (!result.success) {
      console.warn("Invalid import item:", result.error);
      return undefined;
    }

    return result.data;
  }
}

// const cookie =
//   "_ttp=31QP5BJ252XeXxfx9n8ucFumcAC; ttwid=1%7CU9eIxHrVr_QK5mx7boex8W5khLp4mM2vbrLtG6Eivps%7C1746206593%7C7272b636e819b12fddb15f964a3e0c609ce2e505a062b0d0a423d153c60513ad; tt_chain_token=MuA7b15ftRxwWLz0Nk1gxA==; delay_guest_mode_vid=8; cookie-consent={%22optional%22:true%2C%22ga%22:true%2C%22af%22:true%2C%22fbp%22:true%2C%22lip%22:true%2C%22bing%22:true%2C%22ttads%22:true%2C%22reddit%22:true%2C%22hubspot%22:true%2C%22version%22:%22v10%22}; uid_tt=cfbc575c29f5fbba056186a3ae8a7152e76e10bfca968af342a10e6fbb9e872c; uid_tt_ss=cfbc575c29f5fbba056186a3ae8a7152e76e10bfca968af342a10e6fbb9e872c; sid_tt=bb887af9002706bc1c5ec39dc45a0e6a; sessionid=bb887af9002706bc1c5ec39dc45a0e6a; sessionid_ss=bb887af9002706bc1c5ec39dc45a0e6a; store-idc=alisg; store-country-code=tr; store-country-code-src=uid; tt-target-idc=alisg; tt-target-idc-sign=Xh8q9AhRvjfoi0Q8Z83tMXPohHiWvaHrQ1ughQzRbnR0rO6RtybRkbuyWvZ34LSe-gK_sfZQQQ31FoJnFczNExrkLFzTM1iqljyBuPG25iXaVwG9whBgwUCE6v46wlgVwUMWzmzMFdYSP-Hi4lBNAnjBVJglbEY6cC4YeWdLxd-dzl4ZxJppFmfwwn4xBG3MkMlvKLshZSndb8LJMefPZ6iAWa6jpDsZJzXzG1WrUgdeqenpiKTIsU2sMrOQZqQTHd4zHe4mmgCreTGgCzABi_dkHQpy9qVr70rezeIiI-xEUOIjHUitB18l0l3VTTuZmTTFMeWB694tmtfEjo_IZbzVVu5ScqVSgRZNpiBle92Uoo28bGxm7PvO101O-NPlyQMzSn1476-rroayT4km0uGJbCHjpP6Mmofum6IlqytB1FnGscoB8IyyqsWCWwYFjyNwF06-OQLboLscclHaqKcwEG8GJnFaftOIs2_xlUNE3l6sW5WKyt6lICDBI2Yp; tiktok_webapp_theme=dark; sid_guard=bb887af9002706bc1c5ec39dc45a0e6a%7C1755369082%7C15552000%7CThu%2C+12-Feb-2026+18%3A31%3A22+GMT; sid_ucp_v1=1.0.0-KGVjNTk3OWUwYzZmZjIyMjBjNjcwMDViNTU1YjU5NmMwOTQzZDM1YmUKGQiGgL6CsJib8FoQ-pyDxQYYsws4CEASSAQQAxoCbXkiIGJiODg3YWY5MDAyNzA2YmMxYzVlYzM5ZGM0NWEwZTZh; ssid_ucp_v1=1.0.0-KGVjNTk3OWUwYzZmZjIyMjBjNjcwMDViNTU1YjU5NmMwOTQzZDM1YmUKGQiGgL6CsJib8FoQ-pyDxQYYsws4CEASSAQQAxoCbXkiIGJiODg3YWY5MDAyNzA2YmMxYzVlYzM5ZGM0NWEwZTZh; _ttp=31QP5BJ252XeXxfx9n8ucFumcAC; tiktok_webapp_theme_source=auto; tt_csrf_token=8PyTpNEL-fjOZjhac-fRV5lA-4gaDsVJnfu0; passport_fe_beating_status=true; perf_feed_cache={%22expireTimestamp%22:1758470400000%2C%22itemIds%22:[%227547399754225831175%22%2C%227551777095249038610%22%2C%227548964302397426962%22]}; store-country-sign=MEIEDArVKQj_A_e4FRHykwQgfYauu-DX8RumWkOK8W4TYbkEDwkWUEmuRsKu-wWfPt8EEDlRlJadBVcPRJqMUv8LQwg; odin_tt=f9af5057eb62b492c0ec62f8397da11104003295058108e9868d6d45c18ea8a4abcf999b3a2bafcdf4ea351c88f965fcfe81459388cb2055e4a0bdc74fbcbfdf5808a82f6b5d22199027908c0df06ceb; msToken=Xd8St7UTqMx90OhrYFQQf0MY6vfmpcV1hIvK-Fkzp-GBGCvkbpro4ZwD7b7R3vgo4pxTuGy45-uNG_dhXPM0yegDGBVnWCqVaidvzLSH0EH4I6s5s_S9X3v8noibEBT1SS3HKloBwdU_V8f4Py1PqeATNw==; msToken=1CNo0yJRLKknVmCYLsruqB2UXLHH9Z2gEnOZC09ZbA7LTebMMPZzeJ0JkanAex_kiEojGESQIv9_Dzqk2N6WP8irEh5sCWnoTD7COTwDIAIFRU6qOu-p_A_WMmzOOVVM46Cv9_Q1U9U1Iw661P4Tm7WScA==";
