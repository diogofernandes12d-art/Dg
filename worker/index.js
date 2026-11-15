const SITE_ORIGIN = "https://diogofernandes12d-art.github.io";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": SITE_ORIGIN,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    const respond = (data, status = 200) =>
      new Response(JSON.stringify(data), { status, headers });

    // Health check: also works when opened directly
    if (url.pathname === "/api/health" && request.method === "GET") {
      return respond({
        success: true,
        app: "RASPBR AI",
        server: "online",
        huggingFaceSecret: Boolean(env.HF_TOKEN),
        message: "Servidor conectado!"
      });
    }

    // Allow requests only from the published site
    if (origin !== SITE_ORIGIN) {
      return respond({
        success: false,
        message: "Origem não autorizada"
      }, 403);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    return respond({
      success: false,
      message: "Integração de geração ainda não ativada."
    }, 404);
  }
};
