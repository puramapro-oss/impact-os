export const PLANS = {
  lumiere:   { actions: 5,    resoutre: 2,   documents: 1,   price: 0,  model: 'claude-haiku-4-5' },
  etincelle: { actions: 300,  resoutre: 25,  documents: 25,  price: 22, model: 'claude-haiku-4-5' },
  flamme:    { actions: 1000, resoutre: 80,  documents: 999, price: 33, model: 'claude-sonnet-4-5' },
  soleil:    { actions: 99999,resoutre: 9999,documents: 9999,price: 55, model: 'claude-sonnet-4-5' }
};

export const ACTION_COSTS = {
  resoutre: 2,
  document: 1,
  email: 0.5,
  automation: 0.5,
  search: 1,
};

export const currentUser = {
  name: 'Sophie Martin',
  role: 'Présidente',
  email: 'sophie.martin@aigles-lyon.fr',
  avatar: null,
  initials: 'SM',
  organisation: 'Association Sportive Les Aigles de Lyon',
  membres: 234,
  benevoles: 89,
  budget: 127400,
  plan: 'Flamme',
  modeIA: 'SAFE',
  actionsUsed: 347,
  actionsLimit: 1000,
};

export const kpis = [
  { label: 'Tâches automatisées', value: 47, unit: '', variation: 23, trend: 'up', icon: 'Zap' },
  { label: 'Heures économisées', value: 28, unit: 'h', variation: 15, trend: 'up', icon: 'Clock' },
  { label: 'Financements obtenus', value: 12400, unit: '€', variation: 8, trend: 'up', icon: 'Euro' },
  { label: 'Score impact', value: 94, unit: '/100', variation: 3, trend: 'up', icon: 'TrendingUp' },
  { label: 'Documents générés', value: 156, unit: '', variation: 12, trend: 'up', icon: 'FileText' },
  { label: 'Emails traités', value: 89, unit: '', variation: -5, trend: 'down', icon: 'Mail' },
];

export const chartData7Days = [
  { jour: 'Lun', taches: 12, emails: 8, docs: 4 },
  { jour: 'Mar', taches: 18, emails: 12, docs: 6 },
  { jour: 'Mer', taches: 15, emails: 10, docs: 8 },
  { jour: 'Jeu', taches: 22, emails: 14, docs: 5 },
  { jour: 'Ven', taches: 19, emails: 16, docs: 9 },
  { jour: 'Sam', taches: 8, emails: 4, docs: 2 },
  { jour: 'Dim', taches: 5, emails: 3, docs: 1 },
];

export const chartData6Months = [
  { mois: 'Oct', financements: 8200, depenses: 6800, impact: 78 },
  { mois: 'Nov', financements: 9100, depenses: 7200, impact: 82 },
  { mois: 'Déc', financements: 7800, depenses: 8100, impact: 79 },
  { mois: 'Jan', financements: 10500, depenses: 7600, impact: 85 },
  { mois: 'Fév', financements: 11200, depenses: 7900, impact: 91 },
  { mois: 'Mar', financements: 12400, depenses: 8300, impact: 94 },
];

export const activitesRecentes = [
  { id: 1, type: 'email', message: 'Email de la CAF traité automatiquement', time: Date.now() - 5 * 60 * 1000, icon: 'Mail', color: 'blue' },
  { id: 2, type: 'doc', message: 'Rapport d\'impact Q1 2026 généré', time: Date.now() - 22 * 60 * 1000, icon: 'FileText', color: 'green' },
  { id: 3, type: 'workflow', message: 'Workflow "Relance adhésions" exécuté', time: Date.now() - 45 * 60 * 1000, icon: 'Zap', color: 'gold' },
  { id: 4, type: 'subvention', message: 'Dossier CNDS soumis avec succès', time: Date.now() - 2 * 3600 * 1000, icon: 'Euro', color: 'green' },
  { id: 5, type: 'membre', message: 'Nouveau membre : Lucas Durand inscrit', time: Date.now() - 3 * 3600 * 1000, icon: 'UserPlus', color: 'purple' },
  { id: 6, type: 'audit', message: 'Vérification conformité RGPD terminée', time: Date.now() - 5 * 3600 * 1000, icon: 'Shield', color: 'blue' },
  { id: 7, type: 'email', message: 'Réponse automatique envoyée à Mairie Lyon', time: Date.now() - 8 * 3600 * 1000, icon: 'Mail', color: 'blue' },
  { id: 8, type: 'doc', message: 'Bilan financier mis à jour', time: Date.now() - 24 * 3600 * 1000, icon: 'FileText', color: 'green' },
];

