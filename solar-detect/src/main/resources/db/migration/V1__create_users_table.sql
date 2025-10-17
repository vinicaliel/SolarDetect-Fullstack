-- Create table: users (unified table for students and companies)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('STUDENT', 'COMPANY')),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    document_number VARCHAR(20) NOT NULL UNIQUE -- CPF or CNPJ
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_document ON users (document_number);
CREATE INDEX IF NOT EXISTS idx_users_type ON users (user_type);

-- Optional: Migrate existing data from old tables (if needed)
-- This is commented out to avoid conflicts, uncomment if you want to migrate existing data
/*
INSERT INTO users (email, password, user_type, name, phone, address, document_number)
SELECT 
    email, 
    senha, 
    'STUDENT', 
    nome_completo, 
    telefone, 
    endereco, 
    cpf
FROM estudantes
WHERE NOT EXISTS (SELECT 1 FROM users WHERE users.email = estudantes.email);

INSERT INTO users (email, password, user_type, name, phone, address, document_number)
SELECT 
    email_corporativo, 
    senha, 
    'COMPANY', 
    nome_empresa, 
    telefone, 
    endereco, 
    cnpj
FROM empresas
WHERE NOT EXISTS (SELECT 1 FROM users WHERE users.email = empresas.email_corporativo);
*/
