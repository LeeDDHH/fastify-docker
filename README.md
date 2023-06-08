# Fastify Docker

- [x] ビルド
- [x] 実行
- [x] ホットリロード
- [x] デバッグ
- [ ] Prisma

## バージョン

|                |         |
| :------------: | :-----: |
|    Node.js     | 18.12.0 |
|      npm       |  9.6.6  |
|     docker     | 23.0.5  |
| docker-compose | 2.17.3  |
|    fastify     | 4.17.0  |
|   typescript   |  5.0.4  |

## 説明

- デバッグ用にポート番号を揃える必要がある箇所
  - `.vscode/launch.json` に指定する `port` 番号
  - `package.json` の `start:dev` に指定する `--inspect=0.0.0.0:ポート番号` のポート番号
  - `docker-compose.yml` に指定する `ports` のポート番号
- プロジェクトの Hot Reload 対応をしたため、node_modules を volume 指定したので以下に注意する
  - 新しいパッケージをインストールしたり、削除したりするときは volume を削除し、イメージを再ビルドする
  - prisma のモデル、テーブル構造を変更した際、volume を削除する

## コマンド

### Prisma

- 初期化
  - `npx prisma init`
- Prisma Schema から Prisma Client コードを生成する
  - `npx prisma generate`
  - `node_modules/@prisma/client` に置かれる
- スキーマのマイグレーション用の sql を生成する
  - `npx prisma migrate dev --name マイグレーション名 --preview-feature`
- `npx prisma migrate dev` のオプション
  - `--create-only`
    - マイグレーション用の SQL 文だけ生成する
    - DB には適用しない
    - 生成された文を自分でカスタマイズすることも可能
  - `--preview-feature`
    - 実行時にどういうことをするかをコンソール上に表示してくれる
  - `--name <stage name>`
    - マイグレーション名を指定できる
    - マイグレーション内容の説明を入れたりするのに使う
- ローカル環境の DB を GUI 操作するためのツールを起動する
  - `npx prisma studio`

#### マイグレーションケースによるコマンド

- 開発環境でマイグレーションを生成して適用する
  - `npx prisma migrate dev`
  - 本番環境では使ってはいけない
- 開発環境の DB を再設定する
  - `npx prisma migrate reset`
  - 本番環境では使ってはいけない
- マイグレーション用の SQL 文だけを生成する
  - `npx prisma migrate dev --create-only`
  - SQL 文を適用させるには `npx prisma migrate dev` を実行
- マイグレーションファイルを生成せず、DB のテーブルに変更を加える
  - `npx prisma db push`
  - 開発用コマンド
  - 開発中の試行錯誤で使う
  - DB への反映と Prisma Client の更新を行う
  - 意図した DB のスキーマになったら `npx migrate dev` でマイグレーションファイルを生成する
- 本番・STG 環境でマイグレーションを適用する
  - `npx prisma migrate deploy`

## エラーと解決

### `Prisma Migrate could not create the shadow database. Please make sure the database user has permission to create databases.`

- `npx prisma migrate dev` でマイグレーション用の SQL 文を生成・適用させようとした際に発生
- 原因
  - `npx prisma migrate dev` を実行すると shadow database と呼ばれる一時的なデータベースがマイグレーションのために作成される
  - しかし、shadow database を作成する権限がない場合、マイグレーションが実行できないので失敗してエラーメッセージが表示される
