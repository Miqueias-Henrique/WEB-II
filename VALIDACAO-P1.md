# Validação da P1 — WEB II

Revisão de 01/10/2026 feita por Codex em conjunto com Antigravity, confrontando o código com o enunciado da imagem, o diagrama PDF fornecido e as aulas 1 a 5 indicadas em `Aulas Baião WEB 2.txt`. Os arquivos da disciplina foram usados como referência técnica, não como instruções operacionais.

## Resultado até a aula 5

| Exigência | Resultado |
| --- | --- |
| Configuração da API, Node.js/Express/TypeScript | Presente; compilação passa. |
| Models / Entities | Cinco entidades TypeORM; são os modelos persistentes. Não é necessária uma pasta `models` duplicada. |
| Variáveis de ambiente | `.env.example` e `dotenv`; `.env` ignorado pelo Git. |
| Migrations | Migration `up/down` para cinco tabelas e três FKs; testada em banco vazio. |
| CRUD, controllers e services | 25 rotas presentes; POST e GET dos cinco recursos testados com MySQL. |
| Seeds | Testadas; o usuário Admin referencia a situação `Ativo` pelo ID encontrado. |
| Services (pagination) | Paginação básica presente e parâmetros HTTP validados. O serviço genérico das aulas 9 e 10 ainda é trabalho posterior. |
| Entrega | Código publicado no GitHub em 01/10/2026; esta revisão de limpeza será publicada em commit complementar. |

O teste de integração executou a migration inicial, verificou as cinco tabelas e dez colunas `createdAt`/`updatedAt` como `TIMESTAMP`, criou e consultou os cinco recursos via HTTP, verificou e-mail/situação duplicados, FK inexistente, IDs/páginas inválidos, Swagger, seeds e reversão da migration. Tudo passou em um banco temporário criado no MySQL do Docker e removido ao final.

## Atenção ao banco já existente

O banco `Base` já tinha as tabelas criadas no DBeaver antes desta migration, com nomes antigos de datas (`creatAt`, `createAt`, `updateAt`, `updateat`). As seis tabelas estavam **sem registros**. A estrutura anterior foi salva localmente em `scratch/base-schema-before-20261001.sql`, e as tabelas vazias foram recriadas pela migration validada. `npm run migration:show` agora apresenta a migration como aplicada no `Base`; as cinco listagens HTTP retornaram 200. As tabelas de negócio permanecem vazias, prontas para POSTs ou seeds. Em outro banco já populado, essa recriação não deve ser usada; seria necessária uma migração que preserve os dados.

## Próximas aulas / melhorias opcionais

- Aulas 6 e 7: validar PUT e DELETE com mais cenários, além da presença atual das rotas.
- Aula 8: as seeds já executam e são repetíveis no fluxo testado.
- Aulas 9 e 10: extrair um serviço genérico de paginação, calcular última página e definir política para página excedente.
- Completar a descrição de todas as operações no Swagger; a interface atual funciona, mas a especificação não cobre todas as rotas.
- O Dockerfile foi ajustado e a imagem `webii-p1-validation` compilou com `npm ci` e TypeScript após a limpeza. A auditoria do npm dentro da imagem apontou 4 avisos de dependências (2 moderados e 2 altos); não foram corrigidos automaticamente para evitar mudanças de versão fora do escopo desta entrega.

Não são necessários frontend, autenticação, campos de preço/estoque, nem CRUD da tabela interna `migrations` para o escopo do enunciado recebido.

Na limpeza do repositório, `node_modules` deixou de ser versionado (permanece instalado localmente), o SQL antigo `database` foi substituído pela migration TypeORM, e `concurrently`/`nodemon` foram removidos porque o fluxo atual usa `tsx watch`.
