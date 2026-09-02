interface SpotifyToken {
  access_token: string
  expires_in: number
}

export default defineEventHandler(async (event) => {
  const { code } = getQuery(event)
  if (!code) return sendRedirect(event, '/?error=auth')

  const { spotifyClientId, spotifyClientSecret } = useRuntimeConfig(event)
  const credentials = Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString('base64')

  try {
    const { access_token, expires_in } = await $fetch<SpotifyToken>(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code: String(code),
          // Must match the redirect_uri sent to /authorize by login.get.ts
          redirect_uri: `${getRequestURL(event).origin}/api/callback`,
          grant_type: 'authorization_code',
        }),
      }
    )

    setCookie(event, 'spotify_token', access_token, {
      httpOnly: true,
      secure: !import.meta.dev,
      sameSite: 'lax',
      path: '/',
      maxAge: expires_in,
    })

    return sendRedirect(event, '/receipt')
  } catch (error: any) {
    // Spotify puts the real reason in the response body (invalid_client,
    // invalid_grant, redirect_uri_mismatch, ...) - surface it, not just the 400.
    console.error('Spotify token exchange failed:', error?.data ?? error)
    return sendRedirect(event, '/?error=auth')
  }
})
