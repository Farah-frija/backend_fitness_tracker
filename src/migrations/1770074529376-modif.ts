import { MigrationInterface, QueryRunner } from "typeorm";

export class Modif1770074529376 implements MigrationInterface {
    name = 'Modif1770074529376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal_schedules" DROP COLUMN "timesPerPeriod"`);
        await queryRunner.query(`ALTER TABLE "daily_goal_instances" ADD "isGoalActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "goals" ADD "scheduleId" integer`);
        await queryRunner.query(`ALTER TABLE "goals" ADD CONSTRAINT "UQ_6f2bb2011b2b68c29b8608898f6" UNIQUE ("scheduleId")`);
        await queryRunner.query(`ALTER TABLE "goals" ADD CONSTRAINT "FK_6f2bb2011b2b68c29b8608898f6" FOREIGN KEY ("scheduleId") REFERENCES "goal_schedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goals" DROP CONSTRAINT "FK_6f2bb2011b2b68c29b8608898f6"`);
        await queryRunner.query(`ALTER TABLE "goals" DROP CONSTRAINT "UQ_6f2bb2011b2b68c29b8608898f6"`);
        await queryRunner.query(`ALTER TABLE "goals" DROP COLUMN "scheduleId"`);
        await queryRunner.query(`ALTER TABLE "daily_goal_instances" DROP COLUMN "isGoalActive"`);
        await queryRunner.query(`ALTER TABLE "goal_schedules" ADD "timesPerPeriod" integer`);
    }

}
