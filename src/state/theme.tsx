import {create} from 'zustand';

type Theme = {
    authWallpaperDark: boolean
    setAuthWallpaperDark: (authWallpaperDark: boolean) => void
}

export const useThemeStore = create<Theme>()((set) => ({
        authWallpaperDark: false,
        setAuthWallpaperDark: (authWallpaperDark: boolean) => set(() => ({
            authWallpaperDark: authWallpaperDark
        })),
    })
);
