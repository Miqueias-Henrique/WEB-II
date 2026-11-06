const assert = require('node:assert/strict');
const { PaginationService, PageOutOfRangeError } = require('../dist/services/PaginationService');

async function main() {
  const pagination = new PaginationService();
  const rows = [{ id: 1 }, { id: 2 }, { id: 3 }];
  let optionsSeen;
  const repository = {
    async findAndCount(options) {
      optionsSeen = options;
      const ordered = [...rows].sort((a, b) => b.id - a.id);
      return [ordered.slice(options.skip, options.skip + options.take), rows.length];
    },
  };

  const first = await pagination.paginate(repository, 1, 2, { relations: { situation: true } });
  assert.deepEqual(first, { data: [{ id: 3 }, { id: 2 }], total: 3, page: 1, limit: 2, lastPage: 2 });
  assert.deepEqual(optionsSeen.relations, { situation: true });
  assert.deepEqual(optionsSeen.order, { id: 'DESC' });

  const second = await pagination.paginate(repository, 2, 2);
  assert.deepEqual(second.data, [{ id: 1 }]);
  assert.equal(optionsSeen.skip, 2);
  await assert.rejects(() => pagination.paginate(repository, 3, 2), PageOutOfRangeError);

  const emptyRepository = { async findAndCount() { return [[], 0]; } };
  assert.deepEqual(await pagination.paginate(emptyRepository), {
    data: [], total: 0, page: 1, limit: 10, lastPage: 0,
  });
  await assert.rejects(() => pagination.paginate(emptyRepository, 2), PageOutOfRangeError);
  console.log('PASS: paginação, ordenação, relações e página inexistente.');

  const { SituationService } = require('../dist/services/SituationService');
  SituationService.prototype.create = async (data) => ({ id: 1, ...data });
  SituationService.prototype.update = async (_id, _data) => true;

  const app = require('../dist/app').default;
  const server = app.listen(0);
  const port = server.address().port;
  async function request(method, path, body) {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    return [response.status, await response.json()];
  }

  try {
    let [status, body] = await request('POST', '/situations', {});
    assert.equal(status, 400);
    assert.deepEqual(body, { error: ['O campo nome é obrigatório!'] });

    [status, body] = await request('POST', '/situations', { nameSituation: '' });
    assert.equal(status, 400);
    assert.deepEqual(body, {
      error: [
        'O campo nome é obrigatório!',
        'O campo nome deve ter no mínimo 3 caracteres!',
      ],
    });

    [status, body] = await request('POST', '/situations', { nameSituation: 'ab' });
    assert.equal(status, 400);
    assert.deepEqual(body, { error: ['O campo nome deve ter no mínimo 3 caracteres!'] });

    [status, body] = await request('POST', '/situations', { nameSituation: 'Ativo' });
    assert.equal(status, 201);
    assert.deepEqual(body, { id: 1, nameSituation: 'Ativo' });

    [status, body] = await request('PUT', '/situations/1', {});
    assert.equal(status, 400);
    assert.deepEqual(body, { error: ['O campo nome é obrigatório!'] });

    [status, body] = await request('PUT', '/situations/1', { nameSituation: '' });
    assert.equal(status, 400);
    assert.deepEqual(body, {
      error: [
        'O campo nome é obrigatório!',
        'O campo nome deve ter no mínimo 3 caracteres!',
      ],
    });

    [status, body] = await request('PUT', '/situations/1', { nameSituation: 'ab' });
    assert.equal(status, 400);
    assert.deepEqual(body, { error: ['O campo nome deve ter no mínimo 3 caracteres!'] });

    [status, body] = await request('PUT', '/situations/1', { nameSituation: 'Inativo' });
    assert.equal(status, 200);
    assert.deepEqual(body, { message: 'Situation atualizada com sucesso' });

    console.log('PASS: validação Yup em POST /situations e PUT /situations/:id (400 Bad Request, 201 Created e 200 OK).');
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
