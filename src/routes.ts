import { Request, Response } from 'express';

let history: string[] = [];

export const evaluateExpression = (req: Request, res: Response) => {
    let { expression } = req.body;

    try {
        if (/[^0-9+\-*/().]/.test(expression)) {
            throw new Error('На данный момент уравнение не поддерживаются');
        }

        if(/^[+\-*/]/.test(expression)) {
            expression = '0' + expression;
        }

        const result = eval(expression);

        if (!isFinite(result)) {
            throw new Error('Деление на ноль невозможно');
        }

        const output = `${expression} = ${result}`;
        history.push(output);
        res.status(200).json({ result: output, history });

    } catch (error) {
        // @ts-ignore
        res.status(400).json({ error: error.message, history});
    }
};
