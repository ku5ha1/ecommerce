--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: deliverymethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.deliverymethod AS ENUM (
    'delivery',
    'pickup'
);


ALTER TYPE public.deliverymethod OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: cartitems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cartitems (
    id integer NOT NULL,
    user_id integer,
    product_id integer,
    quantity integer
);


ALTER TABLE public.cartitems OWNER TO postgres;

--
-- Name: cartitems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cartitems_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cartitems_id_seq OWNER TO postgres;

--
-- Name: cartitems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cartitems_id_seq OWNED BY public.cartitems.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying,
    category_image character varying NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: orderitems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orderitems (
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer,
    price_at_purchase double precision
);


ALTER TABLE public.orderitems OWNER TO postgres;

--
-- Name: orderitems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orderitems_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orderitems_id_seq OWNER TO postgres;

--
-- Name: orderitems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orderitems_id_seq OWNED BY public.orderitems.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    total_amount double precision,
    created_at timestamp without time zone,
    status character varying
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying,
    description character varying,
    product_image character varying,
    price numeric(10,2) NOT NULL,
    quantity integer NOT NULL,
    category_id integer
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: shippinginfo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shippinginfo (
    id integer NOT NULL,
    order_id integer,
    full_name character varying,
    email character varying,
    phone character varying(20),
    delivery_method character varying(8) DEFAULT 'delivery'::character varying NOT NULL,
    pickup_time timestamp without time zone,
    address character varying,
    city character varying,
    state character varying,
    country character varying,
    zip character varying
);


ALTER TABLE public.shippinginfo OWNER TO postgres;

--
-- Name: shippinginfo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shippinginfo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shippinginfo_id_seq OWNER TO postgres;

--
-- Name: shippinginfo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shippinginfo_id_seq OWNED BY public.shippinginfo.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying,
    email character varying,
    hashed_password character varying,
    is_admin boolean
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cartitems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartitems ALTER COLUMN id SET DEFAULT nextval('public.cartitems_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: orderitems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems ALTER COLUMN id SET DEFAULT nextval('public.orderitems_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: shippinginfo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shippinginfo ALTER COLUMN id SET DEFAULT nextval('public.shippinginfo_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
d01774d113c9
\.


--
-- Data for Name: cartitems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cartitems (id, user_id, product_id, quantity) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, category_image) FROM stdin;
1	Flowers	https://plus.unsplash.com/premium_photo-1690339279900-afce69cba58e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U25ha2UlMjBQbGFudCUyMGluJTIwQ2VyYW1pYyUyMFBvdHxlbnwwfDJ8MHx8fDA%3D
2	Bouquets	https://plus.unsplash.com/premium_photo-1690339279900-afce69cba58e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U25ha2UlMjBQbGFudCUyMGluJTIwQ2VyYW1pYyUyMFBvdHxlbnwwfDJ8MHx8fDA%3D
3	Plants	https://plus.unsplash.com/premium_photo-1690339279900-afce69cba58e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U25ha2UlMjBQbGFudCUyMGluJTIwQ2VyYW1pYyUyMFBvdHxlbnwwfDJ8MHx8fDA%3D
\.


--
-- Data for Name: orderitems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orderitems (id, order_id, product_id, quantity, price_at_purchase) FROM stdin;
1	1	10	3	499
3	3	14	1	999
4	4	11	1	649
5	5	17	1	599
6	6	10	1	499
7	7	13	1	799
8	8	12	1	399
9	9	16	1	349
10	10	14	1	999
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, total_amount, created_at, status) FROM stdin;
1	4	1497	2025-07-01 15:42:17.617421	processing
3	5	999	2025-07-12 19:07:40.952098	pending
4	5	649	2025-07-12 19:11:55.250352	pending
5	5	599	2025-07-12 19:15:00.480473	pending
6	5	499	2025-07-12 19:17:04.642412	pending
7	5	799	2025-07-12 19:19:21.761756	pending
8	5	399	2025-07-12 19:21:16.729705	pending
9	5	349	2025-07-12 19:23:33.789649	pending
10	5	999	2025-07-12 19:27:06.568636	pending
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, product_image, price, quantity, category_id) FROM stdin;
15	Pastel Romance Bouquet	A soothing combo of pastel roses and hydrangeas — ideal for engagements or surprises.	https://plus.unsplash.com/premium_photo-1690339279900-afce69cba58e?w=600&auto=format&fit=crop&q=60	899.00	9	2
18	Aloe Vera Mini Pot	A soothing aloe vera plant in a cute terracotta pot — great for skin and air.	https://plus.unsplash.com/premium_photo-1690339279900-afce69cba58e?w=600&auto=format&fit=crop&q=60	299.00	30	3
11	Sunshine Lilies	A vibrant bunch of 8 yellow Asiatic lilies that bring brightness and cheer to any room.	https://plus.unsplash.com/premium_photo-1690339279900-afce69cba58e?w=600&auto=format&fit=crop&q=60	649.00	14	1
17	Snake Plant in Ceramic Pot	Air-purifying snake plant in a white ceramic pot — low maintenance, high impact.	https://plus.unsplash.com/premium_photo-1690339279900-afce69cba58e?w=600&auto=format&fit=crop&q=60	599.00	17	3
10	Red Roses Bunch	A classic bouquet of 12 fresh red roses, hand-tied with seasonal greens and elegant wrapping.	https://plus.unsplash.com/premium_photo-1690339279900-afce69cba58e?w=600&auto=format&fit=crop&q=60	499.00	16	1
13	Pink Elegance Bouquet	A stylish arrangement of pink roses, carnations, and baby’s breath wrapped in pastel paper.	https://plus.unsplash.com/premium_photo-1690339279900-afce69cba58e?w=600&auto=format&fit=crop&q=60	799.00	11	2
12	White Daisy Delight	A fresh arrangement of white daisies perfect for light-hearted wishes and everyday gifting.	https://plus.unsplash.com/premium_photo-1690339279900-afce69cba58e?w=600&auto=format&fit=crop&q=60	399.00	17	1
16	Lucky Bamboo (2 Layer)	A compact 2-layer Lucky Bamboo plant in a glass vase for good luck and prosperity.	https://plus.unsplash.com/premium_photo-1690339279900-afce69cba58e?w=600&auto=format&fit=crop&q=60	349.00	24	3
14	Love You Forever Bouquet	Luxurious bouquet with red roses, white lilies, and orchids in premium wrap.	https://plus.unsplash.com/premium_photo-1690339279900-afce69cba58e?w=600&auto=format&fit=crop&q=60	999.00	8	2
\.


