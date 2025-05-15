import { StaticImageData } from "next/image";
import { ReactNode } from "react";

type EmployeeLevel = {
  id: number;
  level: string;
};

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
  password: string;
  dob: Date;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
  deptId: number;
  department: Department;
  divisionId: number;
  employeeId: string;
  lid: number;
  employeeLevel: EmployeeLevel;
  division: Division;
};

type TabType = {
  name: string;
  component: ReactNode;
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
  folderId: number;
  postDepartments: { department: Department }[];
  folder: Folder;
  employeeLevel: Level;
  downloadable: boolean;
  isPublished: boolean;
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
  divisionId: number;
  division: Division;
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
  parentComment?: PostComment;
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

type TabContent = {
  title: string;
  message: string;
  image: StaticImageData;
};

type NotificationType = {
  id: number;
  userId: number;
  postId: number;
  commentId: number;
  deptId: number;
  createdAt: string | Date;
  message: string;
  isRead: boolean;
  comment?: PostComment;
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

interface GroupedFiles {
  [key: string]: ImageLocation[];
}

type Folder = {
  id: number;
  name: string;
  parentId?: number;
  subfolders: Folder[];
  posts: Post[];
  icon: string;
  textColor?: string;
  folderColor?: string;
  createdAt: string;
  updatedAt: string;
};

type UpdateStatus = {
  isUpdated: boolean;
};

type Query = {
  search?: string;
  skip?: number;
  take?: number;
  includeSubfolders?: number;
  depth?: number;
  isPublished?: number;
};

type AddDepartmentFormField = {
  departmentName: string;
  departmentCode: string;
  divisionId: number;
};

type Division = {
  id: number;
  divisionCode: string;
  divisionName: string;
  departments: Department[];
  createdAt: Date;
  updatedAt: Date;
};

export type {
  Division,
  AddDepartmentFormField,
  Query,
  UpdateStatus,
  Folder,
  GroupedFiles,
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
  TabContent,
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
  TabType,
};
