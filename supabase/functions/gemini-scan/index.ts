// ── Gemini Vision Proxy ─────────────────────────────────────────────
// Der GEMINI_API_KEY wird NUR hier auf dem Server als Supabase-Secret
// gespeichert — er erscheint niemals im Frontend-Code.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PROMPT = `Analysiere die Formel in diesem Bild.
Antworte NUR mit einem JSON-Objekt (kein Markdown, kein erklärender Text):
{
  "valid": true,
  "name": "Formelname auf Deutsch",
  "latex": "LaTeX-Code der Formel",
  "category": "Physik",
  "sub": "Unterkategorie z.B. Kinematik",
  "desc": "Kurze Beschreibung",
  "vars": { "symbol": { "name": "Bezeichnung", "unit": "Einheit" } }
}
Falls keine Formel erkennbar ist: { "valid": false }
Gültige Kategorien: Physik, Mathematik, Elektrotechnik`

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    // API-Key aus Supabase-Secrets (niemals im Frontend sichtbar)
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY nicht konfiguriert (Supabase Secret fehlt)' }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
      )
    }

    // Bild-Daten vom Frontend
    const { mimeType, base64 } = await req.json()
    if (!mimeType || !base64) throw new Error('mimeType und base64 erforderlich')

    // Gemini API aufrufen
    const geminiResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          contents: [{ parts: [
            { inline_data: { mime_type: mimeType, data: base64 } },
            { text: PROMPT }
          ]}],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1024 }
        })
      }
    )

    if (!geminiResp.ok) {
      const err = await geminiResp.json().catch(() => ({}))
      throw new Error(err?.error?.message || `Gemini HTTP ${geminiResp.status}`)
    }

    const data = await geminiResp.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!text) throw new Error('Leere Antwort von Gemini')

    const m = text.match(/\{[\s\S]*\}/)
    if (!m) throw new Error('Kein JSON in der Antwort')

    return new Response(
      JSON.stringify(JSON.parse(m[0])),
      { headers: { ...CORS, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unbekannter Fehler'
    return new Response(
      JSON.stringify({ valid: false, error: msg }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }
})
