team-roll application to decide who will be on the dailies as a presenter. An app to place bets.


## install

> npm i

> cd client && npm i


## Start project

before need install docker

> npm run dev


для настройки https нужно добавить сертификаты (временное решение)
1. запустить сервер и запустить команду sudo certbot renew --force-renewal
2. создать папку docker-certs     mkdir -p ~/docker-certs
3. скопировать сертификаты в папку docker-certs
 - sudo cp /etc/letsencrypt/archive/lmru-returns.ru/fullchain.pem ~/docker-certs/
 - sudo cp /etc/letsencrypt/archive/lmru-returns.ru/chain.pem ~/docker-certs/
 - sudo cp /etc/letsencrypt/archive/lmru-returns.ru/cert.pem ~/docker-certs/
 - sudo cp /etc/letsencrypt/archive/lmru-returns.ru/privkey.pem ~/docker-certs/
4. дать доступ на чтение файла privkey  sudo chmod 644 privkey.pem
5. перезапустить сервер
