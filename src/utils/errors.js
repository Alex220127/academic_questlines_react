const errors = {
  email_in_use: 'O email utilizado já está em uso',
  user_not_found: 'Email ou senha incorretos',
  already_registered: 'Você já está registrado nessa trilha',
  item_already_in_inventory: 'Você já resgatou esse item'
}

export default function getErrorMessage (code) {
  return errors[code] || 'Erro desconhecido'
}