--
-- Data for Name: shippinginfo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shippinginfo (id, order_id, full_name, email, phone, delivery_method, pickup_time, address, city, state, country, zip) FROM stdin;
1	1	Meera	meera789@example.com	1234567890	pickup	2024-06-01 11:00:00	123 Main Street	Mumbai	MH	India	400001
2	3	kushal r	kushal@x.com	7412589630	delivery	\N	249, the neighbourhood	hyderabad	ts	India	500014
3	4	kushal r	kushal@x.com	7458963210	pickup	2025-07-13 12:15:00	123 Main Street	Mumbai	MH	India	400001
4	5	kushal r	kushal@x.com	4567891230	delivery	\N	dnsmcksmcm	hyderabad	ts	India	500014
5	6	kushal	kushal@y.com	1478523690	delivery	\N	2392ejd	hyd	ts	India	500014
6	7	kushal r	kushal@o.com	7894561230	pickup	2025-07-19 15:20:00	123 Main Street	Mumbai	MH	India	400001
7	8	kushal r	kushal@z.com	9874561230	pickup	2025-07-14 11:30:00	123 Main Street	Mumbai	MH	India	400001
8	9	kushal r	kushal@gmail.com	9873210456	delivery	\N	249, neighbourhood	hyderabad	ts	India	500014
9	10	kushal r	kushal@gmail.com	7412589630	delivery	\N	zxy	hyderabad	ts	India	500014
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, hashed_password, is_admin) FROM stdin;
2	Ayesha	ayesha123@example.com	$2b$12$dmn2f55eoZV5qMn5QGFfnOuR6gTKXiG.zH1/dloYJ89PY2NdvL0OW	f
3	Ravi	ravi456@example.com	$2b$12$msX4fKCbJGIiXjNmz5WomuiO9SZfGusYBTvvfRmjjgLrj9O8HXLcW	f
4	Meera	meera789@example.com	$2b$12$SVN7pnKKMOUKIJzL.LNmHuAgx3GquZsOvgx/p77SGG6HGdx/NGKca	f
1	Kushal	kushal@example.com	$2b$12$s/F4KL.nHLnAsv0oV8JzjeWaP0uRjlcsJJgQ35CF.aV8dukvcffie	t
5	kushal	kushalraga@icloud.com	$2b$12$tSehkraqK4/nUFdXYFgPlen3.r1n9OE7M/Cq7/6HB.EeOFUBENrd2	f
6	tonystank	tony@gmail.com	$2b$12$yuP2ZBHoIiFcKHoG3an2t.lHZ.0lPw8pQ6A4d5V25l4Gv5dk.6WNe	f
9	admin	admin@example.com	$2b$12$V/J2eSz/qZMspUB.ZFa/3O3XQ.YT.H.J0g/VqvdH9Ub7CLMPrNI4K	t
\.


--
-- Name: cartitems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cartitems_id_seq', 1, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 3, true);


--
-- Name: orderitems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orderitems_id_seq', 10, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 10, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 18, true);


--
-- Name: shippinginfo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shippinginfo_id_seq', 9, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: cartitems cartitems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartitems
    ADD CONSTRAINT cartitems_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: orderitems orderitems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT orderitems_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: shippinginfo shippinginfo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shippinginfo
    ADD CONSTRAINT shippinginfo_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_cartitems_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_cartitems_id ON public.cartitems USING btree (id);


--
-- Name: ix_categories_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_categories_id ON public.categories USING btree (id);


--
-- Name: ix_categories_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_categories_name ON public.categories USING btree (name);


--
-- Name: ix_orderitems_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_orderitems_id ON public.orderitems USING btree (id);


--
-- Name: ix_orders_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_orders_id ON public.orders USING btree (id);


--
-- Name: ix_products_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_products_id ON public.products USING btree (id);


--
-- Name: ix_shippinginfo_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_shippinginfo_id ON public.shippinginfo USING btree (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_username ON public.users USING btree (username);


--
-- Name: cartitems cartitems_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartitems
    ADD CONSTRAINT cartitems_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: cartitems cartitems_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartitems
    ADD CONSTRAINT cartitems_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: orderitems orderitems_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT orderitems_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: orderitems orderitems_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT orderitems_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: shippinginfo shippinginfo_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shippinginfo
    ADD CONSTRAINT shippinginfo_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

