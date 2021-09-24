# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index - GET http://localhost:3000/products
- Show (args: product id) - GET http://localhost:3000/products/:id
- Create (args: Product)[token required] - POST http://localhost:3000/products
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required] - GET http://localhost:3000/users
- Show (args: id)[token required] - GET http://localhost:3000/users/:id
- Create (args: User)[token required] - POST http://localhost:3000/users

#### Orders
- Current Order by user (args: user id)[token required] - GET http://localhost:3000/current-order/:id
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product - CREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(64) NOT NULL, price integer NOT NULL);
- id
- name
- price
- [OPTIONAL] category

#### User - CREATE TABLE users (id SERIAL PRIMARY KEY, first_name VARCHAR(100), last_name VARCHAR(100), username VARCHAR(100), password_digest VARCHAR(200));
- id
- firstName
- lastName
- password

#### Orders - CREATE TABLE orders (id SERIAL PRIMARY KEY, status VARCHAR(64), user_id bigint REFERENCES users(id));
- id
- id of each product in the order (from products table)
- quantity of each product in the order (from order_products table)
- user_id 
- status of order (active or complete)

#### Order Products - CREATE TABLE order_products (id SERIAL PRIMARY KEY, quantity integer, order_id bigint REFERENCES orders(id), product_id bigint REFERENCES products(id));
- id
- quantity
- order_id (foreign key of order table id)
- product_id (foreign key of products table id)


## Complete Routes
GET /users                  - Get all users
GET /users/:id              - Get a user with a specified id
POST /users                 - Create a new user
POST /users/authenticate    - User sign in / create token
PUT /users/:id              - Update user password
DELETE /users               - Delete user 

GET /orders                 - Get all orders
GET /orders/:id             - Get an order by its id
POST /orders                - Create a new order
POST /orders/:id/products   - Add a new product

GET /products               - Get all products
GET /products/:id           - Get a product with a specified id
POST /products              - Add a product

GET /products-in-orders     - Get all the products in orders
GET /users-with-orders      - Get all the users with orders
GET /five-most-expensive    - Sort five most expensive products
GET /current-order/:id      - Retrieve an order from a specified user