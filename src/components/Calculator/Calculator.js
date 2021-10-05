import React, { useState, useEffect, useRef } from 'react';
import './Calculator.css'
import Button from './Button/Button';

const Calculator = () => {
    const [firstTerm, setFirstTerm] = useState(null);
    const [operator, setOperator] = useState(null);
    const [secondTerm, setSecondTerm] = useState(null);
    const [value, setValue] = useState(null);
    const [history, setHistory] = useState([]);
    const [justCalculated, setJustCalculated] = useState(false);

    // useEffect(() => {
    //     console.log(firstTerm, operator, secondTerm, value)
    // }, [firstTerm, operator, secondTerm, value])

    useEffect(() => {
        if (justCalculated) {
            setHistory([...history, {firstTerm, operator, secondTerm, value}].reverse())
            setFirstTerm(null)
            setOperator(null)
            setSecondTerm(null)
        }
        return () => {
            setJustCalculated(false)
        }
    }, [justCalculated])

    function renderButton(button, type) {
        return (
          <Button 
            button={button}
            type={type}
            onClick={handleClickOptions}
          />
        )
    }

    function handleClickOptions(button) {
        if (value && !firstTerm) {
            if (Number.isInteger(button)) {
                handleNumberClick(parseInt(button));
            } else if (["/", "x", "+", "-"].includes(button)) {
                setFirstTerm(String(value))
                setOperator(button)
            } else if (button === 'AC' || button === 'C') {
                handleClear(button)
            } else if (button === 'ans') {
                handleAnswer()
            } else if (button === 'clear hist') {
                clearHistory()
            }
        } else {
            if (Number.isInteger(button)) {
                handleNumberClick(parseInt(button));
            } else if (["/", "x", "+", "-"].includes(button)) {
                handleOperatorClick(button)
            } else if (button === 'del') {
                handleDeleteNumber()
            } else if (button === 'AC' || button === 'C') {
                handleClear(button)
            } else if (button === String.fromCharCode(177)) {
                handleInverseSign()
            } else if (button === '%') {
                handlePercentage()
            } else if (button === '.') {
                handleDecimal()
            } else if (button === '=') {
                calculate()
            } else if (button === 'ans') {
                handleAnswer()
            } else if (button === 'clear hist') {
                clearHistory()
            }
        }
    }

    function handleNumberClick(number) {
        if (operator === null) {
            if (!firstTerm || firstTerm.length <= 20) {
                if (firstTerm === null) {
                    setFirstTerm(String(number))
                } else {
                    if (firstTerm.length === 1 && firstTerm.charAt(0) === '0' && number !== '.') {
                        return
                    } else {
                        setFirstTerm(firstTerm + '' + String(number))
                    }
                }
            }
            
        } else {
            if (!secondTerm || secondTerm.length <= 20) {
                if (secondTerm === null) {
                    setSecondTerm(String(number))
                } else {
                    if (secondTerm.length === 1 && secondTerm.charAt(0) === '0' && number !== '.') {
                        return
                    } else {
                        setSecondTerm(secondTerm + '' + String(number))
                    }
                }
            } 
        }
        
    }

    function handleOperatorClick(operatorValue) {
        if (firstTerm && firstTerm.charAt(firstTerm.length-1) !== '.' && secondTerm === null) {
            setOperator(operatorValue)
        }
    }

    function handleClear(button) {
        if (button === 'AC') {
            setFirstTerm(null)
            setOperator(null)
            setSecondTerm(null)
            setValue(null)
        } else if (button === 'C') {
            setFirstTerm(null)
            setOperator(null)
            setSecondTerm(null)
        }
    }

    function handleDeleteNumber() {
        if (secondTerm) {
            if (secondTerm.length > 1) {
                if (secondTerm.length === 2 && secondTerm.charAt(0) === '-') {
                    setSecondTerm(null)
                } else {
                    setSecondTerm(secondTerm.slice(0,-1))
                }
            } else  {
                setSecondTerm(null)
            }
        } else if (operator) {
            setOperator(null)
        } else if (firstTerm) {
            if (firstTerm.length > 1) {
                if (firstTerm.length === 2 && firstTerm.charAt(0) === '-') {
                    setFirstTerm(null)
                } else {
                    setFirstTerm(firstTerm.slice(0,-1))
                }
            } else {
                setFirstTerm(null)
            }
        }
    }

    function handleInverseSign() {
        if (secondTerm) {
            setSecondTerm(String(secondTerm*-1))
        } else if (firstTerm && operator === null) {
            console.log('inverse')
            setFirstTerm(String(firstTerm*-1))
        }
    }

    function handlePercentage() {
        if (secondTerm) {
            setSecondTerm(String(secondTerm/100))
        } else if (firstTerm) {
            setFirstTerm(String(firstTerm/100))
        }
    }

    function handleDecimal() {
        if (secondTerm) {
            if (!/\./.test(secondTerm) && secondTerm.length <= 19) {
                setSecondTerm((secondTerm + '.'));
            }
        } else if (firstTerm) {
            if (!/\./.test(firstTerm) && firstTerm.length <= 19) {
                setFirstTerm(firstTerm + '.')
            }
        }
    }

    function handleAnswer() {
        if (value && operator && firstTerm) {
            setSecondTerm(value)
        } else if (value && !firstTerm) {
            setFirstTerm(value)
        }
    }

    function calculate() {
        if (firstTerm && operator && secondTerm && firstTerm.charAt(firstTerm.length-1) !== '.' && secondTerm.charAt(secondTerm.length-1) !== '.') {
            if (operator === '+') {
                setValue(String(parseFloat(firstTerm) + parseFloat(secondTerm)))
            } else if (operator === '-') {
                setValue(String(parseFloat(firstTerm) - parseFloat(secondTerm)))
            } else if (operator === 'x') {
                setValue(String(parseFloat(firstTerm) * parseFloat(secondTerm)))
            } else if (operator === '/') {
                setValue(String(parseFloat(firstTerm) / parseFloat(secondTerm)))
            }
            setJustCalculated(true)
        }
    }
    
    function renderDisplay(firstTerm, operator, secondTerm, value) {       
        return (
            <div className="calculator-display-window">
                <div className="value">
                    { value ? value.toLocaleString() : '0' }
                </div>
                <div className="expression">
                    { (firstTerm ? firstTerm : '') + ' ' + (operator ? operator : '') + ' ' + (secondTerm ? secondTerm : '') }
                </div>
            </div>
        )
    }

    function renderHistory() {
        const History = history.map((history, index) => (<div className="history" key={index}>{history.firstTerm} {history.operator} {history.secondTerm} = {history.value}</div>))
    
        return (
            History
        )
    }

    function clearHistory() {
        setHistory([])
    }

    return (
        <div className="body-container">
            <div className="calculator-container">
                <div className="calculator-display-window">
                    { renderDisplay(firstTerm, operator, secondTerm, value) }
                </div>
                <div className="calculator-body">
                    <div className="button-row">
                        {renderButton(firstTerm === null ? 'AC' : 'C', 'purple')}
                        {renderButton(String.fromCharCode(177), 'purple')}
                        {renderButton('%', 'purple')}
                        {renderButton('/', 'purple')}
                    </div>
                    <div className="button-row">
                        {renderButton(7, 'white')}
                        {renderButton(8, 'white')}
                        {renderButton(9, 'white')}
                        {renderButton('x', 'purple')}
                    </div>
                    <div className="button-row">
                        {renderButton(4, 'white')}
                        {renderButton(5, 'white')}
                        {renderButton(6, 'white')}
                        {renderButton('-', 'purple')}
                    </div>
                    <div className="button-row">
                        {renderButton(1, 'white')}
                        {renderButton(2, 'white')}
                        {renderButton(3, 'white')}
                        {renderButton('+', 'purple')}
                    </div>
                    <div className="button-row">
                        {renderButton('del', 'purple')}
                        {renderButton(0, 'white')}
                        {renderButton('.', 'white')}
                        {renderButton('=', 'purple')}
                    </div>
                    <div className="button-row">
                        {renderButton('clear hist', 'purple')}
                        {renderButton('ans', 'purple')}
                    </div>
                </div>
            </div>
            <div className="history-container">
                <h2>History</h2>
                { renderHistory() }
            </div>
        </div>
    )
}

export default Calculator