export const planDuJour = [
  { id: 1, heure: '09:00', action: 'Envoyer le rapport mensuel à la Mairie de Lyon', statut: 'done', priorite: 'haute' },
  { id: 2, heure: '10:30', action: 'Relancer les 12 cotisations en retard', statut: 'pending', priorite: 'moyenne' },
  { id: 3, heure: '14:00', action: 'Préparer le dossier Fondation de France', statut: 'pending', priorite: 'haute' },
  { id: 4, heure: '15:30', action: 'Mettre à jour le tableau des bénévoles', statut: 'pending', priorite: 'basse' },
  { id: 5, heure: '17:00', action: 'Générer le compte-rendu de l\'AG du 15 mars', statut: 'pending', priorite: 'moyenne' },
];

export const emails = [
  { id: 1, expediteur: 'Marie Dubois', email: 'marie.dubois@caf-rhone.fr', objet: 'Convention annuelle 2026 — Documents manquants', resume: 'La CAF Rhône demande les pièces justificatives pour la convention annuelle. Il manque le bilan financier N-1 et la liste des bénéficiaires.', date: Date.now() - 30 * 60 * 1000, lu: false, priorite: 'haute', actions: ['Envoyer les documents', 'Demander un délai'], categorie: 'traiter' },
  { id: 2, expediteur: 'Thomas Roux', email: 'thomas.roux@mairie-lyon.fr', objet: 'Réservation gymnase — Confirmation mars', resume: 'La mairie confirme la réservation du gymnase Bellecombe pour les samedis de mars. Créneaux 14h-18h validés.', date: Date.now() - 2 * 3600 * 1000, lu: false, priorite: 'moyenne', actions: ['Confirmer réception', 'Ajouter au calendrier'], categorie: 'traiter' },
  { id: 3, expediteur: 'Claire Moreau', email: 'c.moreau@fondation-france.org', objet: 'Appel à projets Sport & Inclusion 2026', resume: 'Ouverture de l\'appel à projets Sport & Inclusion. Date limite le 30 avril. Budget max 15 000€ par projet.', date: Date.now() - 5 * 3600 * 1000, lu: false, priorite: 'haute', actions: ['Préparer le dossier', 'Archiver'], categorie: 'traiter' },
  { id: 4, expediteur: 'Jean-Pierre Garnier', email: 'jpgarnier@region-aura.fr', objet: 'Notification de subvention — Dossier accepté', resume: 'Votre dossier de demande de subvention régionale a été accepté. Montant accordé : 4 200€. Versement sous 6 semaines.', date: Date.now() - 8 * 3600 * 1000, lu: true, priorite: 'haute', actions: ['Enregistrer le versement', 'Remercier'], categorie: 'traiter' },
  { id: 5, expediteur: 'Nadia Belkacem', email: 'nadia.b@gmail.com', objet: 'Inscription compétition inter-clubs', resume: 'Demande d\'inscription de 3 équipes pour la compétition inter-clubs du 12 avril. Besoin de confirmation avant le 28 mars.', date: Date.now() - 12 * 3600 * 1000, lu: false, priorite: 'moyenne', actions: ['Valider les équipes', 'Répondre'], categorie: 'traiter' },
  { id: 6, expediteur: 'Antoine Lefevre', email: 'a.lefevre@assurance-sport.fr', objet: 'Renouvellement contrat assurance 2026', resume: 'Le contrat d\'assurance arrive à échéance le 15 avril. Nouvelle proposition avec couverture étendue à 2 890€/an.', date: Date.now() - 24 * 3600 * 1000, lu: true, priorite: 'moyenne', actions: ['Comparer les offres', 'Renouveler'], categorie: 'traiter' },
  { id: 7, expediteur: 'Sophie Martin', email: 'auto@lumios.fr', objet: 'Rapport hebdomadaire généré automatiquement', resume: 'Votre rapport de la semaine du 16 au 22 mars est disponible. 47 tâches automatisées, 28h économisées.', date: Date.now() - 2 * 24 * 3600 * 1000, lu: true, priorite: 'basse', actions: ['Consulter le rapport'], categorie: 'traites' },
  { id: 8, expediteur: 'Hugo Bernard', email: 'hugo.bernard@sportif-lyon.fr', objet: 'Partenariat événement sportif juin 2026', resume: 'Proposition de partenariat pour l\'événement sportif du 20 juin. Visibilité médiatique et stand gratuit pour l\'association.', date: Date.now() - 3 * 24 * 3600 * 1000, lu: true, priorite: 'basse', actions: ['Étudier la proposition'], categorie: 'traites' },
];

