export async function useAPI<T>(url: string, options: any = {}) {
  // const { accessToken, refreshToken, refreshTokenValue } = useAuthStore();
  const tokenInfo = useCookie("auth", {
    maxAge: 7 * 24 * 60 * 60
  });
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;

  // const headers = {
  //   ...options.headers,
  //   Authorization: `Bearer ${tokenInfo.value?.accessToken}`,
  // };

  try {
    const { data, status, error, refresh, clear } = await useFetch<T>(url,
      {
        baseURL: baseURL,
        ...options,
        onRequest({ request, options }) {
          const tokenInfo = useCookie("auth").value;
          console.log(tokenInfo?.accessToken, 'tokeneeeeeeeeeeeee')
          if (tokenInfo) {
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${tokenInfo?.accessToken}`,
            };
          }
        },
        onRequestError({ request, options, error }) {
          // Handle the request errors
          console.log(error, '请求错误。。。')
        },
        onResponse({ request, response, options }) {
          // Process the response data
          console.log('请求成功', response, options)
        },
        onResponseError({ request, response, options }) {
          // Handle the response errors
          console.log('返回失败', response, options)
        },
      }
    );
    console.log('status', status)
    if (error.value && error.value.statusCode === 401) {
      // 刷新token
      console.log('401', '刷新token')
      try {
        const res2 = await $fetch<{ token: string }>(
          `${baseURL}/auth/refresh`,
          {
            method: "POST",
            headers: {
              Authorization: "",
            },
            body: { refreshToken: tokenInfo.value.refreshTokenValue },
          }
        );

        const newToken = res2.token;
        // const info = tokenInfo.value
        // info.accessToken = newToken
        // tokenInfo.value = info;
        // console.log('成功了吗', tokenInfo.value, useCookie('auth').value)
        const authStore = useAuthStore()
        authStore.accessToken = newToken
        
        if (newToken) {
          console.log(authStore.accessToken, 'token 进来了')
          const retryHeaders = {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return await useFetch<T>(baseURL + url, {
            ...options,
            headers: retryHeaders,
          });
        }
      } catch (err) {
        console.log(err, "刷新失败，并跳登录");
        // tokenInfo.value = null
        const messagesStore = useMessagesStore();
        messagesStore.add(String(err.data?.message));
        // navigateTo("/login");
      }
    }

    if (error.value && error.value.statusCode !== 401) {
      const messagesStore = useMessagesStore();
      messagesStore.add(String(error.value.data?.message));
    }
    return { data, status, error, refresh, clear };
  } catch (err) {
    throw err;
  }
}
