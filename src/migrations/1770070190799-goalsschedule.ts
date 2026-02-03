import { MigrationInterface, QueryRunner } from "typeorm";

export class Goalsschedule1770070190799 implements MigrationInterface {
    name = 'Goalsschedule1770070190799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "daily_goal_instances" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "date" date NOT NULL, "targetValue" double precision, "completedValue" double precision NOT NULL DEFAULT '0', "isCompleted" boolean NOT NULL DEFAULT false, "goalId" integer, "userId" integer, CONSTRAINT "UQ_cf31df47e12b9a34ba4ce535604" UNIQUE ("goalId", "date"), CONSTRAINT "PK_092205ee966b7c8f8d5c2ceba72" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "goal_schedules" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "frequencyType" character varying NOT NULL, "timesPerPeriod" integer, "daysOfWeek" integer array, "goalId" integer, CONSTRAINT "REL_f5f4f20ac5941d3bc9bf474f59" UNIQUE ("goalId"), CONSTRAINT "PK_3d65ded01db72e9f94ae40d98fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "daily_goal_instances" ADD CONSTRAINT "FK_0ab27c49cfed898001d2e99ff52" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "daily_goal_instances" ADD CONSTRAINT "FK_7b438d408fc5cdb8156a60449d9" FOREIGN KEY ("userId") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "goal_schedules" ADD CONSTRAINT "FK_f5f4f20ac5941d3bc9bf474f598" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal_schedules" DROP CONSTRAINT "FK_f5f4f20ac5941d3bc9bf474f598"`);
        await queryRunner.query(`ALTER TABLE "daily_goal_instances" DROP CONSTRAINT "FK_7b438d408fc5cdb8156a60449d9"`);
        await queryRunner.query(`ALTER TABLE "daily_goal_instances" DROP CONSTRAINT "FK_0ab27c49cfed898001d2e99ff52"`);
        await queryRunner.query(`DROP TABLE "goal_schedules"`);
        await queryRunner.query(`DROP TABLE "daily_goal_instances"`);
    }

}
