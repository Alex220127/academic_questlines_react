const errors = {
  user_not_found: 'Email ou senha incorretos'
}

export default function getErrorMessage (code) {
  return errors[code] || 'Erro desconhecido'
}
