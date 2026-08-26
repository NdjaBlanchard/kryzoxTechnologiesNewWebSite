/**
 * server.ts — Point d'entrée Node.js pour Hostinger
 *
 * Lance le serveur Hono avec @hono/node-server sur le port
 * défini par la variable d'environnement PORT (Hostinger le fixe
 * automatiquement via hPanel) ou 3000 en local.
 *
 * Démarrage : node dist-server/server.js
 */
import { serve } from '@hono/node-server'
import app from './index.js'

const port = Number(process.env.PORT) || 3000

serve(
  {
    fetch: app.fetch,
    port,
    hostname: '0.0.0.0',
  },
  (info) => {
    console.log(`✅ KryzOx Technologies — serveur démarré sur http://localhost:${info.port}`)
  }
)
