import { create } from "zustand";
import { NotificationType } from "../types/types";

interface State {
  notification: NotificationType | undefined;
  setNotification: (notification: NotificationType | undefined) => void;
}

const useNotificationStore = create<State>((set) => ({
  notification: undefined,
  setNotification: (notification: NotificationType | undefined) =>
    set({ notification }),
}));

export default useNotificationStore;
