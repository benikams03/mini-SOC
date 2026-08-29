# Mini-SOC Web – Détection d'intrusions

## Description

**Mini-SOC Web** est une application web de démonstration qui simule le fonctionnement d'un **Security Operations Center (SOC)**.

L'application permet d'ingérer des journaux simulés, d'analyser les événements à l'aide de règles IDS, de générer des alertes et de suivre les actions des utilisateurs en temps réel.

> Projet académique : toutes les données et attaques sont **simulées**. Aucun système réel n'est ciblé.

---

## Membres du groupe

* **MUKUNGULU KAMUIMBA Beni**
* **MUMBE DIANTUADI Benjamin**

---

## Objectifs

Les objectifs du projet sont de :

* Mettre en œuvre un mini-SOC accessible via le Web.
* Simuler l'ingestion de journaux de sécurité.
* Détecter des comportements suspects grâce à des règles IDS.
* Générer et afficher des alertes de sécurité.
* Permettre la transmission des alertes en temps réel.
* Mettre en œuvre l'authentification et le MFA.
* Contrôler les accès selon les rôles.
* Journaliser les actions effectuées par les utilisateurs.
* Mettre en pratique plusieurs mécanismes de sécurité réseau.

---

## Architecture

```text
                  Utilisateur
                       │
                    HTTPS/TLS
                       │
              ┌────────▼────────┐
              │    Frontend     │
              │  React / Web    │
              └────────┬────────┘
                       │
                    REST API
                       │
              ┌────────▼────────┐
              │     Backend     │
              │   Node.js/API   │
              └───────┬─────────┘
                      │
          ┌───────────┼────────────┐
          │           │            │
     ┌────▼────┐ ┌────▼─────┐ ┌────▼─────┐
     │   DB    │ │ Moteur   │ │ WebSocket│
     │         │ │   IDS    │ │   WSS    │
     └─────────┘ └────┬─────┘ └──────────┘
                      │
                   🚨 Alertes
```

### Flux de fonctionnement

```text
Logs simulés
     ↓
Ingestion
     ↓
Analyse IDS
     ↓
Application des règles
     ↓
Détection
     ↓
Création d'une alerte
     ↓
Notification WebSocket
     ↓
Dashboard SOC
```

---

## Protocoles et mécanismes de sécurité

Le projet met en œuvre notamment :

### HTTPS / TLS

Sécurisation des communications entre le navigateur et le serveur.

### WebSocket sécurisé (WSS)

Transmission des alertes en temps réel avec une connexion sécurisée.

### Authentification + MFA

Protection de l'accès au dashboard du Mini-SOC.

### Autorisation / RBAC

Gestion des permissions selon le rôle de l'utilisateur.

### Hashage des mots de passe

Les mots de passe ne sont jamais stockés en clair.

### Validation des entrées

Protection contre les données malformées ou malveillantes.

### Journalisation

Enregistrement des actions importantes effectuées dans l'application.

---

## Installation

### Prérequis

* Node.js
* npm
* Git
* Une base de données Mysql

### Cloner le projet

```bash
git clone https://github.com/benikams03/mini-SOC.git

cd mini-SOC
```

### Installer les dépendances

Frontend :

```bash
cd frontend
npm install
```

Backend :

```bash
cd backend
npm install
```

### Variables d'environnement

Créer un fichier `.env` dans le backend :

```env
DATABASE_URL=...
JWT_SECRET=...
MFA_SECRET=...
```

> Le fichier `.env` ne doit jamais être envoyé sur GitHub.

### Lancer le projet

Backend :

```bash
npm run dev
```

Frontend :

```bash
npm run dev
```

---

## Déploiement

Le projet est déployé sur une plateforme cloud afin d'être accessible publiquement.

### Frontend

Plateforme : **Vercel**

URL : `https://mini-soc-unikin.vercel.app/`

### Backend

Plateforme : **Render**

URL : `https://mini-soc-api.onrender.com`

### Base de données

Base de données mysql hébergée sur une plateforme cloud.

> Les secrets et variables sensibles sont configurés directement dans les variables d'environnement de la plateforme de déploiement.

---

## Tests

Les tests sont réalisés avec des données fictives.

### Test 1 — Authentification

* Connexion avec un compte valide.
* Vérification du MFA.
* Vérification du refus avec des identifiants incorrects.

### Test 2 — Détection Brute Force

Simulation de plusieurs échecs de connexion :

```text
LOGIN_FAILED
LOGIN_FAILED
LOGIN_FAILED
LOGIN_FAILED
LOGIN_FAILED
```

Résultat attendu :

```text
🚨 Alerte : Brute Force
Niveau : CRITIQUE
```

### Test 3 — Accès non autorisé

Tentative d'accès à une ressource sans permission.

Résultat attendu :

```text
🚨 Alerte : Accès non autorisé
```

### Test 4 — Alertes en temps réel

Génération d'une alerte et vérification de son apparition instantanée dans le dashboard grâce au WebSocket sécurisé.

### Test 5 — Journalisation

Vérification de l'enregistrement des actions effectuées par les utilisateurs.


## 📂 Structure du projet

```text
mini-soc/
│
├── frontend/
│   ├── src/
│   └── ...
│
├── backend/
│   ├── src/
│   └── ...
│
├── docs/
│   └── screenshots/
│
├── .gitignore
├── README.md
└── ...
```

---

## Sécurité et éthique

Ce projet est exclusivement destiné à la démonstration et à l'apprentissage.

* Utilisation uniquement de données fictives.
* Aucune donnée personnelle réelle.
* Aucun scan de réseau externe.
* Aucune attaque contre un système réel.
* Aucun logiciel malveillant.
* Aucun secret ou mot de passe dans le dépôt.
* Les tests sont limités à l'environnement du projet.

---

## Dépendances

Les bibliothèques et services externes utilisés dans le projet sont documentés dans les fichiers `package.json` et dans la documentation du projet.

---

## Projet académique

**Thème :** Sécurité réseau
**Sujet :** Mini-SOC Web de détection d'intrusions

Projet réalisé dans le cadre du cours de **PROTOCOLES DE SÉCURITÉ RÉSEAU**.
