import { database } from "../plugins/config.js";
import logsService from "../services/logs.service.js";
import alertsService from "../services/alerts.service.js";

class SimulationController {

    constructor(){
        this.users = database.collection('users')
        this.simulation_data = database.collection('simulation_data')
    }

    // SQL Injection Simulation
    async sqlInjection(req, reply) {
        try {
            const { query } = req.body;

            // Simuler une base de données vulnérable
            const users = [
                { id: 1, username: 'admin', email: 'admin@company.com', role: 'admin' },
                { id: 2, username: 'user1', email: 'user1@company.com', role: 'user' },
                { id: 3, username: 'user2', email: 'user2@company.com', role: 'user' },
            ];

            let results = [];
            let detected = false;

            // Détection de patterns SQL injection
            const sqlPatterns = [
                /' OR '1'='1/i,
                /' OR 1=1/i,
                /" OR "1"="1/i,
                /" OR 1=1/i,
                /' UNION SELECT/i,
                /" UNION SELECT/i,
                /' DROP TABLE/i,
                /--/,
                /;/,
                /xp_cmdshell/i
            ];

            for (const pattern of sqlPatterns) {
                if (pattern.test(query)) {
                    detected = true;
                    break;
                }
            }

            // Si injection détectée, retourner toutes les données (simulation de vulnérabilité)
            if (detected) {
                results = users;
                await logsService.createLogSimulation('sql_injection', query, req.ip, 'success');
                // Créer une alerte
                await alertsService.createAlertSQLInjection({ ip: req.ip }, query);
            } else {
                // Recherche normale (limitée)
                results = users.filter(user =>
                    user.username.toLowerCase().includes(query.toLowerCase()) ||
                    user.email.toLowerCase().includes(query.toLowerCase())
                );
                await logsService.createLogSimulation('sql_injection', query, req.ip, 'normal');
            }

            reply.send({
                success: true,
                detected,
                results,
                message: detected
                    ? '⚠️ Injection SQL détectée ! Toutes les données exposées.'
                    : 'Recherche normale effectuée.'
            });

        } catch (error) {
            reply.send({
                success: false,
                message: error.message
            });
        }
    }

    // XSS Simulation
    async xssInjection(req, reply) {
        try {
            const { comment } = req.body;

            // Détection de patterns XSS
            const xssPatterns = [
                /<script/i,
                /javascript:/i,
                /onerror=/i,
                /onload=/i,
                /onclick=/i,
                /<img/i,
                /<iframe/i,
                /document\./i,
                /alert\(/i,
                /eval\(/i
            ];

            let detected = false;
            for (const pattern of xssPatterns) {
                if (pattern.test(comment)) {
                    detected = true;
                    break;
                }
            }

            // Nettoyage du commentaire (sanitization)
            const sanitized = comment
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');

            if (detected) {
                await logsService.createLogSimulation('xss', comment, req.ip, 'success');
                // Créer une alerte
                await alertsService.createAlertXSS({ ip: req.ip }, comment);
            } else {
                await logsService.createLogSimulation('xss', comment, req.ip, 'normal');
            }

            reply.send({
                success: true,
                detected,
                original: comment,
                sanitized,
                message: detected
                    ? '⚠️ XSS détecté ! Tentative d\'injection de script bloquée.'
                    : 'Commentaire ajouté avec succès.'
            });

        } catch (error) {
            reply.send({
                success: false,
                message: error.message
            });
        }
    }

    // Path Traversal Simulation
    async pathTraversal(req, reply) {
        try {
            const { filename } = req.body;

            // Détection de patterns path traversal
            const traversalPatterns = [
                /\.\.\//,
                /\.\.\\/,
                /%2e%2e\//i,
                /%2e%2e\\/i,
                /..%2f/i,
                /..%5c/i,
                /%252e%252e/i,
                /\/etc\//i,
                /\/windows\//i,
                /C:\\/i
            ];

            let detected = false;
            for (const pattern of traversalPatterns) {
                if (pattern.test(filename)) {
                    detected = true;
                    break;
                }
            }

            // Fichiers autorisés
            const allowedFiles = [
                'readme.txt',
                'about.txt',
                'contact.txt',
                'services.txt'
            ];

            const fileContents = {
                'readme.txt': 'Bienvenue sur notre application. Version 1.0.0',
                'about.txt': 'MiniSOC - Système de surveillance de sécurité',
                'contact.txt': 'Email: contact@minisoc.com - Tel: +123456789',
                'services.txt': 'Monitoring, Alertes, Logs, Analyse'
            };

            let result = null;
            let message = '';

            if (detected) {
                // Simulation d'accès non autorisé
                result = {
                    filename: 'etc/passwd',
                    content: 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/sbin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin',
                    warning: '⚠️ Path Traversal détecté ! Accès aux fichiers système bloqué.'
                };
                message = '⚠️ Path Traversal détecté !';
                await logsService.createLogSimulation('path_traversal', filename, req.ip, 'success');
                // Créer une alerte
                await alertsService.createAlertPathTraversal({ ip: req.ip }, filename);
            } else if (allowedFiles.includes(filename.toLowerCase())) {
                result = {
                    filename: filename,
                    content: fileContents[filename.toLowerCase()]
                };
                message = 'Fichier accessible.';
                await logsService.createLogSimulation('path_traversal', filename, req.ip, 'normal');
            } else {
                result = {
                    filename: filename,
                    content: null,
                    error: 'Fichier non trouvé'
                };
                message = 'Fichier non trouvé.';
                await logsService.createLogSimulation('path_traversal', filename, req.ip, 'error');
            }

            reply.send({
                success: true,
                detected,
                result,
                message
            });

        } catch (error) {
            reply.send({
                success: false,
                message: error.message
            });
        }
    }
}

export default new SimulationController();