export const workflows = [
  { id: 1, nom: 'Relance cotisations', description: 'Envoie un rappel automatique aux membres en retard de paiement', actif: true, derniereExec: Date.now() - 2 * 3600 * 1000, frequence: 'Hebdomadaire' },
  { id: 2, nom: 'Rapport hebdomadaire', description: 'Génère et envoie le rapport d\'activité chaque lundi matin', actif: true, derniereExec: Date.now() - 24 * 3600 * 1000, frequence: 'Hebdomadaire' },
  { id: 3, nom: 'Tri emails entrants', description: 'Classe les emails par priorité et catégorie automatiquement', actif: true, derniereExec: Date.now() - 30 * 60 * 1000, frequence: 'Temps réel' },
  { id: 4, nom: 'Mise à jour CRM', description: 'Synchronise les données membres avec le tableau de bord', actif: true, derniereExec: Date.now() - 6 * 3600 * 1000, frequence: 'Quotidien' },
  { id: 5, nom: 'Backup documents', description: 'Sauvegarde automatique de tous les documents sur Google Drive', actif: true, derniereExec: Date.now() - 12 * 3600 * 1000, frequence: 'Quotidien' },
  { id: 6, nom: 'Veille subventions', description: 'Surveille les nouveaux appels à projets correspondant à votre profil', actif: false, derniereExec: Date.now() - 48 * 3600 * 1000, frequence: 'Quotidien' },
  { id: 7, nom: 'Accueil nouveaux membres', description: 'Envoie un kit de bienvenue par email aux nouveaux inscrits', actif: true, derniereExec: Date.now() - 3 * 24 * 3600 * 1000, frequence: 'À l\'inscription' },
  { id: 8, nom: 'Génération attestations', description: 'Crée les attestations fiscales pour les dons reçus', actif: false, derniereExec: Date.now() - 30 * 24 * 3600 * 1000, frequence: 'Annuel' },
];

export const documentsGeneres = [
  { id: 1, nom: 'Rapport impact Q1 2026', type: 'PDF', taille: '2.4 Mo', date: Date.now() - 3600 * 1000, statut: 'Finalisé' },
  { id: 2, nom: 'Bilan financier mars 2026', type: 'Excel', taille: '1.8 Mo', date: Date.now() - 24 * 3600 * 1000, statut: 'Finalisé' },
  { id: 3, nom: 'Compte-rendu AG 15 mars', type: 'Word', taille: '890 Ko', date: Date.now() - 2 * 24 * 3600 * 1000, statut: 'Brouillon' },
  { id: 4, nom: 'Dossier CNDS 2026', type: 'PDF', taille: '5.2 Mo', date: Date.now() - 3 * 24 * 3600 * 1000, statut: 'Finalisé' },
  { id: 5, nom: 'Convention CAF Rhône', type: 'PDF', taille: '1.1 Mo', date: Date.now() - 5 * 24 * 3600 * 1000, statut: 'En attente' },
  { id: 6, nom: 'Planning bénévoles avril', type: 'Excel', taille: '420 Ko', date: Date.now() - 6 * 24 * 3600 * 1000, statut: 'Brouillon' },
  { id: 7, nom: 'Attestations fiscales 2025', type: 'PDF', taille: '3.6 Mo', date: Date.now() - 10 * 24 * 3600 * 1000, statut: 'Finalisé' },
  { id: 8, nom: 'Budget prévisionnel 2026', type: 'Excel', taille: '2.1 Mo', date: Date.now() - 15 * 24 * 3600 * 1000, statut: 'Finalisé' },
  { id: 9, nom: 'Charte bénévoles', type: 'Word', taille: '560 Ko', date: Date.now() - 20 * 24 * 3600 * 1000, statut: 'Finalisé' },
  { id: 10, nom: 'Rapport activité 2025', type: 'PDF', taille: '8.4 Mo', date: Date.now() - 30 * 24 * 3600 * 1000, statut: 'Finalisé' },
];

