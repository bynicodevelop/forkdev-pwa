export default function ({ store, route, redirect, $cookies }) {
  console.log('Auth middleware')
  console.log(`Is authenticated: ${store.getters['auth/isAuthenticated']}`)

  const user = $cookies.get('forkdev')

  const routesAllowed = ['auth-login', 'changelog', 'profiles-slug']

  console.log(
    `Route name ${route.name} included: ${routesAllowed.includes(route.name)}`
  )

  if (routesAllowed.includes(route.name)) {
    return
  }

  if (
    (!store.getters['auth/isAuthenticated'] || user?.uid == undefined) &&
    !routesAllowed.includes(route.name)
  ) {
    return redirect('/auth/login')
  }

  if (
    store.getters['auth/isAuthenticated'] &&
    user?.uid != undefined &&
    routesAllowed.includes(route.name)
  ) {
    return redirect('/')
  }
}
