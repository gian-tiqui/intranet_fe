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

type PostReader = {
  id: number;
  postId: number;
  userId: number;
  readAt: Date;

  post: Post;
  user: User;
};

type ImageLocation = {
  id: number;
  imageLocation: string;
  postId: number;
};

type Post = {
  pid: number;
  userId: number;
  title?: string;
  message?: string;
  imageLocations?: ImageLocation[];
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  comments?: Comment[];
  edited: boolean;
  department: Department;
  public: boolean;
  lid: number;
  readers: PostReader[];
};

type PostDepartment = {
  id: number;
  postId: number;
  deptId: number;
};

type RetPost = {
  posts: Post[];
  count: number;
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
  departmentCode: string;
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

type DepartmentMonitoring = {
  departmentId: number;
  departmentName: string;
  postCount: number;
  users: UserMonitoring[];
};

type UserMonitoring = {
  userId: number;
  firstName: string;
  lastName: string;
  readCount: number;
  unreadCount: number;
};

type UnreadPost = {
  deptId: number;
  title: string;
  message: string;
  createdAt: Date;
  pid: number;
};

type Decoder = {
  firstName: string;
  lastName: string;
  sub: number;
  email: string;
  deptId: number;
  departmentCode: string;
  lid: number;
  departmentName: string;
};

type Level = {
  lid: number;
  level: string;
  posts?: Post[];
  users?: User[];
};

type CommentsProp = {
  comments: {
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
  }[];
};

type UserWithIncompleteRead = {
  userId: number;
  firstName: string;
  lastName: string;
  unreadCount: number;
};

type DepartmentWithIncompleteReads = {
  departmentId: number;
  departmentName: string;
  postCount: number;
  users: UserWithIncompleteRead[];
};

type DepartmentUserCount = {
  departmentName: string;
  userCount: number;
};

type LogType = {
  id: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
  editTypeId: number;
  log: User | Post | Comment | { password: string; hash: string };
};

export type {
  ImageLocation,
  LogType,
  DepartmentUserCount,
  UserWithIncompleteRead,
  DepartmentWithIncompleteReads,
  CommentsProp,
  RetPost,
  Level,
  Decoder,
  UnreadPost,
  DepartmentMonitoring,
  UserMonitoring,
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
  PostDepartment,
};
