-- ════════════════════════════════════════════════════════════════════════════
-- C3GRD — Dados iniciais (sua equipe). Opcional, mas recomendado para começar.
-- Rode no SQL Editor depois das políticas. Você pode editar nomes/e-mails depois
-- pela própria interface do C3GRD.
-- ════════════════════════════════════════════════════════════════════════════

insert into colaboradores (nome, matricula, cargo, email, ativo) values
  ('Gledson de Jesus', 'CQ-001', 'Técnico de Qualidade', 'gledson@c3engenharia.com.br', true),
  ('Izabella Batista', 'CQ-002', 'Técnica de Qualidade', 'izabella@c3engenharia.com.br', true),
  ('Ana Luiza', 'DOC-001', 'Técnica de Documentação', 'analuiza@c3engenharia.com.br', true)
on conflict do nothing;

insert into destinatarios (nome, email) values
  ('Fiscal Petrobras', 'fiscal@petrobras.com.br'),
  ('Coordenador QC', 'coordenador@c3engenharia.com.br')
on conflict do nothing;
