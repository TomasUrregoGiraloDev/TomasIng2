# M4 - Nodos / protocolos vs RNF

| Nodo | Protocolo | RNF que valida |
|---|---|---|
| Cliente (browser) -> Frontend Vite | HTTP/HTTPS | RNF-010 (accesibilidad) |
| Frontend -> Backend | HTTPS / REST + JWT | RNF-001 (rendimiento), RNF-006 (latencia update), RNF-013 (privacidad), RNF-015 (control acceso a mensajes), RNF-016 (acceso restringido admin) |
| Backend -> MySQL | mysql2 / TCP 3307 | RNF-004 (precision de calculos), RNF-012 (rendimiento de stats) |
| Backend -> Groq API | HTTPS / REST | RNF-007 (confiabilidad de la integracion externa) |
