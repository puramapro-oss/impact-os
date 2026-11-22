# Sécurité du mot de passe — 22 novembre 2026

Parent : `60c6834daa446431ccd73e12be2ce349e904a3d1`, branche `fix/impact-os-auth-security-20261122`. Les 53 blobs du parent ont été vérifiés avant modification. Périmètre autorisé le 21 novembre 2026.

## Résultat

**PASS local.** Paramètres → Sécurité permet à un compte connecté et vérifié de modifier son mot de passe, avec confirmation, mot de passe actuel et nonce si le fournisseur exige une réauthentification. L’envoi du code reste une action explicite. Seule une réponse positive identifiant le bon utilisateur confirme le changement.

Le client Auth dédié conserve la session capturée uniquement en mémoire. `setSession` vérifie l’utilisateur dans ce client isolé. Aucun `getUser`, `getSession`, renouvellement ou nouvel abonnement n’est ajouté au client partagé. Son callback Auth existant actualise un getter synchrone ; les étapes et envois du parcours vérifient ce getter pour bloquer un changement de compte avant même le prochain rendu React. Les claims JWT servent à comparer les sessions, pas à vérifier une signature ou accorder des droits.

Les doubles envois, erreurs, retours tardifs et démontages sont traités. Le client isolé ne renouvelle pas le jeton partagé ; il refuse cette opération localement sans répétition réseau. `stopAutoRefresh` retire l’écouteur de visibilité après initialisation et au nettoyage. Les champs sont effacés au changement de compte ou à la fermeture du formulaire. Une mutation déjà acceptée par le serveur ne peut pas être annulée par le navigateur.

## Preuves et qualification

- Baseline : **54 tests PASS**. Le test d’ouverture du nouveau formulaire échoue sur le composant du parent, dont le bouton est désactivé.
- Après correction : **82 tests PASS, lint PASS, build PASS**.
- Cinq tests utilisent le vrai SDK avec HTTP simulé : contrat du mot de passe/nonce, conservation de B après `session_not_found` tardif de A, refus de renouvellement et nettoyage de l’écouteur.
- Les tests UI couvrent erreurs, double envoi, code refusé, nouvelle tentative, changement de compte avant rendu, réponses tardives et absence d’écriture des secrets dans les stockages ou journaux applicatifs.

Commandes : `npm test -- --maxWorkers=2`, `npm run lint`, `npm run build`.

Qualification locale : Node 24.22.3, React 19.2.4, Supabase JS/Auth 2.100.0, Vitest 4.1.12, jsdom 26.1.0. Le relevé final compte **46 différences de version parmi 271 paquets présents**, notamment Router 7.13.1 et Vite 8.0.1. L’installation exacte hors ligne manque du tarball `xmlchars@2.2.0`. Le verrou est inchangé ; la CI avec `npm ci` doit compléter la qualification exacte.

## Limites

**PARTIEL — MFA.** Les facteurs TOTP vérifiés sont lus, mais l’enrôlement, la suppression et la vérification à la connexion restent indisponibles. Une étape ultérieure peut envisager une vérification dans un client éphémère suivie d’une reconnexion explicite, après qualification des jetons, de la révocation des autres sessions, des facteurs non vérifiés et du parcours AAL2. Aucun message « compte protégé » n’est affiché.

**NON TESTÉ — fournisseur réel.** Les tests utilisent des comptes, jetons et réponses synthétiques. Aucun compte réel, livraison de code, politique de mot de passe ni règle serveur AAL2 n’a été éprouvé. La durée de session reste désactivée et « Non vérifiée », sans timer présenté comme une politique serveur.

Aucun secret nouveau, migration, audit npm externe, navigateur local ou déploiement. Publication et réception CI restent coordonnées séparément.

Références : [updateUser](https://supabase.com/docs/reference/javascript/auth-updateuser), [sécurité des mots de passe](https://supabase.com/docs/guides/auth/password-security), [MFA TOTP](https://supabase.com/docs/guides/auth/auth-mfa/totp). Contrat inspecté : source et types d’Auth JS 2.100.0.
