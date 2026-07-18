export interface RequisitoPassword {
    label: string;
    cumplido: boolean;
}

export const evaluarPassword = (password: string): RequisitoPassword[] => [
    { label: "Mínimo 8 caracteres", cumplido: password.length >= 8 },
    { label: "Una letra mayúscula", cumplido: /[A-Z]/.test(password) },
    { label: "Una letra minúscula", cumplido: /[a-z]/.test(password) },
    { label: "Un número", cumplido: /[0-9]/.test(password) },
    { label: "Un carácter especial (!@#$...)", cumplido: /[^A-Za-z0-9]/.test(password) },
];

export const calcularFortaleza = (password: string): number => {
    if (!password) return 0;
    const requisitos = evaluarPassword(password);
    const cumplidos = requisitos.filter((r) => r.cumplido).length;
    return cumplidos / requisitos.length;
};