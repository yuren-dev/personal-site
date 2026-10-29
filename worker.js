export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") url.pathname = "/index.html";
    const res = await env.ASSETS.fetch(new Request(url.toString(), request));
    if (res.status !== 404) return res;
    const fallback = new URL(request.url);
    fallback.pathname = "/index.html";
    return env.ASSETS.fetch(new Request(fallback.toString(), request));
  },
};