export const modeles = [
  { id: 1, nom: 'Courrier administratif', categorie: 'Courrier', utilisations: 45 },
  { id: 2, nom: 'Demande de subvention', categorie: 'Financement', utilisations: 23 },
  { id: 3, nom: 'Rapport d\'impact', categorie: 'Impact', utilisations: 18 },
  { id: 4, nom: 'Convocation AG', categorie: 'Gouvernance', utilisations: 12 },
  { id: 5, nom: 'Attestation fiscale don', categorie: 'Fiscal', utilisations: 89 },
  { id: 6, nom: 'Convention partenariat', categorie: 'Partenariat', utilisations: 15 },
  { id: 7, nom: 'Compte-rendu réunion', categorie: 'Gouvernance', utilisations: 34 },
  { id: 8, nom: 'Bulletin adhésion', categorie: 'Membres', utilisations: 127 },
  { id: 9, nom: 'Reçu de paiement', categorie: 'Fiscal', utilisations: 234 },
  { id: 10, nom: 'Lettre de motivation projet', categorie: 'Financement', utilisations: 8 },
  { id: 11, nom: 'Bilan moral annuel', categorie: 'Gouvernance', utilisations: 6 },
  { id: 12, nom: 'Fiche poste bénévole', categorie: 'RH', utilisations: 21 },
];

export const connecteurs = [
  { id: 1, nom: 'Gmail', statut: 'connecte', icon: 'Mail', description: 'Synchronisation emails et réponses automatiques' },
  { id: 2, nom: 'Google Drive', statut: 'connecte', icon: 'HardDrive', description: 'Stockage et partage de documents' },
  { id: 3, nom: 'Google Calendar', statut: 'connecte', icon: 'Calendar', description: 'Gestion automatique du calendrier' },
  { id: 4, nom: 'HelloAsso', statut: 'connecte', icon: 'Heart', description: 'Gestion des adhésions et paiements' },
  { id: 5, nom: 'Stripe', statut: 'deconnecte', icon: 'CreditCard', description: 'Paiements en ligne et facturation' },
  { id: 6, nom: 'WhatsApp', statut: 'deconnecte', icon: 'MessageCircle', description: 'Communication avec les membres' },
];

export const subventions = [
  { id: 1, nom: 'CAF Rhône — Convention annuelle', montant: 8500, statut: 'Accordée', echeance: '2026-06-30', progression: 100, organisme: 'CAF' },
  { id: 2, nom: 'CNDS — Développement pratique sportive', montant: 5000, statut: 'Soumis', echeance: '2026-04-15', progression: 75, organisme: 'CNDS' },
  { id: 3, nom: 'Fondation de France — Sport & Inclusion', montant: 15000, statut: 'En cours', echeance: '2026-04-30', progression: 40, organisme: 'Fondation de France' },
  { id: 4, nom: 'Région AuRA — Aide aux associations', montant: 4200, statut: 'Accordée', echeance: '2026-05-15', progression: 100, organisme: 'Région AuRA' },
  { id: 5, nom: 'Mairie Lyon — Subvention sport jeunesse', montant: 6800, statut: 'En cours', echeance: '2026-05-30', progression: 60, organisme: 'Mairie Lyon' },
  { id: 6, nom: 'FONJEP — Poste salarié associatif', montant: 7200, statut: 'Brouillon', echeance: '2026-07-31', progression: 15, organisme: 'FONJEP' },
  { id: 7, nom: 'DDCS — Actions éducatives', montant: 3500, statut: 'Soumis', echeance: '2026-06-15', progression: 80, organisme: 'DDCS' },
  { id: 8, nom: 'Conseil Départemental — Cohésion sociale', montant: 5500, statut: 'En cours', echeance: '2026-08-30', progression: 25, organisme: 'Conseil Départemental' },
];

