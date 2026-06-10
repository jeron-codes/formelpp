// ── pix2tex LaTeX OCR via HuggingFace Space (Gradio 4 API) ───────────────
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SPACE = 'https://lukbl-latex-ocr.hf.space'

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    const { base64, mimeType } = await req.json()
    if (!base64 || !mimeType) throw new Error('base64 und mimeType erforderlich')

    const hfToken = Deno.env.get('HF_TOKEN')
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (hfToken) headers['Authorization'] = `Bearer ${hfToken}`

    // ── Schritt 1: Prediction einreichen ─────────────────────────────────
    const submitResp = await fetch(`${SPACE}/gradio_api/call/predict`, {
      method:  'POST',
      headers,
      body:    JSON.stringify({ data: [`data:${mimeType};base64,${base64}`] }),
    })

    if (!submitResp.ok) {
      const txt = await submitResp.text().catch(() => '')
      throw new Error(`pix2tex submit HTTP ${submitResp.status}: ${txt.slice(0, 120)}`)
    }

    const { event_id } = await submitResp.json()
    if (!event_id) throw new Error('Kein event_id von pix2tex')

    // ── Schritt 2: Ergebnis via SSE-Stream lesen ──────────────────────────
    const resultResp = await fetch(
      `${SPACE}/gradio_api/call/predict/${event_id}`,
      { headers: hfToken ? { 'Authorization': `Bearer ${hfToken}` } : {} }
    )

    if (!resultResp.ok) {
      throw new Error(`pix2tex result HTTP ${resultResp.status}`)
    }

    const reader  = resultResp.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let latex  = ''

    outer: while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      for (const line of buffer.split('\n')) {
        if (!line.startsWith('data: ')) continue
        const raw = line.slice(6).trim()
        if (!raw || raw === 'null') continue
        try {
          const parsed = JSON.parse(raw)
          // Format A: ["latex string"]
          if (Array.isArray(parsed) && typeof parsed[0] === 'string') {
            latex = parsed[0].trim(); break outer
          }
          // Format B: {"output":{"data":["latex string"]}}
          if (parsed?.output?.data?.[0]) {
            latex = String(parsed.output.data[0]).trim(); break outer
          }
          // Format C: {"data":["latex string"]}
          if (parsed?.data?.[0]) {
            latex = String(parsed.data[0]).trim(); break outer
          }
        } catch { /* ignorieren */ }
      }
      // Buffer auf letzte unvollständige Zeile kürzen
      const idx = buffer.lastIndexOf('\n')
      if (idx >= 0) buffer = buffer.slice(idx + 1)
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
