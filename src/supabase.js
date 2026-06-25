import { createClient } from "@supabase/supabase-js";

// Configuração do Supabase (projeto C3GRD).
// Em produção na Vercel, estes valores vêm das variáveis de ambiente.
// O fallback abaixo é a chave PÚBLICA (publishable) — segura para o navegador.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://jeekwlmqxkxdjdwaiaeu.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || "sb_publishable_fHXMrk5Vp8TFH8QP6SNcbw_V98OjSgY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Numeração sequencial infinita (via função do banco) ──────────────────────
export async function proximoGRD() {
  const { data, error } = await supabase.rpc("proximo_grd");
  if (error) throw error;
  return data; // ex.: "GRD-00001"
}

// ─── Colaboradores ────────────────────────────────────────────────────────────
export async function listarColaboradores() {
  const { data, error } = await supabase.from("colaboradores").select("*").order("nome");
  if (error) throw error;
  return data || [];
}
export async function salvarColaborador(c) {
  if (c.id) {
    const { error } = await supabase.from("colaboradores").update(c).eq("id", c.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("colaboradores").insert(c);
    if (error) throw error;
  }
}

// ─── Destinatários ────────────────────────────────────────────────────────────
export async function listarDestinatarios() {
  const { data, error } = await supabase.from("destinatarios").select("*").order("nome");
  if (error) throw error;
  return data || [];
}
export async function salvarDestinatario(d) {
  if (d.id) {
    const { error } = await supabase.from("destinatarios").update(d).eq("id", d.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("destinatarios").insert(d);
    if (error) throw error;
  }
}
export async function removerDestinatario(id) {
  const { error } = await supabase.from("destinatarios").delete().eq("id", id);
  if (error) throw error;
}

// ─── Documentos GRD ───────────────────────────────────────────────────────────
export async function listarGRDs() {
  const { data, error } = await supabase.from("grds").select("*").order("criado_em", { ascending: false });
  if (error) throw error;
  return data || [];
}
export async function inserirGRDs(linhas) {
  const { error } = await supabase.from("grds").insert(linhas);
  if (error) throw error;
}
export async function removerGRD(id) {
  const { error } = await supabase.from("grds").delete().eq("id", id);
  if (error) throw error;
}
export async function atualizarAceite(token, status, obs) {
  const { error } = await supabase.from("grds")
    .update({ status, respondido_em: new Date().toISOString(), resposta_obs: obs })
    .eq("token", token);
  if (error) throw error;
}
export async function registrarAbertura(token) {
  const { error } = await supabase.from("grds")
    .update({ aberto_em: new Date().toISOString() })
    .eq("token", token).is("aberto_em", null);
  if (error) throw error;
}
export async function buscarPorToken(token) {
  const { data, error } = await supabase.from("grds").select("*").eq("token", token).maybeSingle();
  if (error) throw error;
  return data;
}

// ─── Storage (PDFs) ───────────────────────────────────────────────────────────
export async function enviarPDF(path, blob) {
  const { error } = await supabase.storage.from("grds").upload(path, blob, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (error) throw error;
  return path;
}
export async function urlAssinada(path, segundos = 3600) {
  const { data, error } = await supabase.storage.from("grds").createSignedUrl(path, segundos);
  if (error) throw error;
  return data.signedUrl;
}

// ─── Log de atividades ────────────────────────────────────────────────────────
export async function registrarLogDB(log) {
  const { error } = await supabase.from("logs").insert(log);
  if (error) console.warn("Falha ao registrar log:", error.message);
}
export async function listarLogs() {
  const { data, error } = await supabase.from("logs").select("*").order("em", { ascending: false }).limit(500);
  if (error) throw error;
  return data || [];
}

// ─── Autenticação nativa (Supabase Auth) ──────────────────────────────────────
export async function entrar(email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) throw error;
  return data.user;
}
export async function sair() {
  await supabase.auth.signOut();
}
export async function usuarioAtual() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}
