CREATE TABLE IF NOT EXISTS users
(
    id uuid NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    wins integer NOT NULL DEFAULT 0,
    loses integer NOT NULL DEFAULT 0,
    created timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS users
    OWNER to tictactoe;


GRANT ALL ON TABLE users TO tictactoe;