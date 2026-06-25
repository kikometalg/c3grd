-- ════════════════════════════════════════════════════════════════════════════
-- C3GRD — Políticas de acesso (RLS)
-- Rode este bloco no SQL Editor do Supabase APÓS o SQL da Fase 1.
-- Ele libera leitura/escrita para a chave pública nesta etapa (login simples).
-- Quando migrarmos para o login nativo (etapa seguinte), apertamos estas regras.
-- ════════════════════════════════════════════════════════════════════════════

-- Habilita RLS nas tabelas
alter table colaboradores enable row level security;
alter table destinatarios enable row level security;
alter table grds enable row level security;
alter table logs enable row level security;

-- Políticas permissivas (etapa atual: dados conectados, login simples)
create policy "c3grd_colab_all" on colaboradores for all using (true) with check (true);
create policy "c3grd_dest_all"  on destinatarios for all using (true) with check (true);
create policy "c3grd_grds_all"  on grds for all using (true) with check (true);
create policy "c3grd_logs_all"  on logs for all using (true) with check (true);

-- ── Storage: permitir upload e leitura no bucket 'grds' ──────────────────────
create policy "c3grd_storage_insert" on storage.objects
  for insert with check (bucket_id = 'grds');
create policy "c3grd_storage_select" on storage.objects
  for select using (bucket_id = 'grds');
create policy "c3grd_storage_update" on storage.objects
  for update using (bucket_id = 'grds');
