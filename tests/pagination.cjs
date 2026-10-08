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
}

main().catch(error => { console.error(error); process.exitCode = 1; });
