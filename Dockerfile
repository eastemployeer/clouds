FROM postgres:13
ENV POSTGRES_PASSWORD tictactoe
ENV POSTGRES_USER tictactoe
ENV POSTGRES_DB tictactoe
COPY init.sql /docker-entrypoint-initdb.d/
EXPOSE 5432