export const indicateursImpact = [
  { id: 1, label: 'Bénéficiaires directs', valeur: 892, objectif: 1000, unite: 'personnes', tendance: 12 },
  { id: 2, label: 'Heures d\'activité', valeur: 3420, objectif: 4000, unite: 'heures', tendance: 8 },
  { id: 3, label: 'Taux de satisfaction', valeur: 94, objectif: 95, unite: '%', tendance: 3 },
  { id: 4, label: 'Événements organisés', valeur: 28, objectif: 36, unite: 'événements', tendance: 15 },
  { id: 5, label: 'Partenariats actifs', valeur: 12, objectif: 15, unite: 'partenaires', tendance: 20 },
  { id: 6, label: 'Insertion professionnelle', valeur: 18, objectif: 25, unite: 'personnes', tendance: -5 },
];

export const membres = [
  { id: 1, prenom: 'Lucas', nom: 'Durand', email: 'lucas.durand@email.fr', telephone: '06 12 34 56 78', role: 'Entraîneur', statut: 'Actif', dateInscription: '2024-09-15', cotisation: 'À jour', heuresBenevolat: 124 },
  { id: 2, prenom: 'Emma', nom: 'Petit', email: 'emma.petit@email.fr', telephone: '06 23 45 67 89', role: 'Secrétaire', statut: 'Actif', dateInscription: '2023-01-10', cotisation: 'À jour', heuresBenevolat: 89 },
  { id: 3, prenom: 'Hugo', nom: 'Bernard', email: 'hugo.bernard@email.fr', telephone: '06 34 56 78 90', role: 'Trésorier', statut: 'Actif', dateInscription: '2022-06-20', cotisation: 'À jour', heuresBenevolat: 156 },
  { id: 4, prenom: 'Chloé', nom: 'Moreau', email: 'chloe.moreau@email.fr', telephone: '06 45 67 89 01', role: 'Bénévole', statut: 'Actif', dateInscription: '2024-03-08', cotisation: 'À jour', heuresBenevolat: 67 },
  { id: 5, prenom: 'Nathan', nom: 'Garcia', email: 'nathan.garcia@email.fr', telephone: '06 56 78 90 12', role: 'Adhérent', statut: 'Actif', dateInscription: '2025-01-05', cotisation: 'En retard', heuresBenevolat: 12 },
  { id: 6, prenom: 'Léa', nom: 'Roux', email: 'lea.roux@email.fr', telephone: '06 67 89 01 23', role: 'Entraîneur', statut: 'Actif', dateInscription: '2023-09-12', cotisation: 'À jour', heuresBenevolat: 203 },
  { id: 7, prenom: 'Mathis', nom: 'Fournier', email: 'mathis.fournier@email.fr', telephone: '06 78 90 12 34', role: 'Adhérent', statut: 'Inactif', dateInscription: '2024-02-18', cotisation: 'Expiré', heuresBenevolat: 0 },
  { id: 8, prenom: 'Camille', nom: 'Leroy', email: 'camille.leroy@email.fr', telephone: '06 89 01 23 45', role: 'Bénévole', statut: 'Actif', dateInscription: '2024-11-22', cotisation: 'À jour', heuresBenevolat: 34 },
  { id: 9, prenom: 'Raphaël', nom: 'Simon', email: 'raphael.simon@email.fr', telephone: '06 90 12 34 56', role: 'Adhérent', statut: 'Actif', dateInscription: '2025-02-14', cotisation: 'À jour', heuresBenevolat: 8 },
  { id: 10, prenom: 'Inès', nom: 'Laurent', email: 'ines.laurent@email.fr', telephone: '07 01 23 45 67', role: 'Bénévole', statut: 'Actif', dateInscription: '2023-05-30', cotisation: 'À jour', heuresBenevolat: 178 },
  { id: 11, prenom: 'Maxime', nom: 'Lefebvre', email: 'maxime.lefebvre@email.fr', telephone: '07 12 34 56 78', role: 'Adhérent', statut: 'Actif', dateInscription: '2024-08-03', cotisation: 'En retard', heuresBenevolat: 5 },
  { id: 12, prenom: 'Jade', nom: 'Michel', email: 'jade.michel@email.fr', telephone: '07 23 45 67 89', role: 'Vice-présidente', statut: 'Actif', dateInscription: '2022-01-15', cotisation: 'À jour', heuresBenevolat: 312 },
];

