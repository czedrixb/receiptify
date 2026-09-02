export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'spotify_token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Not logged in' })

  const headers = { Authorization: `Bearer ${token}` }

  try {
    const [user, top] = await Promise.all([
      $fetch<any>('https://api.spotify.com/v1/me', { headers }),
      $fetch<any>('https://api.spotify.com/v1/me/top/tracks', { headers, query: { limit: 5 } }),
    ])

    return { user, tracks: top.items }
  } catch (error: any) {
    // Tokens last ~1 hour and no refresh token is stored, so an expired
    // session just sends the user back to the login page.
    if (error?.status === 401 || error?.statusCode === 401) {
      deleteCookie(event, 'spotify_token', { path: '/' })
      throw createError({ statusCode: 401, statusMessage: 'Spotify session expired' })
    }

    console.error('Spotify request failed:', error)
    throw createError({ statusCode: 502, statusMessage: 'Could not reach Spotify' })
  }
})
