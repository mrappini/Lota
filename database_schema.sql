-- Schema para o banco de dados do Supabase

-- Tabela de Status do Estacionamento
CREATE TABLE IF NOT EXISTS public.parking_status (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  status_texto text NOT NULL CHECK (status_texto IN ('green', 'yellow', 'red', 'none')),
  user_id text
);

-- Tabela de Status do Bandejão
CREATE TABLE IF NOT EXISTS public.cafeteria_status (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  status_texto text NOT NULL CHECK (status_texto IN ('green', 'yellow', 'red', 'none')),
  user_id text
);

-- Configuração de Row Level Security (RLS)

-- Estacionamento
ALTER TABLE public.parking_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública em parking_status" 
  ON public.parking_status FOR SELECT 
  USING (true);

CREATE POLICY "Permitir inserção anônima em parking_status" 
  ON public.parking_status FOR INSERT 
  WITH CHECK (true);

-- Bandejão
ALTER TABLE public.cafeteria_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública em cafeteria_status" 
  ON public.cafeteria_status FOR SELECT 
  USING (true);

CREATE POLICY "Permitir inserção anônima em cafeteria_status" 
  ON public.cafeteria_status FOR INSERT 
  WITH CHECK (true);
