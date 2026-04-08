-- DropIndex
DROP INDEX "Area_name_key";

-- DropIndex
DROP INDEX "Position_name_key";

-- AlterTable
CREATE SEQUENCE area_id_seq;
ALTER TABLE "Area" ALTER COLUMN "id" SET DEFAULT nextval('area_id_seq');
ALTER SEQUENCE area_id_seq OWNED BY "Area"."id";

-- AlterTable
CREATE SEQUENCE position_id_seq;
ALTER TABLE "Position" ALTER COLUMN "id" SET DEFAULT nextval('position_id_seq');
ALTER SEQUENCE position_id_seq OWNED BY "Position"."id";
