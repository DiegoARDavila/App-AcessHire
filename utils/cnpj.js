export function formatCNPJ(value) {
  const digits = value.replace(/\D/g, '').slice(0, 14);

  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function isValidCNPJ(value) {
  const cnpj = value.replace(/\D/g, '');

  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false; // rejeita tipo "11111111111111"

  function calcularDigito(cnpjParcial, pesos) {
    const soma = cnpjParcial
      .split('')
      .reduce((acc, digito, i) => acc + parseInt(digito) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  }

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const digito1 = calcularDigito(cnpj.slice(0, 12), pesos1);
  const digito2 = calcularDigito(cnpj.slice(0, 12) + digito1, pesos2);

  return cnpj.slice(-2) === `${digito1}${digito2}`;
}