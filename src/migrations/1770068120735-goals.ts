import { MigrationInterface, QueryRunner } from "typeorm";

export class Goals1770068120735 implements MigrationInterface {
    name = 'Goals1770068120735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "goals" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "description" text, "goalType" character varying NOT NULL, "metricType" character varying NOT NULL, "targetValue" double precision, "unit" character varying, "isActive" boolean NOT NULL DEFAULT true, "startDate" date, "endDate" date, "userId" integer, CONSTRAINT "PK_26e17b251afab35580dff769223" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "goals" ADD CONSTRAINT "FK_57dd8a3fc26eb760d076bf8840e" FOREIGN KEY ("userId") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goals" DROP CONSTRAINT "FK_57dd8a3fc26eb760d076bf8840e"`);
        await queryRunner.query(`DROP TABLE "goals"`);
    }

}
