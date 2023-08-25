## 清空之前的开发环境

```
docker ps
docker kill 容器id
docker rm 容器id

rm -rf blog-data
或
docker container prune 
docker volume rm blog-data
```

## 启动数据库

```
docker run -v "$PWD/blog-data":/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_USER=blog -e POSTGRES_HOST_AUTH_METHOD=trust -d postgres:12.2
```

## 创建数据库

```
// 进入docker
docker exec -it <id> bash

// 使用POSTGRES_USER连接postgres
psql -U blog

// 创建名为blog_development的数据库
CREATE DATABASE blog_development ENCODING 'UTF8' LC_COLLATE 'en_US.utf8' LC_CTYPE 'en_US.utf8';
CREATE DATABASE blog_production ENCODING 'UTF8' LC_COLLATE 'en_US.utf8' LC_CTYPE 'en_US.utf8';
```

## 创建数据表

1、修改`ormconfig.json`中的`host`，mac为localhost，windows需要更改为本机ip地址，端口号为启动docker时使用的端口号

2、`yarn m:run`生成数据表
src/entity/User.ts 连接数据库时会报错可以先删除启动后再恢复

3、`node dist/seed.js`填充数据

## 开发

```
yarn dev

// 做了两件事
// 启用本地服务
// 指定编译src中的ts => 产出js到dist
```

## 部署

```bash
yarn build
yarn start
```

## docker部署

```
- `git pull`
- `yarn install --production=false`
- `yarn build`
- `docker build -t hhw/node-web-app .`
- `docker run --network=host -p 3000:3000 -d hhw/node-web-app`
```

## 自动化部署
```bash
git pull
ssh blog@120.26.200.119 'bash -s' < bin/deploy.sh
```
