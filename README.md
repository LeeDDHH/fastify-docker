# Fastify Docker

- [x] ビルド
- [x] 実行
- [x] ホットリロード
- [x] デバッグ

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
- 新しいパッケージをインストールしたり、削除したりするときはイメージを再ビルドする

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
