# CLAUDE.md — Règles de développement Claude Code

## Identité du projet

- **Nom** : MANA (anciennement FLUX / LUMIOS)
- **Tagline** : "Reprends ton MANA."
- **Sous-titre** : "L'énergie de ton argent t'appartient."
- **Stack** : React 19 + Vite 8 + React Router 7 + Recharts + Lucide React
- **Langage** : JavaScript (JSX), pas de TypeScript
- **Styling** : CSS variables globales + inline styles

## Design System MANA

- Fond principal : `#040B14` (nuit océan profond)
- Accent turquoise : `#22D3EE` (turquoise polynésien)
- Accent or : `#F59E0B` (or sacré)
- Accent émeraude : `#10B981` (vert émeraude)
- Titres : Cormorant Garamond (Google Fonts)
- Body : DM Sans
- Mono : Courier New / monospace
- Border-radius cards : 12-24px
- Animations : flux, ondulations, transitions fluides
- Logo : 🌊

## Règles absolues

### Ne jamais faire

- Ne jamais recréer un fichier en entier si seule une modification partielle est demandée
- Ne jamais laisser de `// TODO`, `// ...`, placeholder, ou code incomplet
- Ne jamais utiliser `any` en TypeScript
- Ne jamais laisser de `console.log` de debug
- Ne jamais créer de composant dupliqué — vérifier l'existant d'abord
- Ne jamais hardcoder une URL, clé API ou config
- Ne jamais laisser un import cassé ou un fichier manquant
- Ne jamais laisser un bouton sans action (au minimum un toast "Bientôt disponible")
- Ne jamais utiliser `dangerouslySetInnerHTML` sans sanitisation
- Ne jamais exposer de clé API côté client (sauf `VITE_*` pour les publiques)

### Toujours faire

- Toujours utiliser l'optional chaining `?.` sur les données dynamiques
- Toujours définir des valeurs par défaut (`?? []`, `?? ''`, `?? 0`)
- Toujours vérifier qu'un tableau existe avant `.map()`
- Toujours gérer 3 états : loading, error, success
- Toujours wrapper les appels async dans try/catch/finally
- Toujours vérifier les contrastes texte/fond (ratio minimum 4.5:1)
- Toujours que chaque composant ait un `export default`
- Toujours tester le responsive à 375px, 768px, 1440px

### Erreurs passées interdites

1. **Écrans noirs/blancs** — Toujours un fallback visible, ErrorBoundary global, min-height:100vh, background-color défini
2. **Composants dupliqués** — Vérifier l'existant avant de créer
3. **Routes cassées** — Route catch-all 404, vérifier chaque `<Link>` pointe vers une route existante
4. **Crash sur null/undefined** — Optional chaining + valeurs par défaut partout
5. **Lazy loading sans Suspense** — Chaque `React.lazy()` dans un `<Suspense fallback={<Spinner/>}>`
6. **Formulaires illisibles** — Vérifier contraste des labels
7. **Imports cassés** — Utiliser `@/` alias, jamais de `../../..` profonds

## Structure du projet

```
src/
├── components/       # Composants réutilisables
│   ├── layout/       # AppLayout, Header, Sidebar
│   └── ui/           # Modal, Button, etc.
├── pages/            # Pages / routes
├── hooks/            # Custom hooks
├── contexts/         # ThemeContext, ToastContext
├── data/             # Données mock
├── styles/           # CSS globaux (index.css)
└── assets/           # Assets statiques
```

## Workflow de modification

1. **Lire** le fichier existant avant toute modification
2. **Modifier** uniquement ce qui est demandé — ne pas toucher au reste
3. **Vérifier** la cohérence des imports et exports
4. **Tester** mentalement les cas limites (null, vide, erreur)

## Gestion des erreurs — Pattern obligatoire

```jsx
try {
  setLoading(true);
  const data = await fetchSomething();
  setData(data);
} catch (error) {
  const message = error instanceof Error ? error.message : 'Une erreur est survenue';
  setError(message);
} finally {
  setLoading(false);
}
```

## Qualité de code

- Pas de sur-ingénierie — solution la plus simple qui fonctionne
- Pas de refactoring non demandé
- Pas de commentaires inutiles — code auto-documenté
- Modifications chirurgicales : changer uniquement ce qui est nécessaire
- Cohérence avec le style existant du projet
