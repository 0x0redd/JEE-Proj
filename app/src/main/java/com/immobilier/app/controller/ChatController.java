package com.immobilier.app.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String OLLAMA_URL = "http://localhost:11434/api/generate";
    private final String MODEL_NAME = "llama3.2";
    
    private final String SYSTEM_PROMPT = """
        Tu es un assistant immobilier spécialisé dans l'immobilier au Maroc. Tu aides les clients à trouver des biens immobiliers et réponds à leurs questions sur l'immobilier.
        
        RÔLE ET RESPONSABILITÉS:
        - Aide les clients à trouver des biens immobiliers selon leurs critères
        - Répond aux questions sur les prix, quartiers, types de biens
        - Explique les processus d'achat, vente et location
        - Donne des conseils sur l'investissement immobilier
        - Informe sur les documents nécessaires pour les transactions immobilières
        
        TYPES DE BIENS:
        - Appartements (studios, 2-3-4 pièces, duplex)
        - Villas (maisons individuelles, villas avec jardin)
        - Bureaux et locaux commerciaux
        - Terrains constructibles
        - Maisons traditionnelles (Riad, Dar)
        
        QUARTIERS POPULAIRES AU MAROC:
        - Casablanca: Maarif, Anfa, Sidi Maarouf, California, Ain Diab
        - Rabat: Agdal, Hassan, Hay Riad, Souissi
        - Marrakech: Palmeraie, Hivernage, Guéliz, Médina
        - Fès: Ville Nouvelle, Fès El Bali, Fès El Jdid
        - Tanger: Malabata, California, Marina, Old Medina
        
        PRIX MOYENS (2024):
        - Appartements: 800,000 - 3,000,000 MAD
        - Villas: 2,000,000 - 8,000,000 MAD
        - Bureaux: 1,500,000 - 5,000,000 MAD
        - Terrains: 500,000 - 2,000,000 MAD
        
        RÈGLES IMPORTANTES:
        - Réponds toujours en français
        - Sois professionnel et courtois
        - Donne des informations précises et à jour
        - Si tu ne sais pas quelque chose, dis-le honnêtement
        - Dirige les clients vers le site web pour plus de détails
        - Ne donne jamais de conseils financiers ou juridiques spécifiques
        - Encourage les clients à contacter un agent immobilier pour les transactions
        
        EXEMPLES DE RÉPONSES:
        - "Pour un appartement 3 pièces à Casablanca, les prix varient entre 1.2M et 2.5M MAD selon le quartier."
        - "Le quartier Maarif à Casablanca est très prisé pour sa proximité avec les écoles internationales et les commerces."
        - "Pour acheter un bien immobilier, vous aurez besoin d'un acte de vente, d'un certificat d'urbanisme, et d'un certificat de conformité."
        
        N'oublie pas: Tu es là pour aider et informer, pas pour remplacer un professionnel de l'immobilier.
        """;

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> request) {
        try {
            String userMessage = request.get("message");
            if (userMessage == null || userMessage.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Le message ne peut pas être vide"
                ));
            }

            // Prepare the request for Ollama
            Map<String, Object> ollamaRequest = new HashMap<>();
            ollamaRequest.put("model", MODEL_NAME);
            ollamaRequest.put("prompt", SYSTEM_PROMPT + "\n\nUtilisateur: " + userMessage + "\n\nAssistant:");
            ollamaRequest.put("stream", false);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Create HTTP entity
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(ollamaRequest, headers);

            // Send request to Ollama
            ResponseEntity<Map> response = restTemplate.exchange(
                OLLAMA_URL,
                HttpMethod.POST,
                entity,
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                String aiResponse = (String) response.getBody().get("response");
                
                Map<String, Object> responseMap = new HashMap<>();
                responseMap.put("response", aiResponse);
                responseMap.put("timestamp", System.currentTimeMillis());
                responseMap.put("success", true);

                return ResponseEntity.ok(responseMap);
            } else {
                throw new RuntimeException("Erreur de communication avec Ollama");
            }

        } catch (Exception e) {
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("error", "Erreur lors du traitement de votre message: " + e.getMessage());
            errorMap.put("success", false);
            return ResponseEntity.internalServerError().body(errorMap);
        }
    }

    @PostMapping("/stream")
    public ResponseEntity<Map<String, Object>> chatWithStream(@RequestBody Map<String, String> request) {
        try {
            String userMessage = request.get("message");
            if (userMessage == null || userMessage.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Le message ne peut pas être vide"
                ));
            }

            // Prepare the request for Ollama with streaming
            Map<String, Object> ollamaRequest = new HashMap<>();
            ollamaRequest.put("model", MODEL_NAME);
            ollamaRequest.put("prompt", SYSTEM_PROMPT + "\n\nUtilisateur: " + userMessage + "\n\nAssistant:");
            ollamaRequest.put("stream", true);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Create HTTP entity
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(ollamaRequest, headers);

            // Send request to Ollama
            ResponseEntity<Map> response = restTemplate.exchange(
                OLLAMA_URL,
                HttpMethod.POST,
                entity,
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                String aiResponse = (String) response.getBody().get("response");
                
                Map<String, Object> responseMap = new HashMap<>();
                responseMap.put("response", aiResponse);
                responseMap.put("timestamp", System.currentTimeMillis());
                responseMap.put("success", true);

                return ResponseEntity.ok(responseMap);
            } else {
                throw new RuntimeException("Erreur de communication avec Ollama");
            }

        } catch (Exception e) {
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("error", "Erreur lors du traitement de votre message: " + e.getMessage());
            errorMap.put("success", false);
            return ResponseEntity.internalServerError().body(errorMap);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "OK");
        health.put("service", "Real Estate ChatBot");
        health.put("model", MODEL_NAME);
        health.put("ollama_url", OLLAMA_URL);
        health.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(health);
    }

    @PostMapping("/clear-memory")
    public ResponseEntity<Map<String, Object>> clearMemory() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Mémoire de conversation effacée");
        response.put("success", true);
        return ResponseEntity.ok(response);
    }
} 