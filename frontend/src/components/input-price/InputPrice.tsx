import { NumericFormat } from 'react-number-format';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface InputPriceProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    currency?: string;
    disabled?: boolean;
    error?: string;
    className?: string;
}

const InputPrice = <T extends FieldValues>({
    name,
    control,
    currency = 'R$ ',
    disabled = false,
    className = "w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600"
}: InputPriceProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <NumericFormat
                    value={value}
                    onValueChange={(values) => {
                        onChange(values.floatValue);
                    }}
                    displayType="input"
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix={currency}
                    decimalScale={2}
                    fixedDecimalScale
                    disabled={disabled}
                    className={className}
                    placeholder={`${currency} 0,00`}
                />
            )}
        />
    );
};

export default InputPrice;