import { AppDataSource } from './data-source';
import { ProductCategory } from './entities/ProductCategory';
import { ProductSituation } from './entities/ProductSituation';
import { Situation } from './entities/Situation';
import { User } from './entities/User';

async function runSeeds() {
  console.log('Conectando ao banco de dados via TypeORM para o Seed...');
  await AppDataSource.initialize();

  try {
    const categoryRepo = AppDataSource.getRepository(ProductCategory);
    const prodSitRepo = AppDataSource.getRepository(ProductSituation);
    const userSitRepo = AppDataSource.getRepository(Situation);
    const userRepo = AppDataSource.getRepository(User);

    // 1. Categorias
    const categories = ['Eletrônicos', 'Móveis', 'Roupas', 'Alimentos'];
    for (const name of categories) {
      if (!(await categoryRepo.findOneBy({ name }))) {
        await categoryRepo.save(categoryRepo.create({ name }));
      }
    }
    console.log('Categorias verificadas/inseridas.');

    // 2. Situações Produto
    const productSituations = ['Em Estoque', 'Esgotado', 'Descontinuado'];
    for (const name of productSituations) {
      if (!(await prodSitRepo.findOneBy({ name }))) {
        await prodSitRepo.save(prodSitRepo.create({ name }));
      }
    }
    console.log('Situações de Produto verificadas/inseridas.');

    // 3. Situações Usuário
    const userSituations = ['Ativo', 'Inativo', 'Banido'];
    for (const nameSituation of userSituations) {
      if (!(await userSitRepo.findOneBy({ nameSituation }))) {
        await userSitRepo.save(userSitRepo.create({ nameSituation }));
      }
    }
    console.log('Situações de Usuário verificadas/inseridas.');

    // 4. Admin User
    const activeSituation = await userSitRepo.findOneByOrFail({ nameSituation: 'Ativo' });
    if (!(await userRepo.findOneBy({ email: 'admin@sistema.com' }))) {
      await userRepo.save(userRepo.create({
        name: 'Admin',
        email: 'admin@sistema.com',
        situationId: activeSituation.id
      }));
      console.log('Usuário Admin verificado/inserido.');
    }

    console.log('Seeds finalizados com sucesso!');
  } finally {
    await AppDataSource.destroy();
  }
}

runSeeds().catch(error => {
  console.error('Erro ao executar seeds:', error);
  process.exitCode = 1;
});
