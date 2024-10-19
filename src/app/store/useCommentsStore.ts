import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";
import { PostComment } from "../types/types";

interface State {
  comments: PostComment[];
  setThisComments: (comments: PostComment[]) => void;
  setComments: Dispatch<SetStateAction<PostComment[]>>;
  setSetComments: (
    setComments: Dispatch<SetStateAction<PostComment[]>>
  ) => void;
}

const useSetCommentsStore = create<State>((set) => ({
  comments: [],
  setThisComments: (comments: PostComment[]) => set({ comments }),
  setComments: () => {},
  setSetComments: (setComments: Dispatch<SetStateAction<PostComment[]>>) =>
    set({ setComments }),
}));

export default useSetCommentsStore;
