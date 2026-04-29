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

## Admin

Da `/admin/settings` puoi modificare:
- logo
- hero image
- announcement bar
- titolo homepage
- immagini sezione Made with purpose
- testo contatti
- shipping
- care instructions
- social

Da `/admin/products` puoi modificare prodotti, prezzo, colori, stock, immagini e featured.


## Se le modifiche admin non si vedono subito

Questa versione usa `cache: no-store` e API dinamiche. Dopo aver premuto **Salva tutto** in `/admin/settings`, torna sulla homepage e fai refresh.
Se stai usando Vercel, non serve rebuild: i dati vengono letti da Supabase a runtime.
