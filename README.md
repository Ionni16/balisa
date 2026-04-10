# 🛍️ BALISA — E-commerce Artigianale

Sito e-commerce completo per il brand di borse artigianali BALISA.

## Stack Tecnologico

| Tecnologia | Scopo |
|------------|-------|
| **Next.js 14** | Frontend + API Routes |
| **Supabase** | Database (PostgreSQL) + Storage immagini + Auth |
| **Stripe** | Pagamenti online |
| **Vercel** | Hosting |
| **Tailwind CSS** | Stile |
| **Zustand** | Carrello (stato globale) |
| **Framer Motion** | Animazioni |

---

## 🚀 Setup Passo per Passo

### 1. Prerequisiti

- Node.js 18+ installato
- Account [Supabase](https://supabase.com) (gratuito)
- Account [Stripe](https://stripe.com) (gratuito per iniziare)
- Account [Vercel](https://vercel.com) (gratuito)

---

### 2. Clona e installa

```bash
# Installa dipendenze
npm install

# Copia il file di variabili d'ambiente
cp .env.example .env.local
```

---

### 3. Configura Supabase

1. Vai su [supabase.com](https://supabase.com) → **New Project**
2. Scegli un nome (es. `balisa`) e una password per il DB
3. Vai in **Settings → API** e copia:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
4. Vai in **SQL Editor** e incolla tutto il contenuto di `supabase/schema.sql`
5. Clicca **Run** → il database è pronto!

---

### 4. Configura Stripe

1. Vai su [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Developers → API Keys** → copia la chiave pubblica e segreta
3. **Webhooks → Add endpoint**:
   - URL: `https://tuo-sito.vercel.app/api/stripe/webhook`
   - Evento: `checkout.session.completed`
   - Copia il **Signing Secret** → `STRIPE_WEBHOOK_SECRET`

---

### 5. Chiave Admin

Genera una chiave sicura per il pannello admin:

```bash
# Su Mac/Linux:
openssl rand -hex 32

# Oppure usa qualsiasi stringa lunga e sicura
```

Mettila in `.env.local` come `ADMIN_SECRET_KEY`.

---

### 6. Test locale

```bash
npm run dev
```

- Sito: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

Per testare i pagamenti Stripe in locale:
```bash
# Installa Stripe CLI
brew install stripe/stripe-cli/stripe

# Login e ascolta i webhook
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

### 7. Deploy su Vercel

1. Vai su [vercel.com](https://vercel.com) → **New Project**
2. Collega il tuo repository GitHub
3. In **Environment Variables**, aggiungi tutte le variabili da `.env.example`
4. Clicca **Deploy** → in 2 minuti è online! 🎉

---

## 📁 Struttura File

```
balisa/
├── app/
│   ├── page.tsx              # Homepage
│   ├── shop/page.tsx         # Lista prodotti
│   ├── product/[slug]/       # Scheda prodotto
│   ├── checkout/             # Checkout + Success
│   ├── admin/                # 🔒 Pannello admin
│   │   ├── page.tsx          # Dashboard
│   │   ├── products/         # Gestione prodotti
│   │   └── orders/           # Gestione ordini
│   └── api/
│       ├── products/         # CRUD prodotti
│       ├── orders/           # Gestione ordini
│       ├── upload/           # Upload immagini
│       └── stripe/           # Checkout + Webhook
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── CartDrawer.tsx
├── lib/
│   ├── supabase.ts           # Client Supabase
│   ├── stripe.ts             # Client Stripe
│   ├── store.ts              # Carrello (Zustand)
│   └── types.ts              # Tipi TypeScript
└── supabase/
    └── schema.sql            # Schema database
```

---

## 🔒 Pannello Admin

Vai su `/admin` e inserisci la tua `ADMIN_SECRET_KEY`.

**Funzionalità:**
- 📊 Dashboard con KPI (fatturato, ordini, stock)
- 📦 Gestione prodotti (CRUD completo + upload immagini)
- 🛍️ Gestione ordini (visualizza, filtra, aggiorna stato)

---

## 🎨 Personalizzazione

- **Logo/Brand:** Modifica `components/Navbar.tsx` e `components/Footer.tsx`
- **Colori:** Modifica `tailwind.config.ts`
- **Testi homepage:** Modifica `app/page.tsx`
- **Instagram:** Cerca `yourbalisa` e sostituisci con il tuo handle

---

## 🆘 Problemi comuni

**"Invalid signature" su webhook Stripe**
→ Assicurati che `STRIPE_WEBHOOK_SECRET` sia quello del tuo endpoint (non il signing secret generico).

**Immagini non caricate**
→ Verifica che il bucket `products` in Supabase sia **public**.

**Admin non accessibile**
→ Verifica che `ADMIN_SECRET_KEY` sia uguale sia in `.env.local` che in Vercel.
