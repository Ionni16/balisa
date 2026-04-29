# Balisa — ecommerce premium

## Avvio locale

```bash
npm install
npm run dev
```

Apri `http://localhost:3000`.

## Configurazione `.env.local`

Copia `.env.example` in `.env.local` e inserisci:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TUO-PROGETTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_SECRET_KEY=una_password_sicura
```

Stripe serve per il checkout reale. Puoi configurarlo dopo.

## Supabase

1. Apri Supabase.
2. Vai su SQL Editor.
3. Incolla ed esegui `supabase/schema.sql`.
4. Vai su Storage.
5. Crea un bucket chiamato `products`.
6. Impostalo come Public bucket.
7. Vai su `/admin`.
8. Inserisci `ADMIN_SECRET_KEY`.
9. Carica prodotti, hero image, immagini homepage e testi.

## Immagini che non si vedono su mobile / Vercel

Questa versione usa `<img>` con fallback invece del Next Image Optimizer per le immagini caricate da admin. Questo evita errori tipo `/_next/image 402` e nasconde i broken-image icon sostituendoli con un placeholder pulito.

## Personalizzazione colori

Da `/admin/settings`, sezione **Colors**, puoi modificare:
- announcement bar
- testo announcement
- header
- background pagina
- background card prodotto
- footer
- bottoni
- testo principale
- overlay hero
