// Remove caracteres não numéricos
const cleanNumber = (value: string) => value.replace(/\D/g, '');

export const isValidCPF = (cpf: string) => {
    const numbers = cleanNumber(cpf);
    
    if (numbers.length !== 11) return false;
    
    // Verifica CPFs com todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false;
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.charAt(10))) return false;
    
    return true;
};

export const isValidCNPJ = (cnpj: string) => {
    const numbers = cleanNumber(cnpj);
    
    if (numbers.length !== 14) return false;
    
    // Verifica CNPJs com todos os dígitos iguais
    if (/^(\d)\1{13}$/.test(numbers)) return false;
    
    // Validação do primeiro dígito verificador
    let size = 12;
    let numbers_array = numbers.substring(0, size);
    let digits = numbers.substring(size);
    let sum = 0;
    let pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers_array.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;
    
    // Validação do segundo dígito verificador
    size = 13;
    numbers_array = numbers.substring(0, size);
    sum = 0;
    pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers_array.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;
    
    return true;
};

export const isValidPhone = (phone: string) => {
    const numbers = cleanNumber(phone);
    // Aceita formato (XX)XXXXX-XXXX (com ou sem DDD)
    return numbers.length >= 10 && numbers.length <= 11;
};

// Formata o telefone como (XX)XXXXX-XXXX
export const formatPhone = (phone: string) => {
    const numbers = cleanNumber(phone);
    if (numbers.length === 11) {
        return `(${numbers.slice(0,2)})${numbers.slice(2,7)}-${numbers.slice(7)}`;
    } else if (numbers.length === 10) {
        return `(${numbers.slice(0,2)})${numbers.slice(2,6)}-${numbers.slice(6)}`;
    }
    return phone;
};

// Formata o CPF como XXX.XXX.XXX-XX
export const formatCPF = (cpf: string) => {
    const numbers = cleanNumber(cpf);
    if (numbers.length === 11) {
        return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
};

// Formata o CNPJ como XX.XXX.XXX/XXXX-XX
export const formatCNPJ = (cnpj: string) => {
    const numbers = cleanNumber(cnpj);
    if (numbers.length === 14) {
        return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return cnpj;
};