export const getNavElements = (user) => {
  if (user.scope === 'admin') {
    return [
      {
        className: 'nav-item',
        text: 'Home',
        goto: '/home'
      },
      {
        className: 'nav-item',
        text: 'Minhas trilhas',
        goto: '/questlines'
      },
      {
        className: 'nav-item',
        text: 'Sair',
        goto: '/'
      }
    ]
  }

  return [
    {
      className: 'nav-item',
      text: 'Minhas trilhas',
      goto: '/home'
    },
    {
      className: 'nav-item',
      text: 'Loja',
      goto: '/store'
    },
    {
      className: 'nav-item',
      text: 'Inventário',
      goto: '/inventory'
    },
    {
      className: 'nav-item',
      text: 'Sair',
      goto: '/'
    }
  ]
}
