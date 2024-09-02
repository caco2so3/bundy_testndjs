export class CalcException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CalcException";
    }
}

export const exceptions: { [key: string]: (input: string) => void } = {
    "contains_letters": (input: string) => {
        if (/[a-zA-Z]/.test(input)) {
            throw new CalcException("На данный момент уравнение не поддерживаются");
        }
    },
    "division_by_zero": (input: string) => {
        if (/\/0/.test(input)) {
            throw new CalcException("Деление на ноль невозможно");
        }
    },
    "invalid_operator_sequence": (input: string) => {

        if (/(\D)\1+/.test(input.replace(/\d+/g, ''))) {
            throw new CalcException("Некорректная последовательность операторов");
        }

        if (/^[+\-*/=]|[+\-*/=]$/.test(input)) {
            throw new CalcException("Некорректный конец выражения");
        }
    }
};
