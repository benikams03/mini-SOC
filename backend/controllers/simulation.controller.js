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

    // CSRF Simulation
    async csrf(req, reply) {
        try {
            const { action, data } = req.body;

            // Détection de patterns CSRF (simulation simplifiée)
            // Dans un vrai scénario, on vérifierait l'absence de token CSRF
            const detected = true; // Toujours détecté pour la simulation

            if (detected) {
                await logsService.createLogSimulation('csrf', action, req.ip, 'success');
                await alertsService.createAlertCSRF({ ip: req.ip }, action);

                reply.send({
                    success: true,
                    detected: true,
                    message: '⚠️ CSRF détecté ! Requête sans token CSRF valide.',
                    warning: 'Cette requête pourrait exécuter une action non autorisée au nom de l\'utilisateur.'
                });
            } else {
                await logsService.createLogSimulation('csrf', action, req.ip, 'normal');

                reply.send({
                    success: true,
                    detected: false,
                    message: 'Requête valide avec token CSRF.'
                });
            }

        } catch (error) {
            reply.send({
                success: false,
                message: error.message
            });
        }
    }

    // Command Injection Simulation
    async commandInjection(req, reply) {
        try {
            const { command } = req.body;

            // Détection de patterns command injection
            const commandPatterns = [
                /;/,
                /\|/,
                /&&/,
                /\|\|/,
                /`/,
                /\$\(/,
                />\s*\//,
                /rm\s+/i,
                /cat\s+/i,
                /ls\s+/i,
                /wget/i,
                /curl/i,
                /nc\s+/i,
                /bash/i,
                /sh\s+/i,
                /powershell/i
            ];

            let detected = false;
            for (const pattern of commandPatterns) {
                if (pattern.test(command)) {
                    detected = true;
                    break;
                }
            }

            if (detected) {
                await logsService.createLogSimulation('command_injection', command, req.ip, 'success');
                await alertsService.createAlertCommandInjection({ ip: req.ip }, command);

                reply.send({
                    success: true,
                    detected: true,
                    message: '⚠️ Command Injection détectée ! Exécution de commande bloquée.',
                    warning: 'Tentative d\'exécution de commande système détectée.'
                });
            } else {
                await logsService.createLogSimulation('command_injection', command, req.ip, 'normal');

                // Simulation de commande valide (ping)
                const result = `Ping effectué vers ${command}`;

                reply.send({
                    success: true,
                    detected: false,
                    message: 'Commande exécutée avec succès.',
                    result
                });
            }

        } catch (error) {
            reply.send({
                success: false,
                message: error.message
            });
        }
    }

    // SSRF Simulation
    async ssrf(req, reply) {
        try {
            const { url } = req.body;

            // Détection de patterns SSRF
            const ssrfPatterns = [
                /localhost/i,
                /127\.0\.0\.1/,
                /0\.0\.0\.0/,
                /::1/,
                /169\.254/,
                /192\.168/,
                /10\./,
                /172\.(1[6-9]|2[0-9]|3[0-1])\./,
                /file:\/\//i,
                /gopher:\/\//i,
                /dict:\/\//i,
                /metadata/i,
                /169\.254\.169\.254/
            ];

            let detected = false;
            let riskLevel = 'normal';

            for (const pattern of ssrfPatterns) {
                if (pattern.test(url)) {
                    detected = true;
                    if (url.includes('metadata') || url.includes('169.254.169.254')) {
                        riskLevel = 'critical';
                    }
                    break;
                }
            }

            if (detected) {
                await logsService.createLogSimulation('ssrf', url, req.ip, 'success');
                await alertsService.createAlertSSRF({ ip: req.ip }, url);

                reply.send({
                    success: true,
                    detected: true,
                    riskLevel,
                    message: riskLevel === 'critical'
                        ? '⚠️ SSRF critique détecté ! Tentative d\'accès aux métadonnées cloud bloquée.'
                        : '⚠️ SSRF détecté ! Tentative d\'accès aux ressources internes bloquée.',
                    warning: 'Cette URL pourrait permettre d\'accéder aux ressources internes du serveur.'
                });
            } else {
                await logsService.createLogSimulation('ssrf', url, req.ip, 'normal');

                // Simulation de requête externe valide
                const result = `Contenu récupéré depuis ${url}`;

                reply.send({
                    success: true,
                    detected: false,
                    message: 'URL externe valide.',
                    result
                });
            }

        } catch (error) {
            reply.send({
                success: false,
                message: error.message
            });
        }
    }
}

export default new SimulationController();
