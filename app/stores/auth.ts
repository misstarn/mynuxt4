export const useAuthStore = defineStore(
  "auth",
  () => {
    const accessToken = ref(null as string | null);
    const refreshTokenValue = ref(null as string | null);
    const user = ref(null as any);
    // login
    const login = async (data: { email: string; password: string }) => {
      try {
        const config = useRuntimeConfig();
        const baseURL = config.public.apiBase;
        const res = await $fetch<{
          token: { token: string; refreshToken: string };
          user: any;
        }>(`${baseURL}/auth/login`, {
          method: "POST",
          body: data,
        });

        accessToken.value = res.token.token;
        refreshTokenValue.value = res.token.refreshToken;
        user.value = res.user;
        return res;
      } catch (err) {
        const messagesStore = useMessagesStore();
        messagesStore.add(String(err.data?.message));
        return null;
      }
    };
    // reset
    const $reset = () => {
      accessToken.value = null
      refreshTokenValue.value = null
      user.value = null
    }
    const setToken = (token: string) => {
      accessToken.value = token;
    };

    return { accessToken, refreshTokenValue, login, setToken, $reset, user};
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.cookies(
       {
        // expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        sameSite: 'lax',
        // secure: true,
        maxAge: 7 * 24 * 60 * 60
       }
      )
    },
  }
);
