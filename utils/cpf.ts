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
