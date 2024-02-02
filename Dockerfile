FROM python:3.12 as api
WORKDIR /app

COPY api/requirements.txt api/wsgi.py ./
COPY api/templates ./templates
RUN pip install -r ./requirements.txt

EXPOSE 5000
CMD ["gunicorn", "-b", ":5000", "wsgi:app"]


FROM node:20-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json package-lock.json tailwind.config.js tsconfig.json ./
COPY ./src ./src
COPY ./public ./public

RUN npm install
RUN npm run build


FROM build as development
ENV NODE_ENV development

EXPOSE 3000
CMD ["npm", "start"]


FROM nginx:stable-alpine as production
ENV NODE_ENV production

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]