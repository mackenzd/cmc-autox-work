FROM python:3.12 as api
WORKDIR /app

COPY api/requirements.txt api/api.py api/.flaskenv ./
RUN pip install -r ./requirements.txt
ENV FLASK_ENV production

EXPOSE 5000
CMD ["gunicorn", "-b", ":5000", "api:app"]


FROM node:20-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json yarn.lock ./
COPY ./src ./src
COPY ./public ./public

RUN yarn install
RUN yarn build


FROM nginx:stable-alpine as client

COPY --from=build /app/build /usr/share/nginx/html
COPY deployment/nginx.default.conf /etc/nginx/conf.d/default.conf