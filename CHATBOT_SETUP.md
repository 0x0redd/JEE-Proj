# Real Estate ChatBot Setup Guide

## Overview
This project includes a real estate chatbot powered by Ollama and Spring Boot AI. The chatbot is specifically trained to assist with real estate inquiries in Morocco, providing information about properties, neighborhoods, prices, and buying processes.

## Features
- **Real Estate Specialized**: Trained specifically for Moroccan real estate market
- **Multi-language Support**: Responds in French
- **Interactive UI**: Modern chat interface with minimize/maximize functionality
- **Connection Status**: Real-time connection monitoring
- **Memory Management**: Conversation history and clear functionality
- **Error Handling**: Robust error handling and user feedback

## Prerequisites

### 1. Install Ollama
First, install Ollama on your system:

**Windows:**
```bash
# Download from https://ollama.ai/download
# Or use winget
winget install Ollama.Ollama
```

**macOS:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. Pull the Llama Model
```bash
# Pull the Llama 3.2 model
ollama pull llama3.2

# Verify the model is available
ollama list
```

### 3. Start Ollama Service
```bash
# Start Ollama (it runs on port 11434 by default)
ollama serve
```

## Backend Setup

### 1. Spring Boot Configuration
The chatbot is already integrated into your Spring Boot application. The configuration is in:

- **Controller**: `app/src/main/java/com/immobilier/app/controller/ChatController.java`
- **Properties**: `app/src/main/resources/application.properties`

### 2. Key Configuration
```properties
# Ollama Configuration
app.ollama.url=http://localhost:11434
app.ollama.model=llama3.2
```

### 3. API Endpoints
- `POST /api/chat/send` - Send a message to the chatbot
- `POST /api/chat/stream` - Stream response (for future use)
- `GET /api/chat/health` - Check service health
- `POST /api/chat/clear-memory` - Clear conversation memory

## Frontend Setup

### 1. ChatBot Component
The chatbot is integrated into the main layout and appears on all pages:

- **Component**: `front/components/ChatBot.tsx`
- **Service**: `front/services/chatService.ts`
- **Layout**: `front/app/layout.tsx`

### 2. Features
- Floating chat button in bottom-right corner
- Minimize/maximize functionality
- Real-time connection status
- Message history with timestamps
- Clear conversation option
- Responsive design with dark mode support

## Usage

### 1. Start the Services
```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start Spring Boot backend
cd app
./mvnw spring-boot:run

# Terminal 3: Start Next.js frontend
cd front
npm run dev
```

### 2. Access the Chatbot
- Open your browser to `http://localhost:3000`
- Click the chat icon in the bottom-right corner
- Start chatting with the real estate assistant

### 3. Example Conversations
The chatbot is trained to handle queries like:

- "Je cherche un appartement 3 pièces à Casablanca"
- "Quels sont les prix moyens dans le quartier Maarif ?"
- "Quels documents faut-il pour acheter un bien immobilier ?"
- "Peux-tu me parler des quartiers populaires à Rabat ?"
- "Quelle est la différence entre un Riad et une villa ?"

## System Prompt
The chatbot uses a comprehensive system prompt that includes:

- **Role**: Real estate assistant for Morocco
- **Property Types**: Apartments, villas, offices, land, traditional houses
- **Popular Neighborhoods**: Casablanca, Rabat, Marrakech, Fès, Tanger
- **Price Ranges**: 2024 market prices
- **Processes**: Buying, selling, renting procedures
- **Documents**: Required paperwork for transactions

## Troubleshooting

### 1. Ollama Connection Issues
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
ollama serve
```

### 2. Model Not Found
```bash
# Pull the model again
ollama pull llama3.2

# Check available models
ollama list
```

### 3. Backend Connection Issues
```bash
# Check Spring Boot logs
tail -f app/logs/application.log

# Test the health endpoint
curl http://localhost:8080/api/chat/health
```

### 4. Frontend Issues
```bash
# Check browser console for errors
# Verify CORS settings in Spring Boot
# Test API endpoints directly
```

## Customization

### 1. Change Model
To use a different model, update the configuration:

```properties
# In application.properties
app.ollama.model=your-model-name
```

```typescript
// In ChatController.java
private final String MODEL_NAME = "your-model-name";
```

### 2. Modify System Prompt
Edit the `SYSTEM_PROMPT` in `ChatController.java` to customize the chatbot's behavior and knowledge.

### 3. Add New Features
- Implement conversation memory per user session
- Add file upload for property images
- Integrate with your property database
- Add multilingual support

## Security Considerations

1. **Input Validation**: All user inputs are validated
2. **Rate Limiting**: Consider implementing rate limiting for production
3. **Authentication**: Add user authentication for personalized experiences
4. **Content Filtering**: Implement content filtering for inappropriate requests

## Performance Optimization

1. **Model Selection**: Choose appropriate model size for your use case
2. **Caching**: Implement response caching for common queries
3. **Load Balancing**: Use multiple Ollama instances for high traffic
4. **Monitoring**: Add metrics and monitoring for production deployment

## Production Deployment

1. **Environment Variables**: Use environment variables for configuration
2. **Docker**: Containerize the application for easy deployment
3. **SSL/TLS**: Enable HTTPS for secure communication
4. **Monitoring**: Add health checks and logging
5. **Backup**: Implement conversation backup and recovery

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Spring Boot and Ollama documentation
3. Check the application logs
4. Test individual components separately

## Future Enhancements

- [ ] Voice input/output
- [ ] Property image analysis
- [ ] Integration with property listings
- [ ] Multi-language support (Arabic, English)
- [ ] Advanced filtering and search
- [ ] Appointment scheduling
- [ ] Document generation
- [ ] Market trend analysis 