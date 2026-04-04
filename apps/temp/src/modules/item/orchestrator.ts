import type { Platform } from "@/contracts/common";
import type { PlatformHandler } from "@/core/platform";
import { InstagramHandler } from "@/platofrm/instagram/handler";

class ItemOrchestrator {
  private handlers = new Map<Platform, PlatformHandler>();

  constructor() {
    const instagramHandler = new InstagramHandler();
    // const tiktokHandler = new TiktokHandler();
    // const twitterHandler = new TwitterHandler();
    this.handlers.set(instagramHandler.platform, instagramHandler);
    // this.handlers.set(tiktokHandler.platform, tiktokHandler);
    // this.handlers.set(twitterHandler.platform, twitterHandler);
  }

  validate(type: Platform, data: string) {
    const handler = this.handlers.get(type);
    if (!handler) throw new Error("Unsupported platform");

    return handler.validate(data);
  }

  process(type: Platform, data: string) {
    const handler = this.handlers.get(type);
    if (!handler) throw new Error("Unsupported platform");

    const parsed = handler.handler(data);
    return parsed;
  }
}

export const itemOrchestrator = new ItemOrchestrator();
