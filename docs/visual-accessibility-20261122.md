# Qualification visuelle et cycle de vie — 22 novembre 2026

## Périmètre

Ce lot complète la PR2 IMPACT-OS existante sur le parent `b642789592e48942d9d880221d3a2ff66de53d09`. L'identité LUMIOS, la charte, les données de démonstration et les contrats d'authentification existants sont conservés. La réussite d'un contrôle d'affichage ne valide pas les chiffres commerciaux présents dans la démonstration.

## Corrections

- Le compteur partagé annule ses frames et son observateur au démontage, ignore les anciens rappels, reçoit les nouvelles cibles et traite les durées non valides sans boucle infinie. Dashboard utilise ce même compteur, sans seconde implémentation.
- La préférence système de réduction des mouvements est lue au montage et lors des changements. Les compteurs se stabilisent, les sept séries de graphiques arrêtent leur animation et les styles suppriment les délais et transitions décoratifs. Réactiver le mouvement et modifier la cible dans la même mise à jour ne fait pas réapparaître une ancienne valeur.
- Un refus de lecture/écriture du stockage ne fait plus tomber le thème. Le choix reste actif en mémoire ; une valeur inconnue revient au thème sombre existant.
- La navigation et les grilles de l'accueil s'adaptent aux petits écrans. Le menu possède un bouton nommé et un état annoncé, et Échap rend le focus à ce bouton. Les packs et le lien de démonstration utilisent des boutons natifs ; facturation annuelle et FAQ annoncent leur état.
- Un focus clavier visible est conservé dans les deux thèmes, avec un contour interne dans la FAQ pour éviter le découpage par son conteneur. Le menu clair utilise un fond clair. Les couleurs et données métier ne constituent pas une qualification réglementaire ou commerciale.
- Les captures réelles ont fait corriger le texte des statistiques découpé, le remplissage transparent de certains textes clairs, les petits libellés trop pâles et le contraste du sélecteur de facturation. Les accents de texte utilisent un ambre plus foncé en thème clair ; les fonds des boutons principaux restent ceux de la charte. La recette distingue la géométrie du texte, sa peinture et le contraste des commandes.

## Vérifications

La reproduction initiale de `test/visual-lifecycle.test.jsx` échouait sur 14 des 17 cas. Les vingt régressions finales incluent les cas de contre-revue et les commandes de navigation. La suite locale complète atteint 102 tests réussis ; lint et build sont contrôlés séparément.

Le cache local est réutilisé : React, React DOM, Supabase/Auth, Vitest et jsdom concordent avec le verrou. Des versions d'outils et de dépendances transitives locales diffèrent du verrou, comme documenté dans le lot précédent. La réception exacte dépend de la CI existante qui réinstalle par `npm ci --ignore-scripts --no-audit --no-fund`.

`node scripts/verify-motion-browser.mjs` exécute une recette distincte dans Chrome réel du runner GitHub : trois largeurs, deux préférences de mouvement et un complément mobile en thème clair. Elle sert le build local, conserve les reçus et captures, contrôle les débordements, compteurs, focus, menu, FAQ, survols, erreurs et demandes réseau. Seules les ressources statiques locales et les polices Google en lecture sont autorisées par l'interception des requêtes de la page. Aucun fournisseur de compte, paiement ou IA n'est appelé. Le script échoue explicitement si Chrome, une condition de réussite ou une étape de contrôle manque. Un échec n'est pas transformé en test ignoré.

Les résultats navigateur doivent être reçus depuis le job et rattachés à son commit/arbre exact avant d'être déclarés PASS. Les captures sont des preuves internes de revue.

## Limites

La recette couvre l'accueil public compilé, pas les parcours métier authentifiés. Les dimensions émulées ne qualifient ni iPhone/Android physique, ni vibrations, ni lecture d'écran, ni qualité sonore. Aucune mise en production, migration ou modification de compte réel n'est effectuée par ce lot. Les paramètres MFA et de durée de session conservent leur état partiel documenté dans le dossier de sécurité.
