export function formatDataNascimento(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits
    .replace(/^(\d{2})(\d)/, '$1/$2')
    .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
}

export function isValidDataNascimento(value) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;

  const [, dia, mes, ano] = match.map(Number);
  const data = new Date(ano, mes - 1, dia);
  const dataValida = data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
  if (!dataValida) return false;

  const hoje = new Date();
  const idade = hoje.getFullYear() - ano;
  return idade >= 14 && idade <= 120; // ajusta a idade mínima conforme a regra do seu app
}