type User = {
  id: number;
  email: string;
  password: string;
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
  refreshToken?: string;
  deptId: number;
};

type Post = {
  pid: number;
  userId: number;
  deptId: number;
  title: string;
  message: string;
  imageLocation: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
};

type GroupedPosts = {
  [date: string]: Post[];
};

export type { Post, GroupedPosts, User };
