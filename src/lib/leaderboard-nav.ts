/** Path for home + leaderboard hash: `/` or `/duels` when already on duels URL. */
export function getLeaderboardPathname(pathname: string): "/" | "/duels" {
  return pathname === "/duels" ? "/duels" : "/"
}

export function scrollToLeaderboard(pathname: string) {
  const el = document.getElementById("leaderboard")
  if (!el) return
  el.scrollIntoView({ behavior: "smooth", block: "start" })
  window.history.replaceState(
    null,
    "",
    `${getLeaderboardPathname(pathname)}#leaderboard`
  )
}