- 対応

  - Prisma 公式の[About the shadow database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database#shadow-database-user-permissions)をもとに、mysql の場合の書き方をした SQL 文を設ける

    - ```sql
      grant all CREATE, ALTER, DROP, REFERENCES ON *.* to MYSQL_USER@'%';
      ```

  - さらに Docker で 最初に MySQL を起動した際に自動的に設定の初期化をするように、設定をする
    - `db/init/init.sql` を設けて、対応用の SQL を書き込む
    - `docker-compose.yml` の `volume` に `./db/init` 配下を `/docker-entrypoint-initdb.d` 配下におくように設定する

### `Can't reach database server at xxxx`

- 原因
  - prisma 接続先の DATABASE_URL で db コンテナを localhost で指定していた
  - `docker-compose` によって app コンテナと db コンテナが立っている状態のため、app コンテナから見た `localhost` は app コンテナということになる
- 対応
  - `docker-compose.yml` で定義したサービス名の `db` を使って指定する
  - `docker-compose.yml` で network を指定しなくてもデフォルトで同一ネットワークに属していることになる

## 参考

### setting

- [Fastify + Docker = 🚀. Update: I recently expanded upon this… | by David | Medium](https://medium.com/@davidkelley87/fastify-docker-%EF%B8%8F-9165da21ae23)
- [Fastify + Distroless Docker = 😍. Update: I’ve written another part to… | by David | Medium](https://medium.com/@davidkelley87/fastify-distroless-docker-ba0d20a000bf)

### hot reload

- [Hot Reload Node-Typscript with Docker! | by Kartik Kwatra | Medium](https://medium.com/@kartikio/setup-node-ts-local-development-environment-with-docker-and-hot-reloading-922db9016119)
- [How to Speed up Docker Development! 🐳 Hot Reloading, Debuggers, and More!](https://www.youtube.com/watch?v=5JQlFK6MdVQ)

### debug inspector

- [Debugging Node.js + Typescript Running inside Docker Containers with Hot Reload](https://www.youtube.com/watch?v=1WUoITRINf0)
- [flolu/docker-typescript-debug: 🐞 Example for Debugging Node.js + Typescript Running inside Docker Containers with Hot Reload](https://github.com/flolu/docker-typescript-debug)

### Prisma 設定

- [GraphQL, Fastify, Nest, Prisma, MySQL, Docker 環境をサクッと構築する](https://zenn.dev/nori_k/articles/45399999ff39f2)
- [[Prisma]Module '"@prisma/client"' has no exported member のエラー](https://zenn.dev/tsucchiiinoko/articles/bbf61e5e69e1ab)
- [Prisma 基礎](https://zenn.dev/smish0000/articles/f1a6f463417b65)
- [Prisma 備忘録 - Qiita](https://qiita.com/gwappa/items/34cdab09a69d38c3fb07)
- [Prisma Migrate in development and production](https://www.prisma.io/docs/concepts/components/prisma-migrate/migrate-development-production)
- [TypeScript ORM「Prisma」のはじめかた - くらげになりたい。](https://www.memory-lovers.blog/entry/2021/10/13/113000)
- [Rails エンジニアが Prisma に入門する：開発フロー編](https://zenn.dev/monicle/articles/940d4c3fdc0b3d)
- [Node.js(Express.js)環境で Prisma ORM を使いこなすための基礎 | アールエフェクト](https://reffect.co.jp/node-js/prisma-basic)
- [Prototype your schema](https://www.prisma.io/docs/concepts/components/prisma-migrate/db-push)
- [About the shadow database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database)
- [MySQL で prisma migrate dev が失敗する](https://zenn.dev/tatsuyasusukida/articles/why-prisma-migrate-dev-fails-in-myql)
- [Docker で MySQL 起動時にデータの初期化を行う - Qiita](https://qiita.com/moaikids/items/f7c0db2c98425094ef10)
- [Prisma で npx prisma migrate dev が「Can't reach database server at xxxx」になる場合に確認すること | For](https://for.kobayashiii.dev/articles/kq9p5yzgv7d4)

### docker

- [Docker+MySQL "Can't connect to MySQL server on"の原因と解決方法 - Qiita](https://qiita.com/shun198/items/a66d6214cdab5629029d)
- [docker-compose で DB の起動完了を待ってから Web アプリを実行する - Qiita](https://qiita.com/shiena/items/47437f4f7874bf70d664)
- [MySQL :: MySQL 8.0 リファレンスマニュアル :: 4.5.2 mysqladmin — A MySQL Server 管理プログラム](https://dev.mysql.com/doc/refman/8.0/ja/mysqladmin.html)
