# WEB II — API P1

API REST em Node.js, Express, TypeScript, TypeORM e MySQL baseada no diagrama da disciplina. As cinco entidades (`User`, `Situation`, `Product`, `ProductCategory` e `ProductSituation`) são os modelos persistentes da aplicação. A tabela `migrations` é administrada pelo TypeORM.

## Preparação

Requer Node.js 22+ e um servidor MySQL acessível. Se usar Docker, inicie o contêiner MySQL e confira a porta publicada. Crie **um banco vazio** antes da primeira migration; não execute a migration inicial sobre um banco que já contenha as tabelas da API.

1. Copie `.env.example` para `.env` e preencha `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` e `PORT`. Não publique o `.env`.
2. Instale as dependências com `npm ci`.
3. Execute `npm run migration:run` para compilar e criar as tabelas. `npm run migration:show` lista o estado das migrations.
4. Opcionalmente execute `npm run seed:run` para inserir dados de demonstração.
5. Inicie com `npm run start:watch` para desenvolvimento, ou `npm run build` seguido de `npm start`.

Com o MySQL ligado, `npm test` cria um banco temporário, verifica migrations, seeds e rotas HTTP e o remove ao terminar. O usuário configurado em `.env` precisa poder criar e remover bancos de teste.

As migrations só criam a estrutura. `synchronize` fica desativado para evitar alterações automáticas no banco. O comando `migration:revert` desfaz a última migration **e pode apagar tabelas e dados**; use somente em um banco de teste.

## Rotas

Os recursos são `/users`, `/situations`, `/products`, `/product-categories` e `/product-situations`. Cada um oferece `POST /recurso`, `GET /recurso`, `GET /recurso/:id`, `PUT /recurso/:id` e `DELETE /recurso/:id`. A lista aceita `page` e `limit` (`GET /products?page=1&limit=10`). O limite máximo por página é 100. A documentação interativa fica em `http://localhost:3000/api-docs` quando `PORT=3000`.

Exemplo de criação, depois de cadastrar uma situação de usuário:

```json
POST /users
{"name":"Maria","email":"maria@example.com","situationId":1}
```

Para criar um produto, cadastre antes uma categoria e uma situação de produto e envie `name`, `productCategoryId` e `productSituationId`. IDs devem ser inteiros positivos.

## Organização

- `src/entities`: modelos e relações TypeORM.
- `src/migrations`: criação versionada das tabelas e chaves estrangeiras.
- `src/controllers`: respostas HTTP.
- `src/services`: acesso aos repositórios e listagem paginada.
- `src/routes`: rotas e validação de entrada.
- `src/seeds.ts`: dados iniciais de demonstração.
- `src/app.ts` e `src/server.ts`: configuração Express e inicialização do servidor.

O escopo básico até a aula 5 inclui configuração, entidades, migrations, criação e consulta. Atualização, exclusão, seeds, Swagger e paginação estão presentes como extensão para a P1.
