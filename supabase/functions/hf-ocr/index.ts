// ── pix2tex LaTeX OCR via HuggingFace Space ─────────────────────────────
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// pix2tex Gradio Space API
const PIX2TEX_API = 'https://lukbl-latex-ocr.hf.space/run/predict'

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    const { base64, mimeType } = await req.json()
    if (!base64 || !mimeType) throw new Error('base64 und mimeType erforderlich')

    // Optionaler HF-Token für schnellere Anfragen
    const hfToken = Deno.env.get('HF_TOKEN')
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (hfToken) headers['Authorization'] = `Bearer ${hfToken}`

    let latex = ''

    // Bis zu 3 Versuche (Space kann schlafen und braucht ~20s zum Aufwachen)
    for (let attempt = 0; attempt < 3; attempt++) {
      const resp = await fetch(PIX2TEX_API, {
        method:  'POST',
        headers,
        body:    JSON.stringify({
          data: [`data:${mimeType};base64,${base64}`]
        }),
      })

      if (resp.status === 503) {
        await new Promise(r => setTimeout(r, 12000))
        continue
      }

      if (!resp.ok) {
        const txt = await resp.text().catch(() => '')
        throw new Error(`pix2tex HTTP ${resp.status}: ${txt.slice(0, 120)}`)
      }

      const data = await resp.json()
      // Gradio-Format: { data: ["latex string"] }
      if (Array.isArray(data?.data) && data.data[0]) {
        latex = String(data.data[0]).trim()
      }
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
