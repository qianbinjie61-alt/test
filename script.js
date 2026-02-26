const form = document.querySelector('#calculator-form');
const firstNumberInput = document.querySelector('#first-number');
const secondNumberInput = document.querySelector('#second-number');
const operatorSelect = document.querySelector('#operator');
const resultElement = document.querySelector('#result');

function calculate(first, second, operator) {
  switch (operator) {
    case 'add':
      return first + second;
    case 'subtract':
      return first - second;
    case 'multiply':
      return first * second;
    case 'divide':
      if (second === 0) {
        throw new Error('除数不能为 0。');
      }
      return first / second;
    default:
      throw new Error('不支持的运算符。');
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const first = Number(firstNumberInput.value);
  const second = Number(secondNumberInput.value);
  const operator = operatorSelect.value;

  try {
    const result = calculate(first, second, operator);
    resultElement.textContent = `结果：${result}`;
  } catch (error) {
    resultElement.textContent = error.message;
  }
});
