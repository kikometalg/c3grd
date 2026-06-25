// Função serverless (roda no servidor da Vercel, NÃO no navegador).
// Envia o e-mail de aceite via Resend. A chave secreta fica protegida
// nas variáveis de ambiente da Vercel (RESEND_API_KEY).

export default async function handler(req, res) {
  // CORS básico
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ erro: "Método não permitido" });

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const REMETENTE = process.env.EMAIL_REMETENTE || "C3GRD <onboarding@resend.dev>";

  if (!RESEND_API_KEY) {
    return res.status(500).json({ erro: "RESEND_API_KEY não configurada na Vercel." });
  }

  try {
    const { para, nomeDestinatario, grdNumero, titulo, emissor, linkAceite } = req.body || {};
    if (!para || !linkAceite) {
      return res.status(400).json({ erro: "Dados incompletos (para, linkAceite)." });
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: #1E3A5F; padding: 24px; text-align: center;">
          <div style="color: #ffffff; font-size: 22px; font-weight: bold; letter-spacing: 1px;">C3 ENGENHARIA &amp; SOLUÇÕES</div>
          <div style="color: #93c5fd; font-size: 13px; margin-top: 4px;">Gestão de Registro de Documentos</div>
        </div>
        <div style="padding: 28px;">
          <p style="color: #1f2937; font-size: 15px;">Olá, <strong>${nomeDestinatario || "destinatário"}</strong>,</p>
          <p style="color: #374151; font-size: 14px; line-height: 1.6;">
            Você recebeu um documento para análise e aceite:
          </p>
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 18px; margin: 18px 0;">
            <div style="font-size: 18px; font-weight: bold; color: #1E3A5F;">${grdNumero || "GRD"}</div>
            <div style="color: #374151; margin-top: 4px;">${titulo || ""}</div>
            <div style="color: #6b7280; font-size: 13px; margin-top: 8px;">Emitido por: ${emissor || "—"}</div>
          </div>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${linkAceite}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 15px;">
              ✅ Acessar e Aceitar Documento
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 12px; line-height: 1.6;">
            Ao clicar, você poderá visualizar o documento e registrar seu aceite ou recusa. Este acesso fica registrado para fins de auditoria.
          </p>
        </div>
        <div style="background: #f9fafb; padding: 16px; text-align: center; color: #9ca3af; font-size: 11px;">
          C3 Engenharia &amp; Soluções · Documento controlado pelo sistema C3GRD
        </div>
      </div>
    `;

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: REMETENTE,
        to: [para],
        subject: `[C3GRD] ${grdNumero || "Documento"} — Aceite necessário`,
        html,
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      return res.status(resp.status).json({ erro: data?.message || "Falha no envio", detalhe: data });
    }
    return res.status(200).json({ ok: true, id: data?.id });
  } catch (e) {
    return res.status(500).json({ erro: e.message || String(e) });
  }
}
