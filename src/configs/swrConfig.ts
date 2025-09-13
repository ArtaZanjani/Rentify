const swrConfig = {
  fetcher: (url: string) => fetch(url).then((res) => res.json()),
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: false,
};

export { swrConfig };
