import { ReactNode } from "react";

type User = {
  id: number;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  lastNamePrefix?: string;
  preferredName?: string;
  suffix?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: number;
  dob: Date;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
  deptId: number;
  department: Department;
};

type Post = {
  pid: number;
  userId: number;
  deptId: number;
  title?: string;
  message?: string;
  imageLocation?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  comments?: Comment[];
  edited: boolean;
  department: Department;
};

type GroupedPosts = {
  [date: string]: Post[];
};

type Comment = {
  cid: number;
  userId: number;
  postId: number;
  parentId: number;
  message?: string;
  imageLocation?: string;
  createdAt: Date;
  updatedAt: Date;

  user: User;
  post: Post;
};

type Department = {
  deptId: number;
  departmentName: string;
  users: User[];
  posts: Post[];
};

type PostComment = {
  cid: number;
  userId: number;
  postId: number;
  parentId: number;
  message?: string;
  imageLocation?: string;
  createdAt: Date;
  updatedAt: Date;

  user: User;
  post: Post;
  replies?: PostComment[];
};

type CreateComment = {
  userId: number;
  postId?: number;
  parentId?: number;
  message?: string;
};

type ABoardSelector = {
  name: string;
  component: ReactNode;
  icon: string;
};

type MinMax = {
  min: number;
  max: number;
};

type ThType = {
  head: string;
  field: string;
};

type NavLinksType = {
  name: string;
  link: string;
};

type NotificationType = {
  id: number;
  userId: number;
  postId: number;
  commentId: number;
  deptId: number;
  message: string;
  isRead: boolean;
};

export type {
  NotificationType,
  Post,
  GroupedPosts,
  User,
  Comment,
  PostComment,
  CreateComment,
  ABoardSelector,
  Department,
  MinMax,
  ThType,
  NavLinksType,
};
