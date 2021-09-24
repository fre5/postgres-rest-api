import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './handlers/user';
import productRoutes from './handlers/products';
import orderRoutes from './handlers/order';
import dashboardRoutes from './handlers/dashboard';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

userRoutes(app);
productRoutes(app);
orderRoutes(app);
dashboardRoutes(app);

app.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});

export default app;
