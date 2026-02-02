import { MigrationInterface, QueryRunner } from "typeorm";

export class BodyMetrics1770057712486 implements MigrationInterface {
    name = 'BodyMetrics1770057712486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "commentaire" ("content" character varying NOT NULL, "isSolution" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "postId" integer, "authorId" integer, "parentCommentId" integer, CONSTRAINT "PK_a4fa195414f3428179d40988716" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reaction_type_enum" AS ENUM('LIKE', 'SHARE', 'PIN', 'SAVE')`);
        await queryRunner.query(`CREATE TABLE "reaction" ("id" SERIAL NOT NULL, "type" "public"."reaction_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "postId" integer, CONSTRAINT "UQ_4c1dd76cd768cc51fe983a4f062" UNIQUE ("userId", "postId", "type"), CONSTRAINT "PK_41fbb346da22da4df129f14b11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "category" character varying NOT NULL, "title" character varying NOT NULL, "content" text NOT NULL, "is_locked" boolean NOT NULL DEFAULT false, "tags" text DEFAULT '', "user_id" integer NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "body_metrics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "heightCm" double precision NOT NULL, "weightKg" double precision NOT NULL, "bmi" double precision NOT NULL, "bodyFat" double precision, "waistCm" double precision, "neckCm" double precision, "hipCm" double precision, "systolic" integer, "diastolic" integer, "pulseRate" integer, "recordedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_9a0991ddaeea4a7261ab0a7449c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "utilisateur" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "nom" character varying NOT NULL, "prenom" character varying NOT NULL, "email" character varying NOT NULL, "motDePasse" character varying NOT NULL, "gender" character varying NOT NULL, "telephone" character varying, "adresse" character varying, "image" character varying, "estVerifie" boolean NOT NULL DEFAULT false, "twoFactorEnabled" boolean NOT NULL DEFAULT false, "twoFactorSecret" character varying, "lastLogin" TIMESTAMP, "verificationToken" character varying, "verificationExpires" TIMESTAMP, "isActive" boolean NOT NULL DEFAULT true, "type" character varying NOT NULL, CONSTRAINT "UQ_e1136325a6b28e2a02b81b2f5e1" UNIQUE ("email"), CONSTRAINT "PK_838f0f99fe900e49ef050030443" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c01c880e77c53d805415d76a66" ON "utilisateur" ("type") `);
        await queryRunner.query(`ALTER TABLE "commentaire" ADD CONSTRAINT "FK_05967a0276b03da8a32dc3f2a9b" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commentaire" ADD CONSTRAINT "FK_2458349b780b19185bd1e078e98" FOREIGN KEY ("authorId") REFERENCES "utilisateur"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commentaire" ADD CONSTRAINT "FK_d550ee360a6a334e1f382dbe769" FOREIGN KEY ("parentCommentId") REFERENCES "commentaire"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reaction" ADD CONSTRAINT "FK_e58a09ab17e3ce4c47a1a330ae1" FOREIGN KEY ("userId") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reaction" ADD CONSTRAINT "FK_dc3aeb83dc815f9f22ebfa7785f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "body_metrics" ADD CONSTRAINT "FK_3d6e20aaf2f59159ca2a662990b" FOREIGN KEY ("userId") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "body_metrics" DROP CONSTRAINT "FK_3d6e20aaf2f59159ca2a662990b"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"`);
        await queryRunner.query(`ALTER TABLE "reaction" DROP CONSTRAINT "FK_dc3aeb83dc815f9f22ebfa7785f"`);
        await queryRunner.query(`ALTER TABLE "reaction" DROP CONSTRAINT "FK_e58a09ab17e3ce4c47a1a330ae1"`);
        await queryRunner.query(`ALTER TABLE "commentaire" DROP CONSTRAINT "FK_d550ee360a6a334e1f382dbe769"`);
        await queryRunner.query(`ALTER TABLE "commentaire" DROP CONSTRAINT "FK_2458349b780b19185bd1e078e98"`);
        await queryRunner.query(`ALTER TABLE "commentaire" DROP CONSTRAINT "FK_05967a0276b03da8a32dc3f2a9b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c01c880e77c53d805415d76a66"`);
        await queryRunner.query(`DROP TABLE "utilisateur"`);
        await queryRunner.query(`DROP TABLE "body_metrics"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "reaction"`);
        await queryRunner.query(`DROP TYPE "public"."reaction_type_enum"`);
        await queryRunner.query(`DROP TABLE "commentaire"`);
    }

}
