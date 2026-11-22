# IMPACT-OS — reprise de session et connexion

État du 22 novembre 2026 : **PASS pour les contrôles locaux ci-dessous ; PARTIEL pour l’application entière.**

## Référence et conservation

Le lot part du commit distant `42b5dc16cab4a3f823643ba5e0635808e13435b5`, arbre `d06bffd882404c7615aa38a1bb6448bfbd87cedd`, branche par défaut `claude/impact-os-setup-1vjRJ`. Cette référence comprend déjà la correction des formulaires de la PR1. Les branches divergentes, l’identité LUMIOS présente dans les écrans et les fichiers de données existants sont conservés.

Les 42 fichiers texte utilisés ont été vérifiés par leur empreinte Git. Le binaire `src/assets/hero.png`, non importé par l’application compilée, n’a pas été téléchargé ; son blob distant `cc51a3d20ad4bc961b596a6adfd686685cd84bb0` doit rester inchangé. Le dépôt de travail local est un instantané synthétique réservé à la revue ; il ne doit jamais remplacer l’historique distant.

## Défauts corrigés

- Une lecture initiale de session devenue obsolète pouvait remplacer un événement plus récent, notamment rétablir visuellement une ancienne session après une déconnexion. Le provider souscrit d’abord aux événements et ignore ensuite la réponse initiale devenue obsolète.
- Une erreur ou un rejet de lecture pouvait laisser le chargement actif indéfiniment. Le provider termine désormais ce chargement sans présenter de session non confirmée. Les réponses et événements d’un abonnement détruit sont ignorés.
- La connexion pouvait rester bloquée après un rejet réseau, accepter deux soumissions rapprochées ou rediriger vers le tableau de bord après que la personne avait déjà quitté la page. Une garde de soumission, la gestion des erreurs, la libération dans `finally` et le contrôle du montage corrigent ces cas.
- Les erreurs de connexion sont exposées avec `role="alert"`. L’adresse est nettoyée de ses espaces extérieurs ; les espaces du mot de passe restent intacts.

Les méthodes d’inscription, de connexion et de déconnexion conservent leurs contrats Supabase. Aucune permission serveur, politique SQL, identité, règle financière ni donnée réelle n’a été modifiée.

## Vérification réelle

Runtime local : Node `24.22.3`.

| Contrôle | Résultat |
| --- | --- |
| Installation du verrou d’origine | **PASS**, `npm ci --ignore-scripts --no-audit --no-fund`, 271 paquets |
| Tests initiaux des formulaires | **PASS**, 4/4 avant modification |
| Reproduction AuthProvider | Sur les 12 premiers nouveaux cas : **9 échecs, 3 réussites** avant correction ; puis 12/12 après correction |
| Reproduction Login | **4 échecs, 2 réussites** sur les 6 nouveaux cas avant correction |
| Suite finale | **PASS, 24/24**, dont 4 formulaires conservés, 14 cas du provider et 6 cas de connexion ; aucun saut |
| Lint global | **PASS**, zéro erreur et zéro avertissement, configuration et règles inchangées |
| Build Vite complet | **PASS**, 2 361 modules transformés ; avertissement de taille du paquet JavaScript toujours présent, environ 947 kB avant gzip |

Commandes de reproduction :

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test -- --maxWorkers=2
npm run lint
npm run build
```

Les tests exécutent les véritables composants React avec jsdom ; seuls les appels Supabase et les frontières de contexte nécessaires sont simulés. Ce ne sont pas des essais dans un navigateur natif ni des opérations sur un compte réel. Le workflow proposé rejoue installation, tests, lint et compilation avec des valeurs de fournisseur synthétiques, sans secret, audit npm implicite, cache de sources ou déploiement. Son résultat distant reste à lire après publication. La création automatique d’un déploiement Vercel est désactivée uniquement pour `fix/impact-os-auth-security-20261122`.

## Dépendances : blocage conservé

Une projection plate des **299 versions publiques**, avec zéro entrée omise, rapporte **0 critique, 11 élevées, 2 modérées et 1 faible**. Ce périmètre exclut le nom du projet, ses chemins et les arêtes de dépendances ; il n’est pas directement comparable aux alertes propagées du graphe complet historique.

Les versions Vite `8.3.8` et React Router DOM `7.18.6` ont été repérées dans le registre et la documentation officielle, mais **ne sont pas installées par ce correctif**. La régénération en ligne du verrou a été refusée par la revue automatique. L’essai distinct strictement hors ligne échoue avec `ENOTCACHED` sur les métadonnées de `react-router`. L’opération en ligne n’a pas été répétée par un autre outil ; le manifeste et le verrou d’origine sont conservés octet pour octet.

Sources officielles : [avis Vite](https://github.com/vitejs/vite/security/advisories), [avis React Router](https://github.com/remix-run/react-router/security/advisories), [contrat getSession](https://supabase.com/docs/reference/javascript/auth-getsession), [contrat onAuthStateChange](https://supabase.com/docs/reference/javascript/auth-onauthstatechange).

## Limites restantes

Le lot ne transforme pas les écrans utilisant `mockData` en services de production et n’ajoute pas de fonctionnalité non spécifiée. La sécurisation complète des dépendances, les parcours dans un navigateur réel, la création de comptes, les politiques effectives de base de données, les services externes et le déploiement restent à qualifier. Les réussites locales ne prouvent ni une mise en production ni la fin de tout le projet.

## Reprise du 22 novembre — inscription

La reprise part de la tête PR2 `670c005a4028ff7bffd12c19e4504d7340310bc1`, arbre `a330c5c98f35aab6b079653810487c03dbd6f0fc`. Les 48 fichiers ont été vérifiés contre leurs blobs Git, y compris le binaire conservé. Elle prolonge la PR existante.

Trois défauts supplémentaires sont corrigés dans `Register` : double appel à `signUp` avant le prochain rendu React, redirection tardive après navigation ou remontage du formulaire, et adresse de confirmation remplacée par une saisie effectuée après l’envoi. La garde de soumission est synchrone, les réponses d’un formulaire démonté sont ignorées, et la confirmation conserve l’adresse réellement transmise.

Avant correction, les 9 premiers nouveaux scénarios produisaient 4 échecs ; un dixième scénario a ensuite reproduit séparément l’adresse de confirmation incorrecte. Après correction : **34/34 tests PASS**, sans saut (24 préexistants et 10 nouveaux), **lint global PASS** sans erreur ni avertissement et **build Vite PASS**, 2 361 modules. Les valeurs de mot de passe et les contrats Supabase sont conservés. Le contrôle du patch et sa contre-revue indépendante ont réussi.

Les tests exécutent les composants React et les événements DOM sous jsdom ; ils ne créent aucun compte réel. Les dépendances, les règles ESLint, les workflows, la configuration Vercel et les autres écrans sont inchangés. L’avertissement de taille du paquet principal et les limites de sécurité des dépendances décrites plus haut restent ouverts. La réussite distante de cette nouvelle tête doit être vérifiée séparément de celle des 24 tests antérieurs.
