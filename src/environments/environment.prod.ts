export const environment = {
  production: true,
  auth_config: {
    client_id: "open.fitness.mobile",
    client_secret: "secret",
    server_host: "https://oauth.oss.gr",
    redirect_url: "gr.oss.open.fitness://callback",
    end_session_redirect_url: "gr.oss.open.fitness://endsession",
    scopes: "openid offline_access email profile mobile_profile api",
    pkce: true,
  },
};
