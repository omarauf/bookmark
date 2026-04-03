import type { CreateDownloadTask } from "@/contracts/download-task";
import type { CreateItem } from "@/contracts/item";
import type { CreateItemRelation } from "@/contracts/item-relation";

export type Result = {
  items: CreateItem[];
  relations: CreateItemRelation[];
  downloadJob: CreateDownloadTask[];
};