export const documentsArborescence = {
  'Administratif': ['Statuts association', 'Récépissé préfecture', 'PV Assemblée Générale 2025', 'Règlement intérieur', 'Liste des dirigeants', 'Déclaration modification bureau'],
  'Financier': ['Bilan financier 2025', 'Budget prévisionnel 2026', 'Grand livre comptable', 'Relevés bancaires', 'Justificatifs de dépenses Q1'],
  'RH': ['Contrat coordinateur sportif', 'Fiches de poste bénévoles', 'Planning bénévoles mars', 'Conventions de stage', 'Registre du personnel'],
  'Subventions': ['Dossier CNDS 2026', 'Convention CAF 2026', 'Dossier Fondation de France', 'Subvention Région AuRA', 'Dossier Mairie Lyon'],
  'Communication': ['Charte graphique', 'Flyer saison 2025-2026', 'Newsletter mars 2026', 'Photos événements', 'Communiqués de presse'],
  'Archives': ['Bilan 2024', 'Bilan 2023', 'AG 2024', 'AG 2023', 'Anciens contrats'],
};

export const journalAudit = [
  { id: 1, timestamp: Date.now() - 5 * 60 * 1000, utilisateur: 'LUMIOS (IA)', action: 'Email traité automatiquement', details: 'Email de la CAF Rhône classé en priorité haute, résumé généré', type: 'ia', niveau: 'info' },
  { id: 2, timestamp: Date.now() - 18 * 60 * 1000, utilisateur: 'Sophie Martin', action: 'Document téléchargé', details: 'Rapport impact Q1 2026.pdf téléchargé depuis Documents', type: 'utilisateur', niveau: 'info' },
  { id: 3, timestamp: Date.now() - 35 * 60 * 1000, utilisateur: 'LUMIOS (IA)', action: 'Workflow exécuté', details: 'Workflow "Relance cotisations" : 12 emails de relance envoyés', type: 'ia', niveau: 'info' },
  { id: 4, timestamp: Date.now() - 1 * 3600 * 1000, utilisateur: 'Emma Petit', action: 'Membre ajouté', details: 'Nouveau membre Lucas Durand ajouté via HelloAsso', type: 'utilisateur', niveau: 'info' },
  { id: 5, timestamp: Date.now() - 2 * 3600 * 1000, utilisateur: 'LUMIOS (IA)', action: 'Subvention soumise', details: 'Dossier CNDS 2026 soumis automatiquement via la plateforme', type: 'ia', niveau: 'success' },
  { id: 6, timestamp: Date.now() - 3 * 3600 * 1000, utilisateur: 'Sophie Martin', action: 'Paramètres modifiés', details: 'Mode IA changé de SAFE à AUTOPILOT temporairement', type: 'utilisateur', niveau: 'warning' },
  { id: 7, timestamp: Date.now() - 4 * 3600 * 1000, utilisateur: 'LUMIOS (IA)', action: 'Anomalie détectée', details: 'Tentative de connexion depuis une IP inconnue bloquée', type: 'ia', niveau: 'error' },
  { id: 8, timestamp: Date.now() - 6 * 3600 * 1000, utilisateur: 'Hugo Bernard', action: 'Export comptable', details: 'Export du grand livre au format CSV pour l\'expert-comptable', type: 'utilisateur', niveau: 'info' },
  { id: 9, timestamp: Date.now() - 8 * 3600 * 1000, utilisateur: 'LUMIOS (IA)', action: 'Rapport généré', details: 'Rapport hebdomadaire semaine 12 généré et envoyé par email', type: 'ia', niveau: 'success' },
  { id: 10, timestamp: Date.now() - 12 * 3600 * 1000, utilisateur: 'Sophie Martin', action: 'Connexion', details: 'Connexion depuis Lyon, France — Chrome 122 / macOS', type: 'utilisateur', niveau: 'info' },
  { id: 11, timestamp: Date.now() - 18 * 3600 * 1000, utilisateur: 'LUMIOS (IA)', action: 'Backup effectué', details: 'Sauvegarde complète des documents sur Google Drive réussie', type: 'ia', niveau: 'success' },
  { id: 12, timestamp: Date.now() - 24 * 3600 * 1000, utilisateur: 'Jade Michel', action: 'Document modifié', details: 'Règlement intérieur mis à jour — article 7 modifié', type: 'utilisateur', niveau: 'info' },
  { id: 13, timestamp: Date.now() - 30 * 3600 * 1000, utilisateur: 'LUMIOS (IA)', action: 'Veille subventions', details: '3 nouveaux appels à projets détectés correspondant au profil', type: 'ia', niveau: 'info' },
  { id: 14, timestamp: Date.now() - 36 * 3600 * 1000, utilisateur: 'Sophie Martin', action: 'Facture créée', details: 'Facture #2026-047 créée pour la location de matériel', type: 'utilisateur', niveau: 'info' },
  { id: 15, timestamp: Date.now() - 48 * 3600 * 1000, utilisateur: 'LUMIOS (IA)', action: 'Conformité vérifiée', details: 'Audit RGPD automatique : toutes les données conformes', type: 'ia', niveau: 'success' },
];

