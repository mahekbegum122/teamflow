# TeamFlow ER Diagram

## Entities and Relationships

```mermaid
erDiagram
    USER ||--o{ PROJECT : creates
    USER ||--o{ TASK : assigned_to
    PROJECT ||--o{ TASK : contains
    TASK ||--o{ TASK : depends_on
    USER ||--o{ NOTIFICATION : receives
    USER ||--o{ COMMENT : writes
    PROJECT ||--o{ RCA : has
    USER ||--o{ RCA : reports
    
    USER {
        string id PK
        string name
        string email
        string password
        string role
        string theme
    }
    
    PROJECT {
        string id PK
        string name
        string description
        string status
        string createdBy FK
    }
    
    TASK {
        string id PK
        string title
        string description
        string status
        string priority
        string assignee FK
        string project FK
        date dueDate
        number estimatedHours
    }
    
    NOTIFICATION {
        string id PK
        string userId FK
        string type
        string message
        boolean read
        string relatedEntityId
    }
    
    RCA {
        string id PK
        string title
        string description
        string severity
        string status
        string project FK
        string reportedBy FK
    }
    
    COMMENT {
        string id PK
        string text
        string author FK
        string entityType
        string entityId
    }