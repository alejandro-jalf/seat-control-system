export default function verifyRouters({ store, redirect, route, from }) {
  const login = typeof store.state.general.login === 'boolean'
    ? store.state.general.login
    : store.state.general.login === 'true'

  if (!login) {
    if (route.path.toLowerCase() !== '/login')
      redirect('/login')
  } else if (route.path.toLowerCase() === '/login') redirect('/')
}
