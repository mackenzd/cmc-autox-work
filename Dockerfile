FROM python:3.12 as api
WORKDIR /app

COPY api/requirements.txt api/config.cfg api/wsgi.py ./
COPY api/templates ./templates
RUN pip install -r ./requirements.txt
ENV FLASK_ENV production

EXPOSE 5000
CMD ["gunicorn", "-b", ":5000", "wsgi:app"]


FROM node:20-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json package-lock.json ./
COPY ./src ./src
COPY ./public ./public

RUN npm install


FROM build as development
ENV NODE_ENV development

EXPOSE 3000
CMD ["npm", "start"]


FROM nginx:stable-alpine as production
ENV NODE_ENV production

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]