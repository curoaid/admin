import create from 'zustand'
import { persist } from 'zustand/middleware'


export const useGlobalStore = create(
  persist(
  (set) => ({
 
    userDetails:{},
    sidebarShow:true,
  notify:false,
  notifyCount:0,

    setUserDetails: async (value) => {
        set((state) => ({userDetails:value}))
      },
    setNotify: async (value) => {
        set((state) => ({notify:value}))
      },
    setNotifyCount: async (value) => {
        set((state) => ({notifyCount:value}))
      },

      setSidebarShow: () => set((state) => ({ sidebarShow: !state.sidebarShow })),
      setSidebarVisible: (visible) => set({ sidebarShow: visible }),
//   removeAllBears: () => set({ bears: 0 }),
}),
{
  name: 'storage',
  getStorage: () => localStorage,
}
)
)

