import { Request, Response } from 'express';
import { CalcEngine } from './calcEngine';

const calcEngine = new CalcEngine();
let history: string[] = [];

export const evaluateExpression = (req: Request, res: Response) => {
    let { expression } = req.body;

    try {

        if (/^[+\-*/]/.test(expression)) {
            expression = '0' + expression;
        }


        const result = calcEngine.evaluate(expression);

        const output = `${expression} = ${result}`;
        history.push(output);
        res.status(200).json({ result: output, history });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        res.status(400).json({ error: errorMessage, history });
    }
};
