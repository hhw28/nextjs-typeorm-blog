echo 'start';
docker start blogdata &&
cd app/nextjs-typeorm-blog/ &&
git pull &&
yarn install --production=false &&
yarn build &&
echo '处理yarn m:run 时 src/entity/User.tsx 引用connection问题';
git apply migrate.patch;
yarn compile &&
yarn m:run &&
git reset --hard HEAD && 
docker build -t hhw/node-web-app . &&
docker kill app &&
docker run --name app --network=host -p 3000:3000 -d hhw/node-web-app &&
echo 'ok!'
