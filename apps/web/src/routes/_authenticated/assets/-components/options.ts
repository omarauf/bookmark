import { LayoutGrid, List, Table2 } from "lucide-react";

const roleOptions = [
  { value: "admin", label: "Administrator" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
  { value: "contributor", label: "Contributor" },
];

const interestOptions = [
  { value: "coding", label: "Software Development" },
  { value: "design", label: "UI/UX Design" },
  { value: "music", label: "Music Production" },
  { value: "gaming", label: "Game Design" },
  { value: "writing", label: "Technical Writing" },
  { value: "photography", label: "Photography" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const skillOptions = [
  { value: "react", label: "React" },
  { value: "typescript", label: "TypeScript" },
  { value: "node", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
];

const planOptions = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

const viewModeOptions = [
  { value: "grid", label: "Grid", icon: LayoutGrid },
  { value: "list", label: "List", icon: List },
  { value: "table", label: "Table", icon: Table2 },
];

const tagOptions = [
  { value: "urgent", label: "Urgent", color: "#ef4444" },
  { value: "review", label: "Review", color: "#f59e0b" },
  { value: "approved", label: "Approved", color: "#22c55e" },
  { value: "draft", label: "Draft", color: "#6b7280" },
  { value: "archived", label: "Archived", color: "#8b5cf6" },
];

const categoryOptions = [
  { value: "1", label: "Electronics", parentId: null },
  { value: "2", label: "Computers", parentId: "1" },
  { value: "3", label: "Laptops", parentId: "2" },
  { value: "4", label: "Desktops", parentId: "2" },
  { value: "5", label: "Phones", parentId: "1" },
  { value: "6", label: "Clothing", parentId: null },
  { value: "7", label: "Men", parentId: "6" },
  { value: "8", label: "Women", parentId: "6" },
  { value: "9", label: "Accessories", parentId: "6" },
  { value: "10", label: "Home", parentId: null },
  { value: "11", label: "Furniture", parentId: "10" },
  { value: "12", label: "Decor", parentId: "10" },
];

export const options = {
  role: roleOptions,
  interest: interestOptions,
  gender: genderOptions,
  skill: skillOptions,
  plan: planOptions,
  viewMode: viewModeOptions,
  tag: tagOptions,
  category: categoryOptions,
};
