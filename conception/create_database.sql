BEGIN;

DROP TABLE IF EXISTS "list", "card", "label", "card_has_label";


CREATE TABLE "list" (
    -- le type integer avec la contrainte GENERATED AS IDENTITY équivaut à SERIAL mais est la version standard sql contrairement à SERIAL qui est propre à POSTGRES
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);


CREATE TABLE "card" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "title" TEXT NOT NULL,
    "color" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ,
    -- la contrainte ON DELETE CASCADE permet de supprimer automatiquement une ligne si la ligne associée dans la table référencée est supprimée
    -- ex : ici si ma card à en liste_id 2, si je supprime la liste avec l'id 2, ma card sera supprimée
    "list_id" INTEGER NOT NULL REFERENCES list("id") ON DELETE CASCADE
);


CREATE TABLE "label" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color"  TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);


CREATE TABLE "card_has_label" (
    "card_id" INTEGER NOT NULL REFERENCES card("id") ON DELETE CASCADE,
    "label_id" INTEGER NOT NULL REFERENCES label("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- ici on crée une clé primaire composite, on ne crée pas de colonne id mais c'est la combinaison de plusieurs colonnes qui identifie chaque ligne, ainsi si j'insère une ligne avec card_id 2 et label_id 3, je ne pourrai pas ajouter une 2ème ligne avec cette combinaison de valeurs, on dit qu'on garanti l'unicité de nos lignes
    PRIMARY KEY ("card_id", "label_id")
);

-- SEEDING --
INSERT INTO "list" ("name", "position") 
    VALUES 
        ('Liste de test', 0), 
        ('Mes courses', 1);

INSERT INTO "card" ("title", "color", "position", "list_id") 
    VALUES
        ('Acheter des poireaux', '#ff0000', 0, 2),
        ('Acheter des oranges', '#ff9900', 1, 2),
        ('Carte de test', '#f0f', 0, 1);

INSERT INTO "label" ("name", "color") 
    VALUES 
        ('Urgent', '#f0f'), 
        ('Idée', 'rgba(255,0,150,0.5)');

INSERT INTO "card_has_label" ("card_id", "label_id") 
    VALUES 
        (1,2), 
        (2,1),
        (2,2),
        (3,1);


COMMIT;