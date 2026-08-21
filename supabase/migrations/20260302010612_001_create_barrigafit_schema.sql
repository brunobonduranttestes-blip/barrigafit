/*
  # BARRIGAFIT Database Schema

  ## New Tables
  1. `usuarios` - User profiles and authentication
     - `id` (uuid, primary key)
     - `nome` (text) - User display name
     - `email` (text, unique) - User email
     - `codigo_acesso` (text, unique) - 8-character access code
     - `ativo` (boolean) - Active status
     - `perfil_foto` (text) - Profile photo URL
     - `objetivo` (text) - Main goal
     - `nivel` (text) - Experience level
     - `is_admin` (boolean) - Admin flag
     - `created_at` (timestamp)

  2. `progresso_treino` - Daily training progress
     - `id` (uuid, primary key)
     - `usuario_id` (uuid, foreign key)
     - `dia_desafio` (integer) - Day 1-21
     - `data_conclusao` (date)
     - `duracao_segundos` (integer)
     - `concluido` (boolean)
     - `created_at` (timestamp)

  3. `medidas` - Body measurements tracking
     - `id` (uuid, primary key)
     - `usuario_id` (uuid, foreign key)
     - `data_registro` (date)
     - `peso` (decimal)
     - `cintura` (integer)
     - `quadril` (integer)
     - `abdomen` (integer)
     - `created_at` (timestamp)

  4. `videos_exercicios` - Exercise video management
     - `id` (uuid, primary key)
     - `exercicio_nome` (text)
     - `url_video` (text)
     - `url_thumbnail` (text)
     - `ativo` (boolean)
     - `updated_at` (timestamp)

  ## Security
  - Enable RLS on all tables
  - Add policies for user data access
  - Admin-only policies for management tables
*/

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  codigo_acesso TEXT UNIQUE NOT NULL,
  ativo BOOLEAN DEFAULT true,
  perfil_foto TEXT,
  objetivo TEXT DEFAULT 'emagrecer',
  nivel TEXT DEFAULT 'iniciante',
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS progresso_treino (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  dia_desafio INTEGER NOT NULL,
  data_conclusao DATE NOT NULL,
  duracao_segundos INTEGER,
  concluido BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(usuario_id, dia_desafio, data_conclusao)
);

CREATE TABLE IF NOT EXISTS medidas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  data_registro DATE NOT NULL,
  peso DECIMAL(5,2),
  cintura INTEGER,
  quadril INTEGER,
  abdomen INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(usuario_id, data_registro)
);

CREATE TABLE IF NOT EXISTS videos_exercicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercicio_nome TEXT NOT NULL UNIQUE,
  url_video TEXT,
  url_thumbnail TEXT,
  ativo BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE progresso_treino ENABLE ROW LEVEL SECURITY;
ALTER TABLE medidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos_exercicios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data"
  ON usuarios FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data"
  ON usuarios FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all users"
  ON usuarios FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE is_admin = true
      AND auth.uid()::text = id::text
    )
  );

CREATE POLICY "Users can view their own progress"
  ON progresso_treino FOR SELECT
  TO authenticated
  USING (auth.uid()::text = usuario_id::text);

CREATE POLICY "Users can insert their own progress"
  ON progresso_treino FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = usuario_id::text);

CREATE POLICY "Users can update their own progress"
  ON progresso_treino FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = usuario_id::text)
  WITH CHECK (auth.uid()::text = usuario_id::text);

CREATE POLICY "Users can view their own measurements"
  ON medidas FOR SELECT
  TO authenticated
  USING (auth.uid()::text = usuario_id::text);

CREATE POLICY "Users can insert their own measurements"
  ON medidas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = usuario_id::text);

CREATE POLICY "Anyone can view exercise videos"
  ON videos_exercicios FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage exercise videos"
  ON videos_exercicios FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE is_admin = true
      AND auth.uid()::text = id::text
    )
  );

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_codigo_acesso ON usuarios(codigo_acesso);
CREATE INDEX idx_progresso_usuario ON progresso_treino(usuario_id);
CREATE INDEX idx_progresso_data ON progresso_treino(data_conclusao);
CREATE INDEX idx_medidas_usuario ON medidas(usuario_id);
CREATE INDEX idx_medidas_data ON medidas(data_registro);
CREATE INDEX idx_videos_nome ON videos_exercicios(exercicio_nome);
