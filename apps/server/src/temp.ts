// import { db } from "./core/db";
// import { getPost, listPosts } from "./modules/post/service/temp";

import { db } from "./core/db";
import { collections } from "./modules/collection/schema";

// console.clear();

// const id = "019d5a8f-b6d8-73e8-bbee-5982cd1da118";

// const music = "019d6434-3026-7750-a001-7329bbe47ebe";
// const musicArabic = "019d6434-62dd-76c5-8e6a-206be0a8d0c7";
// const musichEnglish = "019d6434-77b7-71ba-929a-13ed54c69561";
// const food = "019d6434-4d2e-70fc-9d93-f163cd689a61";

// const fullPost = await getPost(id);
// const posts = await listPosts({
//   page: 1,
//   perPage: 10,
//   //   collectionIds: [music],
//   //   collectionPaths: ["music"],
//   //   username: 'alex'
// });

// console.log(posts);

// process.exit(0);

const a = [
  {
    id: "018f1f20-0000-7000-8000-000000000001",
    label: "Travel",
    slug: "travel",
    path: "travel",
    parentId: null,
    level: 0,
    color: "#FF5733",
  },
  {
    id: "018f1f20-0001-7000-8000-000000000002",
    label: "Europe",
    slug: "europe",
    path: "travel.europe",
    parentId: "018f1f20-0000-7000-8000-000000000001",
    level: 1,
    color: "#33FF57",
  },
  {
    id: "018f1f20-0002-7000-8000-000000000003",
    label: "Asia",
    slug: "asia",
    path: "travel.asia",
    parentId: "018f1f20-0000-7000-8000-000000000001",
    level: 1,
    color: "#3357FF",
  },
  {
    id: "018f1f20-0003-7000-8000-000000000004",
    label: "Beaches",
    slug: "beaches",
    path: "travel.beaches",
    parentId: "018f1f20-0000-7000-8000-000000000001",
    level: 1,
    color: "#FF33A8",
  },
  {
    id: "018f1f20-0004-7000-8000-000000000005",
    label: "Mountains",
    slug: "mountains",
    path: "travel.mountains",
    parentId: "018f1f20-0000-7000-8000-000000000001",
    level: 1,
    color: "#A833FF",
  },
  {
    id: "018f1f20-0005-7000-8000-000000000006",
    label: "Food",
    slug: "food",
    path: "food",
    parentId: null,
    level: 0,
    color: "#33FFF3",
  },
  {
    id: "018f1f20-0006-7000-8000-000000000007",
    label: "Desserts",
    slug: "desserts",
    path: "food.desserts",
    parentId: "018f1f20-0005-7000-8000-000000000006",
    level: 1,
    color: "#FFC133",
  },
  {
    id: "018f1f20-0007-7000-8000-000000000008",
    label: "Street Food",
    slug: "street-food",
    path: "food.street-food",
    parentId: "018f1f20-0005-7000-8000-000000000006",
    level: 1,
    color: "#FF8F33",
  },
  {
    id: "018f1f20-0008-7000-8000-000000000009",
    label: "Healthy",
    slug: "healthy",
    path: "food.healthy",
    parentId: "018f1f20-0005-7000-8000-000000000006",
    level: 1,
    color: "#33FF57",
  },
  {
    id: "018f1f20-0009-7000-8000-000000000010",
    label: "Vegan",
    slug: "vegan",
    path: "food.vegan",
    parentId: "018f1f20-0005-7000-8000-000000000006",
    level: 1,
    color: "#3357FF",
  },
  {
    id: "018f1f20-000a-7000-8000-000000000011",
    label: "Fitness",
    slug: "fitness",
    path: "fitness",
    parentId: null,
    level: 0,
    color: "#FF33A8",
  },
  {
    id: "018f1f20-000b-7000-8000-000000000012",
    label: "Gym",
    slug: "gym",
    path: "fitness.gym",
    parentId: "018f1f20-000a-7000-8000-000000000011",
    level: 1,
    color: "#A833FF",
  },
  {
    id: "018f1f20-000c-7000-8000-000000000013",
    label: "Yoga",
    slug: "yoga",
    path: "fitness.yoga",
    parentId: "018f1f20-000a-7000-8000-000000000011",
    level: 1,
    color: "#33FFF3",
  },
  {
    id: "018f1f20-000d-7000-8000-000000000014",
    label: "Cardio",
    slug: "cardio",
    path: "fitness.cardio",
    parentId: "018f1f20-000a-7000-8000-000000000011",
    level: 1,
    color: "#FFC133",
  },
  {
    id: "018f1f20-000e-7000-8000-000000000015",
    label: "Crossfit",
    slug: "crossfit",
    path: "fitness.crossfit",
    parentId: "018f1f20-000a-7000-8000-000000000011",
    level: 1,
    color: "#FF8F33",
  },
  {
    id: "018f1f20-000f-7000-8000-000000000016",
    label: "Fashion",
    slug: "fashion",
    path: "fashion",
    parentId: null,
    level: 0,
    color: "#FF5733",
  },
  {
    id: "018f1f20-0010-7000-8000-000000000017",
    label: "Streetwear",
    slug: "streetwear",
    path: "fashion.streetwear",
    parentId: "018f1f20-000f-7000-8000-000000000016",
    level: 1,
    color: "#33FF57",
  },
  {
    id: "018f1f20-0011-7000-8000-000000000018",
    label: "Luxury",
    slug: "luxury",
    path: "fashion.luxury",
    parentId: "018f1f20-000f-7000-8000-000000000016",
    level: 1,
    color: "#3357FF",
  },
  {
    id: "018f1f20-0012-7000-8000-000000000019",
    label: "Casual",
    slug: "casual",
    path: "fashion.casual",
    parentId: "018f1f20-000f-7000-8000-000000000016",
    level: 1,
    color: "#FF33A8",
  },
  {
    id: "018f1f20-0013-7000-8000-000000000020",
    label: "Vintage",
    slug: "vintage",
    path: "fashion.vintage",
    parentId: "018f1f20-000f-7000-8000-000000000016",
    level: 1,
    color: "#A833FF",
  },
  {
    id: "018f1f20-0014-7000-8000-000000000021",
    label: "Photography",
    slug: "photography",
    path: "photography",
    parentId: null,
    level: 0,
    color: "#33FFF3",
  },
  {
    id: "018f1f20-0015-7000-8000-000000000022",
    label: "Portrait",
    slug: "portrait",
    path: "photography.portrait",
    parentId: "018f1f20-0014-7000-8000-000000000021",
    level: 1,
    color: "#FFC133",
  },
  {
    id: "018f1f20-0016-7000-8000-000000000023",
    label: "Landscape",
    slug: "landscape",
    path: "photography.landscape",
    parentId: "018f1f20-0014-7000-8000-000000000021",
    level: 1,
    color: "#FF8F33",
  },
  {
    id: "018f1f20-0017-7000-8000-000000000024",
    label: "Urban",
    slug: "urban",
    path: "photography.urban",
    parentId: "018f1f20-0014-7000-8000-000000000021",
    level: 1,
    color: "#33FF57",
  },
  {
    id: "018f1f20-0018-7000-8000-000000000025",
    label: "Wildlife",
    slug: "wildlife",
    path: "photography.wildlife",
    parentId: "018f1f20-0014-7000-8000-000000000021",
    level: 1,
    color: "#3357FF",
  },
  {
    id: "018f1f20-0019-7000-8000-000000000026",
    label: "Technology",
    slug: "technology",
    path: "technology",
    parentId: null,
    level: 0,
    color: "#FF33A8",
  },
  {
    id: "018f1f20-001a-7000-8000-000000000027",
    label: "AI",
    slug: "ai",
    path: "technology.ai",
    parentId: "018f1f20-0019-7000-8000-000000000026",
    level: 1,
    color: "#A833FF",
  },
  {
    id: "018f1f20-001b-7000-8000-000000000028",
    label: "Gadgets",
    slug: "gadgets",
    path: "technology.gadgets",
    parentId: "018f1f20-0019-7000-8000-000000000026",
    level: 1,
    color: "#33FFF3",
  },
  {
    id: "018f1f20-001c-7000-8000-000000000029",
    label: "Programming",
    slug: "programming",
    path: "technology.programming",
    parentId: "018f1f20-0019-7000-8000-000000000026",
    level: 1,
    color: "#FFC133",
  },
  {
    id: "018f1f20-001d-7000-8000-000000000030",
    label: "Startups",
    slug: "startups",
    path: "technology.startups",
    parentId: "018f1f20-0019-7000-8000-000000000026",
    level: 1,
    color: "#FF8F33",
  },
];

await db.insert(collections).values(a);

process.exit(0);
