# MLD

## List
| champ    | type | contrainte |
| -------- | ---- | ---------- |
| id       | INTEGER | GENERATED ALWAYS AS IDENTITY, PRIMARY KEY |
| name     | TEXT | NOT NULL   |
| position | INTEGER | NOT NULL, DEFAULT 0 |
|created_at| TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
|updated_at| TIMESTAMPTZ |     |

## Card
| champ    | type | contrainte |
| -------- | ---- | ---------- |
| id       | INTEGER | GENERATED ALWAYS AS IDENTITY, PRIMARY KEY |
| title    | TEXT | NOT NULL   |
| color    | TEXT |            |
| position | INTEGER | NOT NULL, DEFAULT 0 |
|created_at| TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
|updated_at| TIMESTAMPTZ |     |
| liste_id | INTEGER | NOT NULL, REFERENCES list(id), ON DELETE CASCADE |

## label
| champ    | type | contrainte |
| -------- | ---- | ---------- |
| id       | INTEGER | GENERATED ALWAYS AS IDENTITY, PRIMARY KEY |
| name     | TEXT | NOT NULL   |
| color    | TEXT |            |
|created_at| TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
|updated_at| TIMESTAMPTZ |     |

## card_has_label
| champ    | type | contrainte |
| -------- | ---- | ---------- |
| card_id  | INTEGER | NOT NULL, REFERENCES card(id), ON DELETE CASCADE |
| label_id | INTEGER | NOT NULL, REFERENCES label(id), ON DELETE CASCADE |
|created_at| TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |