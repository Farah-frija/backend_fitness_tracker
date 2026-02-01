import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationComment1769617917733 implements MigrationInterface {
    name = 'MigrationComment1769617917733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "commentaire" ("content" character varying NOT NULL, "isSolution" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "postId" integer, "authorId" integer, "parentCommentId" integer, CONSTRAINT "PK_a4fa195414f3428179d40988716" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "commentaire" ADD CONSTRAINT "FK_05967a0276b03da8a32dc3f2a9b" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commentaire" ADD CONSTRAINT "FK_2458349b780b19185bd1e078e98" FOREIGN KEY ("authorId") REFERENCES "utilisateur"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commentaire" ADD CONSTRAINT "FK_d550ee360a6a334e1f382dbe769" FOREIGN KEY ("parentCommentId") REFERENCES "commentaire"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commentaire" DROP CONSTRAINT "FK_d550ee360a6a334e1f382dbe769"`);
        await queryRunner.query(`ALTER TABLE "commentaire" DROP CONSTRAINT "FK_2458349b780b19185bd1e078e98"`);
        await queryRunner.query(`ALTER TABLE "commentaire" DROP CONSTRAINT "FK_05967a0276b03da8a32dc3f2a9b"`);
        await queryRunner.query(`DROP TABLE "commentaire"`);
    }

}
