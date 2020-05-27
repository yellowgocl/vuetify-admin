function crumbs(route) {
    const crumbs = []
    route.matched.map((item, i, { length }) => {
      const crumb = {}
      crumb.path = item.path
      // crumb.name = this.$i18n.t('route.' + (item.name || item.path))
      crumb.name = item.name

      // is last item?
      if (i === length - 1) {
        // is param route? .../.../:id
        if (item.regex.keys.length > 0) {
          crumbs.push({
            path: item.path.replace(/\/:[^/:]*$/, ''),
            // name: this.$i18n.t('route.' + item.name.replace(/-[^-]*$/, ''))
            name: item.name
          })
          crumb.path = route.path
        //   crumb.name = this.$i18n.t('route.' + route.name, [
        //     crumb.path.match(/[^/]*$/)[0]
        //   ])
        }
        crumb.classes = 'is-active'
      }

      crumbs.push(crumb)
    })

    return crumbs
  }
export default function({ app, route, store, redirect }) {
    if (process.client) {
        if (!app.$storage.getItem('auth')) {
            redirect('/auth/login')
        }
    }
    // console.info(crumbs(route))
}