export const deals = [
  { id: 1, service: 'Box SFR', actionType: 'switch', actionLabel: 'Passer chez Free', currentPrice: 39.99, newPrice: 19.99, icon: '📡', category: 'Internet' },
  { id: 2, service: 'Assurance AXA Habitation', actionType: 'renegociation', actionLabel: 'Renégocier via courtier MANA', currentPrice: 28.50, newPrice: 6.58, icon: '🏠', category: 'Assurance' },
  { id: 3, service: 'Netflix Premium', actionType: 'downgrade', actionLabel: 'Passer en Standard avec pub', currentPrice: 17.99, newPrice: 5.99, icon: '🎬', category: 'Streaming' },
  { id: 4, service: 'Salle Basic-Fit', actionType: 'resiliation', actionLabel: 'Résilier (inutilisé depuis 4 mois)', currentPrice: 29.99, newPrice: 0, icon: '💪', category: 'Sport' },
  { id: 5, service: 'Forfait Orange 100Go', actionType: 'switch', actionLabel: 'Passer chez B&You 130Go', currentPrice: 24.99, newPrice: 9.99, icon: '📱', category: 'Mobile' },
];

export const historiqueResoutre = [
  { id: 1, question: 'Comment organiser notre AG annuelle ?', date: Date.now() - 2 * 24 * 3600 * 1000, statut: 'Résolu' },
  { id: 2, question: 'Quelles subventions sont disponibles pour le sport jeunesse ?', date: Date.now() - 3 * 24 * 3600 * 1000, statut: 'Résolu' },
  { id: 3, question: 'Rédiger un courrier de remerciement pour la Mairie', date: Date.now() - 5 * 24 * 3600 * 1000, statut: 'Résolu' },
  { id: 4, question: 'Mettre en conformité RGPD notre fichier adhérents', date: Date.now() - 7 * 24 * 3600 * 1000, statut: 'Résolu' },
  { id: 5, question: 'Calculer le coût d\'un événement sportif de 200 personnes', date: Date.now() - 10 * 24 * 3600 * 1000, statut: 'Résolu' },
  { id: 6, question: 'Préparer le bilan moral de l\'association', date: Date.now() - 14 * 24 * 3600 * 1000, statut: 'Résolu' },
];
