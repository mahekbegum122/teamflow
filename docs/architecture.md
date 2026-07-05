
---

#### **docs/architecture.md**
```markdown
# TeamFlow Architecture

## System Architecture Diagram

```mermaid
graph TD
    subgraph "Client Layer"
        A[React Frontend - Port 3000]
        B[Mobile Web]
    end
    
    subgraph "API Layer"
        C[Express REST API - Port 5000]
        D[Authentication Middleware]
        E[Error Handling Middleware]
    end
    
    subgraph "Business Logic"
        F[Task Controller - Dependency Logic]
        G[Project Controller]
        H[RCA Controller]
        I[Notification Service]
    end
    
    subgraph "Data Layer"
        J[MongoDB - Local/Atlas]
        K[Models: User, Project, Task, RCA]
    end
    
    A --> C
    B --> C
    C --> D
    C --> E
    D --> F
    D --> G
    D --> H
    F --> J
    G --> J
    H --> J
    I --> J