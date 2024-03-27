import express, { Request, Response } from 'express';
import "http-status-codes"

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
