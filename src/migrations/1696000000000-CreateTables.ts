import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTables1696000000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        for (const table of ["situations", "product_categories", "product_situations", "users", "products"]) {
            if (await queryRunner.hasTable(table)) {
                throw new Error(`A migration inicial exige um banco vazio; a tabela ${table} já existe.`);
            }
        }

        // 1. situations
        await queryRunner.createTable(new Table({
            name: "situations",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "nameSituation", type: "varchar", length: "255", isUnique: true, isNullable: true },
                { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" }
            ]
        }), true);

        // 2. product_categories
        await queryRunner.createTable(new Table({
            name: "product_categories",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "name", type: "varchar", length: "255", isNullable: true },
                { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" }
            ]
        }), true);

        // 3. product_situations
        await queryRunner.createTable(new Table({
            name: "product_situations",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "name", type: "varchar", length: "255", isNullable: true },
                { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" }
            ]
        }), true);

        // 4. users
        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "name", type: "varchar", length: "255", isNullable: true },
                { name: "email", type: "varchar", length: "255", isUnique: true, isNullable: true },
                { name: "situationId", type: "int", isNullable: true },
                { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" }
            ]
        }), true);

        // 5. products
        await queryRunner.createTable(new Table({
            name: "products",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "name", type: "varchar", length: "255", isNullable: true },
                { name: "productSituationId", type: "int", isNullable: true },
                { name: "productCategoryId", type: "int", isNullable: true },
                { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" }
            ]
        }), true);

        // Foreign Keys
        await queryRunner.createForeignKey("users", new TableForeignKey({
            columnNames: ["situationId"],
            referencedColumnNames: ["id"],
            referencedTableName: "situations",
            onDelete: "SET NULL"
        }));

        await queryRunner.createForeignKey("products", new TableForeignKey({
            columnNames: ["productSituationId"],
            referencedColumnNames: ["id"],
            referencedTableName: "product_situations",
            onDelete: "SET NULL"
        }));

        await queryRunner.createForeignKey("products", new TableForeignKey({
            columnNames: ["productCategoryId"],
            referencedColumnNames: ["id"],
            referencedTableName: "product_categories",
            onDelete: "SET NULL"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop FKs first
        const productsTable = await queryRunner.getTable("products");
        if (productsTable) {
            const productSituationFk = productsTable.foreignKeys.find(fk => fk.columnNames.indexOf("productSituationId") !== -1);
            if (productSituationFk) await queryRunner.dropForeignKey("products", productSituationFk);

            const productCategoryFk = productsTable.foreignKeys.find(fk => fk.columnNames.indexOf("productCategoryId") !== -1);
            if (productCategoryFk) await queryRunner.dropForeignKey("products", productCategoryFk);
        }

        const usersTable = await queryRunner.getTable("users");
        if (usersTable) {
            const situationFk = usersTable.foreignKeys.find(fk => fk.columnNames.indexOf("situationId") !== -1);
            if (situationFk) await queryRunner.dropForeignKey("users", situationFk);
        }

        // Drop tables
        await queryRunner.dropTable("products");
        await queryRunner.dropTable("users");
        await queryRunner.dropTable("product_situations");
        await queryRunner.dropTable("product_categories");
        await queryRunner.dropTable("situations");
    }

}
