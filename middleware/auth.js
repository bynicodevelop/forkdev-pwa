export default function async({ store, route, redirect, $cookies, app }) {
  console.log('Auth middleware')

  const user = $cookies.get('forkdev')

  const routesAllowed = ['auth-login']

  if (
    (!store.getters['auth/isAuthenticated'] || user?.uid == undefined) &&
    !route.name.includes(routesAllowed)
  ) {
    return redirect('/auth/login')
  }

  if (
    store.getters['auth/isAuthenticated'] &&
    user?.uid != undefined &&
    route.name.includes(routesAllowed)
  ) {
    return redirect('/')
  }
}
