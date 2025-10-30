-- Fix Article reference constraint

-- 1. Supprimer TOUTES les contraintes uniques sur reference
DO $$
DECLARE
    constraint_name text;
BEGIN
    FOR constraint_name IN
        SELECT con.conname
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        WHERE rel.relname = 'Article'
        AND con.contype = 'u'
        AND EXISTS (
            SELECT 1
            FROM unnest(con.conkey) AS k
            JOIN pg_attribute a ON a.attrelid = con.conrelid AND a.attnum = k
            WHERE a.attname = 'reference'
        )
    LOOP
        EXECUTE 'ALTER TABLE "Article" DROP CONSTRAINT IF EXISTS ' || quote_ident(constraint_name);
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END LOOP;
END $$;

-- 2. Supprimer tous les index uniques sur reference seul
DO $$
DECLARE
    index_name text;
BEGIN
    FOR index_name IN
        SELECT indexname
        FROM pg_indexes
        WHERE tablename = 'Article'
        AND indexdef LIKE '%reference%'
        AND indexdef LIKE '%UNIQUE%'
        AND indexdef NOT LIKE '%entrepriseId%'
    LOOP
        EXECUTE 'DROP INDEX IF EXISTS ' || quote_ident(index_name);
        RAISE NOTICE 'Dropped index: %', index_name;
    END LOOP;
END $$;

-- 3. Vérifier et créer la contrainte composée si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'Article'
        AND indexname = 'Article_entrepriseId_reference_key'
    ) THEN
        CREATE UNIQUE INDEX "Article_entrepriseId_reference_key"
        ON "Article"("entrepriseId", "reference");
        RAISE NOTICE 'Created composite unique index: Article_entrepriseId_reference_key';
    ELSE
        RAISE NOTICE 'Composite unique index already exists';
    END IF;
END $$;

-- 4. Vérifier le résultat
SELECT
    'Contraintes uniques sur Article' as type,
    con.conname as name,
    array_agg(a.attname ORDER BY u.attposition) as columns
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN LATERAL unnest(con.conkey) WITH ORDINALITY AS u(attnum, attposition) ON true
JOIN pg_attribute a ON a.attrelid = con.conrelid AND a.attnum = u.attnum
WHERE rel.relname = 'Article'
AND con.contype = 'u'
GROUP BY con.conname

UNION ALL

SELECT
    'Index uniques sur Article' as type,
    indexname as name,
    ARRAY[indexdef] as columns
FROM pg_indexes
WHERE tablename = 'Article'
AND indexdef LIKE '%UNIQUE%'
ORDER BY type, name;
