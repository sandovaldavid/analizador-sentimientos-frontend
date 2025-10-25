# 📡 Uso de la API

## 🏥 Endpoint de Health Check

**URL**: `GET http://127.0.0.1:8000/health/`

**Descripción**: Endpoint para verificar la disponibilidad y estado de la API. Útil para monitores, load balancers y herramientas de orquestación.

**Rate Limit**: Sin límite

**Response**:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:45.123456Z",
  "uptime_seconds": 3600,
  "service": "Sentiment Analysis API",
  "version": "1.0.0"
}
```

**Ejemplo**:

```bash
curl http://127.0.0.1:8000/health/
```

---

## 🔒 Rate Limiting

El API implementa rate limiting para proteger contra uso excesivo:

- **Endpoint simple** (`/api/sentiment/`): **30 peticiones por minuto** por IP
- **Endpoint bulk** (`/api/sentiment/bulk/`): **10 peticiones por minuto** por IP

Si excedes el límite, recibirás un error `429 Too Many Requests`.

## Endpoint de Análisis Individual

**URL**: `POST http://127.0.0.1:8000/api/sentiment/`

**Rate Limit**: 30 peticiones/minuto por IP

**Headers**:

```
Content-Type: application/json
```

**Body**:

```json
{
  "text": "Tu texto aquí para analizar"
}
```

## Endpoint de Análisis en Bulk

**URL**: `POST http://127.0.0.1:8000/api/sentiment/bulk/`

**Rate Limit**: 10 peticiones/minuto por IP

**Headers**:

```
Content-Type: application/json
```

**Body**:

```json
{
  "comments": ["Primer comentario", "Segundo comentario", "..."]
}
```

**Límites**:

- Mínimo: 1 comentario
- Máximo: 100 comentarios por petición

## Ejemplos de Uso

### Texto en Español

**Request**:

```bash
curl -X POST http://127.0.0.1:8000/api/sentiment/ \
  -H "Content-Type: application/json" \
  -d '{"text": "Me encanta este producto, es excelente!"}'
```

**Response**:

```json
{
  "sentiment": "Positivo",
  "polarity": 0.8547,
  "language": "es",
  "confidence": 0.9234
}
```

### Texto en Inglés

**Request**:

```bash
curl -X POST http://127.0.0.1:8000/api/sentiment/ \
  -H "Content-Type: application/json" \
  -d '{"text": "This product is amazing, I love it!"}'
```

**Response**:

```json
{
  "sentiment": "Positivo",
  "polarity": 0.65,
  "language": "en"
}
```

### Texto Negativo

**Request**:

```bash
curl -X POST http://127.0.0.1:8000/api/sentiment/ \
  -H "Content-Type: application/json" \
  -d '{"text": "Esto es horrible y decepcionante"}'
```

**Response**:

```json
{
  "sentiment": "Negativo",
  "polarity": -0.7823,
  "language": "es",
  "confidence": 0.8901
}
```

### Análisis en Bulk (Múltiples Comentarios)

**Optimización**: Este endpoint utiliza **procesamiento en batch**, agrupando comentarios por idioma y procesándolos en una sola llamada al modelo, lo que resulta en una mejora de rendimiento de hasta **30-50x** comparado con el procesamiento individual.

**Request**:

```bash
curl -X POST http://127.0.0.1:8000/api/sentiment/bulk/ \
  -H "Content-Type: application/json" \
  -d '{
    "comments": [
        "Me encanta este producto!",
        "Terrible experiencia",
        "Es normal",
        "This is amazing!",
        "I hate this"
    ]
  }'
```

**Response**:

```json
{
    "total": 5,
    "processed": 5,
    "failed": 0,
    "results": [
        {
            "index": 0,
            "comment": "Me encanta este producto!",
            "sentiment": "Positivo",
            "polarity": 0.8234,
            "language": "es",
            "confidence": 0.9156
        },
        {
            "index": 1,
            "comment": "Terrible experiencia",
            "sentiment": "Negativo",
            "polarity": -0.7500,
            "language": "es",
            "confidence": 0.8890
        },
        ...
    ]
}
```
