import { CalcException, exceptions } from './exceptions';

export class CalcEngine {
    private operators: { [key: string]: { precedence: number, assoc: 'L' | 'R', method: (a: number, b: number) => number } } = {
        '+': { precedence: 2, assoc: 'L', method: (a, b) => a + b },
        '-': { precedence: 2, assoc: 'L', method: (a, b) => a - b },
        '*': { precedence: 3, assoc: 'L', method: (a, b) => a * b },
        '/': { precedence: 3, assoc: 'L', method: (a, b) => {
                if (b === 0) throw new CalcException('Деление на ноль невозможно');
                return a / b;
            } },
    };

    private isOperator(token: string): boolean {
        return Object.keys(this.operators).includes(token);
    }

    private shuntingYard(expression: string): string[] {
        const outputQueue: string[] = [];
        const operatorStack: string[] = [];
        const tokens = expression.match(/(\d+\.?\d*|\+|\-|\*|\/|\(|\))/g);

        if (!tokens) {
            throw new Error("Invalid expression");
        }

        for (const token of tokens) {
            if (/\d/.test(token)) {
                outputQueue.push(token);
            } else if (this.isOperator(token)) {
                const o1 = token;
                let o2 = operatorStack[operatorStack.length - 1];
                while (this.isOperator(o2) &&
                ((this.operators[o1].assoc === 'L' && this.operators[o1].precedence <= this.operators[o2].precedence) ||
                    (this.operators[o1].assoc === 'R' && this.operators[o1].precedence < this.operators[o2].precedence))) {
                    outputQueue.push(operatorStack.pop()!);
                    o2 = operatorStack[operatorStack.length - 1];
                }
                operatorStack.push(o1);
            } else if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                while (operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop()!);
                }
                operatorStack.pop(); // Remove the '('
            }
        }

        while (operatorStack.length > 0) {
            outputQueue.push(operatorStack.pop()!);
        }

        return outputQueue;
    }

    private evaluateRPN(rpn: string[]): number {
        const stack: number[] = [];

        for (const token of rpn) {
            if (/\d/.test(token)) {
                stack.push(parseFloat(token));
            } else if (this.isOperator(token)) {
                const b = stack.pop()!;
                const a = stack.pop()!;
                const operation = this.operators[token].method;
                stack.push(operation(a, b));
            }
        }

        return stack[0];
    }

    public evaluate(expression: string): number {
        // Применяем все исключения
        for (const key in exceptions) {
            exceptions[key](expression);
        }

        // Преобразование инфиксного выражения в постфиксное (RPN)
        const rpn = this.shuntingYard(expression);

        // Вычисление результата из постфиксного выражения
        return this.evaluateRPN(rpn);
    }
}
