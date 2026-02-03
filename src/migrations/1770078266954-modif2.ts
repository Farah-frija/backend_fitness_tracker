import { MigrationInterface, QueryRunner } from "typeorm";

export class Modif21770078266954 implements MigrationInterface {
    name = 'Modif21770078266954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal_schedules" DROP CONSTRAINT "FK_f5f4f20ac5941d3bc9bf474f598"`);
        await queryRunner.query(`ALTER TABLE "goal_schedules" DROP CONSTRAINT "REL_f5f4f20ac5941d3bc9bf474f59"`);
        await queryRunner.query(`ALTER TABLE "goal_schedules" DROP COLUMN "goalId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal_schedules" ADD "goalId" integer`);
        await queryRunner.query(`ALTER TABLE "goal_schedules" ADD CONSTRAINT "REL_f5f4f20ac5941d3bc9bf474f59" UNIQUE ("goalId")`);
        await queryRunner.query(`ALTER TABLE "goal_schedules" ADD CONSTRAINT "FK_f5f4f20ac5941d3bc9bf474f598" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
