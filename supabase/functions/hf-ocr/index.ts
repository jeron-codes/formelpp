// ── HuggingFace OCR Proxy ────────────────────────────────────────────
// HF_TOKEN wird NUR hier als Supabase-Secret gespeichert —
// er erscheint NIEMALS im Frontend-Code.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Open-Source Modell: im2latex (MIT-Lizenz, via HuggingFace)
const MODEL  = 'naver-clova-ix/donut-base-finetuned-im2latex-140k';
const HF_API = `https://api-inference.huggingface.co/models/${MODEL}`;

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    // Token aus Supabase-Secrets (niemals im Frontend sichtbar)
    const hfToken = Deno.env.get('HF_TOKEN')
    if (!hfToken) {
      return new Response(
        JSON.stringify({ error: 'HF_TOKEN nicht konfiguriert (Supabase Secret fehlt)' }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
      )
    }

    // Bild als base64 vom Frontend empfangen
    const { base64, mimeType } = await req.json()
    if (!base64 || !mimeType) throw new Error('base64 und mimeType erforderlich')

    // base64 → Binary
    const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0))

    // Bis zu 3 Versuche (Kaltstart des Modells kann 20-30s dauern)
    let latex = ''
    for (let attempt = 0; attempt < 3; attempt++) {
      const resp = await fetch(HF_API, {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type':  mimeType,
        },
        body: binary,
      })

      if (resp.status === 503) {
        const data = await resp.json().catch(() => ({}))
        const wait = Math.ceil((data.estimated_time || 20) * 1000)
        await new Promise(r => setTimeout(r, wait))
        continue
      }

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err?.error || `HuggingFace HTTP ${resp.status}`)
      }

      const result = await resp.json()

      // Verschiedene Antwortformate abfangen
      if (Array.isArray(result) && result[0]?.generated_text) latex = result[0].generated_text
      else if (result?.generated_text) latex = result.generated_text
      else if (typeof result === 'string') latex = result

      // Donut-Tags entfernen: <s_answer>...</s_answer>
      latex = latex.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
      break
    }

    if (!latex) throw new Error('Keine Formel erkannt — versuche ein klareres Foto')

    return new Response(
      JSON.stringify({ latex }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unbekannter Fehler'
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }
})
