const SCOPES = 'user-read-private user-read-email user-top-read'

export default defineEventHandler((event) => {
  const { spotifyClientId } = useRuntimeConfig(event)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: spotifyClientId,
    scope: SCOPES,
    redirect_uri: `${getRequestURL(event).origin}/api/callback`,
  })

  return sendRedirect(event, `https://accounts.spotify.com/authorize?${params}`)
})
