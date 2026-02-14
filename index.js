import express from 'express'
import helmet from 'helmet'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url';
import OpenAI from "openai";
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const port = 3000

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const MAGIC_SECRET = process.env.MAGIC_SECRET
const IS_DEV = process.env.NODE_ENV === 'dev';

const client = new OpenAI({apiKey: OPENAI_API_KEY})
const PROMPT = `Sos un escritor experto en cartas románticas modernas, con gran sensibilidad emocional y dominio del lenguaje poético contemporáneo.

Escribís como un hombre argentino (porteño), profundamente enamorado, con madurez emocional, seguridad afectiva y un toque de humor sutil e inteligente. La voz debe sentirse auténtica, íntima y real, sin exageraciones artificiales.

OBJETIVO:
Escribir una carta de amor profunda, sincera y emocional para mi novia.

INFORMACIÓN SOBRE ELLA:

Se llama Luana

Es médica y va a comenzar la especialidad en anestesiología

Le gusta jugar al básquet

Ama la playa y el mar

Le encantan las hamburguesas y la comida chatarra

Le gusta tomar coca

Tiene un border collie de 4 años llamado Tomi (también le dicen Border) con quien juega

Disfruta mucho dormir

Le gusta el humor negro (aunque yo lo odie)

Le encanta viajar

Viajamos juntos a San Bernardo y Mar del Plata

En marzo viajamos a Buzios, Brasil

INSTRUCCIONES:

Escribir en primera persona (como su novio).

Integrar de forma natural al menos 4 de los elementos mencionados.

Mantener un tono poético moderno con humor sutil.

Evitar clichés románticos (no usar frases como “eres mi sol”, “mi princesa”, etc.).

Que suene íntima, personalizada y genuina.

Extensión total entre 50 y 100 palabras.

Cerrar con una frase poderosa y emotiva que deje impacto.

FORMATO DE RESPUESTA OBLIGATORIO:
Responder exclusivamente en formato JSON válido, sin texto adicional fuera del JSON, con la siguiente estructura:

{
"header": "Título breve y creativo para la carta",
"body": "Contenido principal de la carta (50-100 palabras)",
"footer": "Frase final poderosa y emotiva"
}`

app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64')
  next()
})

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        (req, res) => `'nonce-${res.locals.nonce}'`,  // ← Usar nonce
        "https://cdn.jsdelivr.net"
      ],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      mediaSrc: ["'self'", "data:", "blob:", "https:"],
      formAction: ["'self'"]
    },
  })
)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index', { nonce: res.locals.nonce })
})

app.get('/love-letter', async(req, res) => {
    try{
        if(MAGIC_SECRET === req.query.code){
            const response = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: PROMPT
                    }
                ],
                response_format: {
                    type: "json_object"
                },
                temperature: 0.9
            })
        
            const loveLetterData = JSON.parse(response.choices[0].message.content);
            console.log("Carta generada:", loveLetterData.header);

            console.log("OK")

            res.render('success', { 
                ...loveLetterData,
                nonce: res.locals.nonce 
            })
        }else{
          res.render('error', { nonce: res.locals.nonce })
        }
    }catch(e){
        console.error(e)
        res.render('error', { nonce: res.locals.nonce })
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
