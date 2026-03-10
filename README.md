# portfolio-v2

Portfolio full-stack personnel — vitrine publique bilingue (FR/EN) avec back-office admin protégé par JWT.

## Stack

| Couche | Technologies |
|--------|-------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript, Tailwind CSS v4, Framer Motion |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable |
| Auth | bcryptjs + jsonwebtoken (cookie HttpOnly) |
| Mail | nodemailer (SMTP) |
| Données | fichiers JSON (`src/data/`) |

## Fonctionnalités

**Vitrine publique**
- Sections : Hero, Projets, Stack, Infrastructure, Contact
- Toggle langue FR/EN et thème dark/light
- Filtres projets par techno (liés au stack)
- Bento grid avec featured/spotlight pour les projets mis en avant

**Back-office `/admin`**
- Authentification par mot de passe (hash bcrypt stocké en base64)
- CRUD projets et stack via interface graphique
- Drag & drop pour réordonner items et catégories
- Double protection : middleware (`src/proxy.ts`) + guard API (`getAdminSession`)

## Installation

**Prérequis :** Node.js >= 20

```bash
npm install
```

### Variables d'environnement

Créer `.env.local` à la racine :

```env
# Auth admin
JWT_SECRET=change-me-super-secret
ADMIN_PASSWORD_HASH=base64-of-bcrypt-hash

# SMTP
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@example.com
SMTP_PASS=change-me
CONTACT_EMAIL=contact@example.com
```

### Générer `ADMIN_PASSWORD_HASH`

Le hash bcrypt doit être encodé en base64 pour éviter les problèmes d'interprétation des caractères spéciaux par dotenv.

```bash
# 1. Générer le hash bcrypt
node -e "const b=require('bcryptjs'); b.hash('ton-mot-de-passe', 12).then(h=>console.log(h));"

# 2. Encoder en base64
echo -n '$2b$12$...' | base64 -w0

# 3. Coller le résultat dans ADMIN_PASSWORD_HASH
```

## Commandes

```bash
npm run dev      # Serveur de développement (localhost:3000)
npm run build    # Build de production
npm run start    # Démarrer la build
npm run lint     # ESLint
```

## Structure

```
src/
├── app/
│   ├── page.tsx                    # Page publique
│   ├── admin/
│   │   ├── page.tsx                # Login admin
│   │   └── dashboard/page.tsx      # Back-office
│   └── api/
│       ├── admin/projects/route.ts
│       ├── admin/stack/route.ts
│       ├── auth/login/route.ts
│       ├── auth/logout/route.ts
│       └── contact/route.ts
├── components/
│   ├── sections/                   # Hero, Projects, Stack, etc.
│   └── ui/                         # ThemeToggle, LangToggle, etc.
├── data/
│   ├── projects.json
│   ├── stack.json
│   └── infrastructure.json
├── i18n/
│   ├── fr.json
│   └── en.json
├── lib/
│   ├── auth.ts
│   ├── data.ts
│   └── mail.ts
├── types/index.ts
└── proxy.ts                        # Middleware de protection des routes admin
```

## API

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/auth/login` | Login admin — body: `{ password }` |
| `POST` | `/api/auth/logout` | Logout — invalide le cookie |
| `GET` | `/api/admin/projects` | Liste des projets |
| `PUT` | `/api/admin/projects` | Sauvegarde `Project[]` |
| `GET` | `/api/admin/stack` | Liste du stack |
| `PUT` | `/api/admin/stack` | Sauvegarde `Technology[]` + nettoyage des refs orphelines dans les projets |
| `POST` | `/api/contact` | Envoi email — body: `{ name, email, message }` |

Les routes `/api/admin/*` nécessitent le cookie `admin_token`.

## Modèles de données

```ts
interface Project {
  id: string
  title: string
  description: { fr: string; en: string }
  techno: string[]          // noms liés aux Technology.name du stack
  img: string
  link: string
  github: string
  featured?: boolean
  spotlight?: boolean       // un seul à la fois — occupe 2 colonnes dans le bento
}

interface Technology {
  name: string
  img: string               // URL icône (cdn.jsdelivr.net recommandé)
  category: string
}

interface Infrastructure {
  description: string
  specs: string
  services: Array<{
    name: string
    description: string
    url?: string
    img: string
  }>
}
```

## Notes

- Les contenus sont dans `src/data/*.json` — modifiables directement ou via l'admin
- Les traductions sont dans `src/i18n/fr.json` et `src/i18n/en.json`
- Modifier la forme des JSON implique de mettre à jour `src/types/index.ts` en conséquence
- `techno` dans les projets est automatiquement nettoyé des refs orphelines à chaque sauvegarde du stack
