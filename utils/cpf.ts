export const isValidCpf = (rawCpf: string) => {
	if (typeof rawCpf !== "string") return false;
	const cpf = rawCpf.replace(/[^\d]+/g, "");
	if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
	const cpfDigits = cpf.split("").map((el) => +el);
	const rest = (count: number): number => {
		return (
			((cpfDigits
				.slice(0, count - 12)
				.reduce((soma, el, index) => soma + el * (count - index), 0) *
				10) %
				11) %
			10
		);
	};
	return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10];
};

export const isValidCNPJ = (cnpj: string): boolean => {
	if (
			!cnpj ||
			cnpj.length !== 14 ||
			/^(.)\1+$/.test(cnpj) // Check for repeated digits
	) {
			return false;
	}

	const calculateDigit = (partialCnpj: string, length: number): number => {
			let sum = 0;
			let pos = length - 7;

			for (let i = length; i >= 1; i--) {
					sum += +partialCnpj.charAt(length - i) * pos--;
					if (pos < 2) {
							pos = 9;
					}
			}

			const result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
			return result;
	};

	const tamanho = cnpj.length - 2;
	const numeros = cnpj.substring(0, tamanho);
	const digitos = cnpj.substring(tamanho);

	const primeiroDigito = calculateDigit(numeros, tamanho);
	if (primeiroDigito !== +digitos.charAt(0)) {
			return false;
	}

	const novoTamanho = tamanho + 1;
	const novosNumeros = cnpj.substring(0, novoTamanho);

	const segundoDigito = calculateDigit(novosNumeros, novoTamanho);
	if (segundoDigito !== +digitos.charAt(1)) {
			return false;
	}

	return true;
};


// export const isValidCNPJ = (cnpj: string) => {
// 	if (
// 		!cnpj ||
// 		cnpj.length != 14 ||
// 		cnpj == "00000000000000" ||
// 		cnpj == "11111111111111" ||
// 		cnpj == "22222222222222" ||
// 		cnpj == "33333333333333" ||
// 		cnpj == "44444444444444" ||
// 		cnpj == "55555555555555" ||
// 		cnpj == "66666666666666" ||
// 		cnpj == "77777777777777" ||
// 		cnpj == "88888888888888" ||
// 		cnpj == "99999999999999"
// 	)
// 		return false;
// 	var tamanho = cnpj.length - 2;
// 	var numeros = cnpj.substring(0, tamanho);
// 	var digitos = cnpj.substring(tamanho);
// 	var soma = 0;
// 	var pos = tamanho - 7;
// 	for (var i = tamanho; i >= 1; i--) {
// 		soma += numeros.charAt(tamanho - i) * pos--;
// 		if (pos < 2) pos = 9;
// 	}
// 	var resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
// 	if (resultado != digitos.charAt(0)) return false;
// 	tamanho = tamanho + 1;
// 	numeros = cnpj.substring(0, tamanho);
// 	soma = 0;
// 	pos = tamanho - 7;
// 	for (var i = tamanho; i >= 1; i--) {
// 		soma += numeros.charAt(tamanho - i) * pos--;
// 		if (pos < 2) pos = 9;
// 	}
// 	resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
// 	if (resultado != digitos.charAt(1)) return false;
// 	return true;
// };
