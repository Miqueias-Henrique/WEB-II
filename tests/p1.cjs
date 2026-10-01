require('dotenv').config();
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const mysql = require('mysql2/promise');

async function main() {
  const dbName = `webii_p1_test_${process.pid}`;
  const admin = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  let db;
  let server;
  let created = false;
  try {
    await admin.query(`CREATE DATABASE \`${dbName}\``);
    created = true;
    process.env.DB_NAME = dbName;
    const { AppDataSource } = require('../dist/data-source');
    db = AppDataSource;
    await db.initialize();
    await db.query('CREATE TABLE situations (id int primary key)');
    await assert.rejects(() => db.runMigrations(), /banco vazio/);
    await db.query('DROP TABLE situations');
    const migrations = await db.runMigrations();
    assert.equal(migrations.length, 1);
    const [tables] = await admin.query('SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?', [dbName]);
    assert.deepEqual(tables.map(row => row.TABLE_NAME).sort(), [
      'migrations', 'product_categories', 'product_situations', 'products', 'situations', 'users',
    ]);
    const [columns] = await admin.query('SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND COLUMN_NAME IN (?, ?)', [dbName, 'createdAt', 'updatedAt']);
    assert.equal(columns.length, 10);
    assert.ok(columns.every(row => row.DATA_TYPE === 'timestamp'));

    const app = require('../dist/app').default;
    server = app.listen(0);
    const port = server.address().port;
    async function request(method, path, body) {
      const response = await fetch(`http://127.0.0.1:${port}${path}`, {
        method,
        headers: body ? { 'content-type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      return [response.status, response.headers.get('content-type')?.includes('application/json') ? await response.json() : await response.text()];
    }

    let [status, situation] = await request('POST', '/situations', { nameSituation: 'Teste' });
    assert.equal(status, 201);
    const situationId = situation.id;
    [status] = await request('POST', '/situations', { nameSituation: 'Teste' });
    assert.equal(status, 409);

    let category, productSituation, user, product;
    [status, category] = await request('POST', '/product-categories', { name: 'Categoria Teste' });
    assert.equal(status, 201);
    [status, productSituation] = await request('POST', '/product-situations', { name: 'Disponível' });
    assert.equal(status, 201);
    [status, user] = await request('POST', '/users', { name: 'Maria', email: 'maria@example.com', situationId });
    assert.equal(status, 201);
    [status] = await request('POST', '/users', { name: 'Outra', email: 'maria@example.com', situationId });
    assert.equal(status, 409);
    [status, product] = await request('POST', '/products', { name: 'Produto Teste', productCategoryId: category.id, productSituationId: productSituation.id });
    assert.equal(status, 201);
    [status] = await request('POST', '/products', { name: 'Inválido', productCategoryId: 999999, productSituationId: productSituation.id });
    assert.equal(status, 400);

    for (const [path, id] of [['situations', situationId], ['product-categories', category.id], ['product-situations', productSituation.id], ['users', user.id], ['products', product.id]]) {
      [status] = await request('GET', `/${path}/${id}`);
      assert.equal(status, 200, path);
      let list;
      [status, list] = await request('GET', `/${path}?page=1&limit=10`);
      assert.equal(status, 200, path);
      assert.ok(list.total >= 1, path);
    }
    [status] = await request('GET', '/users/1abc');
    assert.equal(status, 400);
    [status] = await request('GET', '/products?page=0');
    assert.equal(status, 400);
    [status] = await request('POST', '/products', {});
    assert.equal(status, 400);
    [status] = await request('GET', '/api-docs/');
    assert.equal(status, 200);

    const seed = spawnSync(process.execPath, ['dist/seeds.js'], { cwd: process.cwd(), env: process.env, encoding: 'utf8' });
    assert.equal(seed.status, 0, `${seed.stdout}\n${seed.stderr}`);
    const active = await db.query("SELECT id FROM situations WHERE nameSituation = 'Ativo'");
    const adminUser = await db.query("SELECT situationId FROM users WHERE email = 'admin@sistema.com'");
    assert.equal(adminUser[0].situationId, active[0].id);
    await db.undoLastMigration();
    const [remaining] = await admin.query('SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME NOT IN (?)', [dbName, 'migrations']);
    assert.equal(remaining.length, 0);
    console.log('PASS: migration up/down, schema, seeds, CRUD POST/GET e validação HTTP em banco temporário.');
  } finally {
    if (server) await new Promise(resolve => server.close(resolve));
    if (db?.isInitialized) await db.destroy();
    if (created) await admin.query(`DROP DATABASE \`${dbName}\``);
    await admin.end();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
