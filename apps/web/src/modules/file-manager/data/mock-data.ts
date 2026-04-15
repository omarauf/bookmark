import type { FileItem } from "../types";

export const mockFileTree: FileItem = {
  id: "root",
  name: "My Drive",
  type: "folder",
  modifiedAt: "2025-09-15T12:00:00Z",
  children: [
    // --- Existing Data ---
    {
      id: "documents",
      name: "Documents",
      type: "folder",
      modifiedAt: "2025-09-10T10:30:00Z",
      parentId: "root",
      children: [
        {
          id: "resume",
          name: "resume_v3_final.pdf",
          type: "file",
          size: 245760,
          modifiedAt: "2025-09-01T14:20:00Z",
          parentId: "documents",
        },
        {
          id: "cover-letter",
          name: "cover-letter-tech.docx",
          type: "file",
          size: 32768,
          modifiedAt: "2025-09-02T09:15:00Z",
          parentId: "documents",
        },
        {
          id: "work",
          name: "Work",
          type: "folder",
          modifiedAt: "2025-08-14T16:45:00Z",
          parentId: "documents",
          children: [
            {
              id: "project-proposal",
              name: "Q4_Project_Proposal.pdf",
              type: "file",
              size: 1048576,
              modifiedAt: "2025-08-14T16:45:00Z",
              parentId: "work",
            },
            {
              id: "meeting-notes",
              name: "meeting_notes_2025-08-12.md",
              type: "file",
              size: 5120,
              modifiedAt: "2025-08-12T11:00:00Z",
              parentId: "work",
            },
          ],
        },
        {
          id: "receipts",
          name: "Receipts",
          type: "folder",
          modifiedAt: "2025-09-05T18:00:00Z",
          parentId: "documents",
          children: [
            {
              id: "receipt-software",
              name: "software-subscription.pdf",
              type: "file",
              size: 102400,
              modifiedAt: "2025-09-05T17:55:00Z",
              parentId: "receipts",
            },
          ],
        },
      ],
    },
    {
      id: "pictures",
      name: "Pictures",
      type: "folder",
      modifiedAt: "2025-08-20T11:20:00Z",
      parentId: "root",
      children: [
        {
          id: "vacation-italy",
          name: "italy_trip_2025",
          type: "folder",
          modifiedAt: "2025-08-19T10:00:00Z",
          parentId: "pictures",
          children: [
            {
              id: "vacation-colosseum",
              name: "colosseum.jpg",
              type: "file",
              size: 4194304,
              modifiedAt: "2025-08-15T11:20:00Z",
              parentId: "vacation-italy",
            },
            {
              id: "vacation-venice",
              name: "venice_canals.png",
              type: "file",
              size: 6291456,
              modifiedAt: "2025-08-18T15:30:00Z",
              parentId: "vacation-italy",
            },
          ],
        },
        {
          id: "profile",
          name: "profile.png",
          type: "file",
          size: 524288,
          modifiedAt: "2025-07-11T08:30:00Z",
          parentId: "pictures",
        },
      ],
    },
    {
      id: "downloads",
      name: "Downloads",
      type: "folder",
      modifiedAt: "2025-09-15T09:00:00Z",
      parentId: "root",
      children: [
        {
          id: "installer",
          name: "utility-app_v2.1.exe",
          type: "file",
          size: 10485760,
          modifiedAt: "2025-09-15T09:00:00Z",
          parentId: "downloads",
        },
        {
          id: "font-archive",
          name: "creative-fonts.zip",
          type: "file",
          size: 26214400,
          modifiedAt: "2025-09-14T13:45:00Z",
          parentId: "downloads",
        },
      ],
    },
    // --- New Data ---
    {
      id: "music",
      name: "Music",
      type: "folder",
      modifiedAt: "2025-06-20T15:00:00Z",
      parentId: "root",
      children: [
        {
          id: "artist-daft-punk",
          name: "Daft Punk",
          type: "folder",
          modifiedAt: "2025-05-10T20:00:00Z",
          parentId: "music",
          children: [
            {
              id: "album-discovery",
              name: "Discovery",
              type: "folder",
              modifiedAt: "2025-05-10T20:00:00Z",
              parentId: "artist-daft-punk",
              children: [
                {
                  id: "song-one-more-time",
                  name: "01 One More Time.mp3",
                  type: "file",
                  size: 5242880,
                  modifiedAt: "2025-05-10T20:00:00Z",
                  parentId: "album-discovery",
                },
                {
                  id: "song-digital-love",
                  name: "03 Digital Love.mp3",
                  type: "file",
                  size: 4928307,
                  modifiedAt: "2025-05-10T20:00:00Z",
                  parentId: "album-discovery",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "videos",
      name: "Videos",
      type: "folder",
      modifiedAt: "2025-09-03T19:25:00Z",
      parentId: "root",
      children: [
        {
          id: "video-drone-footage",
          name: "drone_footage_coast.mp4",
          type: "file",
          size: 786432000,
          modifiedAt: "2025-09-03T19:25:00Z",
          parentId: "videos",
        },
        {
          id: "video-tutorial",
          name: "advanced-css-tutorial.mov",
          type: "file",
          size: 1258291200,
          modifiedAt: "2025-08-28T14:10:00Z",
          parentId: "videos",
        },
      ],
    },
    {
      id: "projects",
      name: "Projects",
      type: "folder",
      modifiedAt: "2025-09-18T11:00:00Z",
      parentId: "root",
      children: [
        {
          id: "proj-file-manager",
          name: "file-manager-app",
          type: "folder",
          modifiedAt: "2025-09-18T11:00:00Z",
          parentId: "projects",
          children: [
            {
              id: "fm-src",
              name: "src",
              type: "folder",
              modifiedAt: "2025-09-18T10:50:00Z",
              parentId: "proj-file-manager",
              children: [
                {
                  id: "fm-components",
                  name: "components",
                  type: "folder",
                  modifiedAt: "2025-09-17T15:20:00Z",
                  parentId: "fm-src",
                  children: [
                    {
                      id: "fm-file-icon",
                      name: "FileIcon.tsx",
                      type: "file",
                      size: 4096,
                      modifiedAt: "2025-09-17T15:20:00Z",
                      parentId: "fm-components",
                    },
                  ],
                },
                {
                  id: "fm-app-tsx",
                  name: "App.tsx",
                  type: "file",
                  size: 2048,
                  modifiedAt: "2025-09-18T10:50:00Z",
                  parentId: "fm-src",
                },
              ],
            },
            {
              id: "fm-package-json",
              name: "package.json",
              type: "file",
              size: 1228,
              modifiedAt: "2025-09-16T09:00:00Z",
              parentId: "proj-file-manager",
            },
            {
              id: "fm-readme",
              name: "README.md",
              type: "file",
              size: 3072,
              modifiedAt: "2025-09-16T09:05:00Z",
              parentId: "proj-file-manager",
            },
          ],
        },
      ],
    },
    {
      id: "archive-2024",
      name: "archive_2024.zip",
      type: "file",
      size: 524288000,
      modifiedAt: "2025-01-02T10:00:00Z",
      parentId: "root",
    },

    ...(Array.from({ length: 150 }).map((_, i) => ({
      id: `misc-file-${i + 1}`,
      name: `misc_file_${i + 1}.txt`,
      type: "file",
      size: 1024 * (i + 1),
      modifiedAt: `2025-09-${(i % 30) + 1}T12:00:00Z`,
      parentId: "root",
    })) as FileItem[]),
  ],
};

// Mock API functions with delays to simulate real operations
export const mockApi = {
  async copyItems(items: FileItem[], destinationFolderId: string) {
    console.log("Copying items", { items, destinationFolderId });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: `Copied ${items.length} item(s) to destination` };
  },

  async moveItems(items: FileItem[], destinationFolderId: string) {
    console.log("Moving items", { items, destinationFolderId });
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true, message: `Moved ${items.length} item(s) to destination` };
  },

  async renameItem(itemId: string, newName: string) {
    console.log("Renaming item", { itemId, newName });
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, message: `Renamed item to ${newName}` };
  },

  async deleteItems(itemIds: string[]) {
    console.log("Deleting items", { itemIds });
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { success: true, message: `Deleted ${itemIds.length} item(s)` };
  },

  async createFolder(parentId: string, name: string) {
    console.log("Creating folder", { parentId, name });
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { success: true, message: `Created folder ${name}` };
  },
};
