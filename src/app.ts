import express from 'express';
import { evaluateExpression } from './routes';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, '../public')));

app.post('/evaluate', evaluateExpression);

app.listen(port, ()=> {
    console.log("Server running on http://localhost:${PORT}")
});