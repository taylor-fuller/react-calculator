import React, { useState, useEffect } from 'react';
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
        // when justCalculated is changed, we will set history and reset firstTerm, secondTerm, and operator
        if (justCalculated) {
            // add new history entry to array and reverse so map will show most recent entries first
            setHistory([...history, {firstTerm, operator, secondTerm, value}].reverse())
            setFirstTerm(null)
            setOperator(null)
            setSecondTerm(null)
        }
        return () => {
            // reset justCalculated on cleanup
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
        // if we have a value and don't have a firstTerm...
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
            // if we don't have a value or we have a firstTerm...
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
        //  determine if we need to add number to firstTerm or secondTerm based on whether or not there is an operator
        if (operator === null) {
            // if firstTerm is null or firstTerm length is less than or equal to 20...
            if (!firstTerm || firstTerm.length < 20) {
                //  check if firstTerm is null or not, if it is, set firstTerm to entered number on key
                if (firstTerm === null) {
                    setFirstTerm(String(number))
                //  if firstTerm is not null...
                } else {
                    // if firstTerm length is 1 and the first number is a zero, we can't add another number but we can add a decimal
                    if (firstTerm.length === 1 && firstTerm.charAt(0) === '0' && number !== '.') {
                        return
                    } else {
                        // if firstTerm is not null and does not have a length of 1, concat number to current number
                        setFirstTerm(firstTerm + String(number))
                    }
                }
            }
        //  if we have an operator selected, modify secondTerm
        } else {
            // if secondTerm is null or secondTerm length is less than or equal to 20...
            if (!secondTerm || secondTerm.length < 20) {
                //  check if secondTerm is null or not, if it is, set secondTerm to entered number on key
                if (secondTerm === null) {
                    setSecondTerm(String(number))
                //  if secondTerm is not null...
                } else {
                    // if secondTerm length is 1 and the first number is a zero, we can't add another number but we can add a decimal
                    if (secondTerm.length === 1 && secondTerm.charAt(0) === '0' && number !== '.') {
                        return
                    } else {
                        // if secondTerm is not null and does not have a length of 1, concat number to current number
                        setSecondTerm(secondTerm + String(number))
                    }
                }
            } 
        }
        
    }

    function handleOperatorClick(operatorValue) {
        // when an operator is clicked, verify we have a firstTerm, the final character of the firstTerm isn't a decimal, and that secondTerm is null...
        if (firstTerm && firstTerm.charAt(firstTerm.length-1) !== '.' && secondTerm === null) {
            setOperator(operatorValue)
        }
    }

    function handleClear(button) {
        // if button is all clear, clear all states
        if (button === 'AC') {
            setFirstTerm(null)
            setOperator(null)
            setSecondTerm(null)
            setValue(null)
        // else clear all but value
        } else if (button === 'C') {
            setFirstTerm(null)
            setOperator(null)
            setSecondTerm(null)
        }
    }

    function handleDeleteNumber() {
        // if we have a secondTerm, modify secondTerm
        if (secondTerm) {
            //  verify secondTerm length is greater than 1 so we don't remove a number that preceeds a minus sign, leaving only the minus sign
            if (secondTerm.length > 1) {
                // if secondTerm length is 2, check if we have a minus sign at the beginning, if we do, set secondTerm to null
                if (secondTerm.length === 2 && secondTerm.charAt(0) === '-') {
                    setSecondTerm(null)
                // if secondTerm has a length greater than 2...
                } else {
                    setSecondTerm(secondTerm.slice(0,-1))
                }
            // if secondTerm length is equal to 1, set secondTerm to null
            } else {
                setSecondTerm(null)
            }
        // if we don't have a secondTerm but we have an operator, remove operator
        } else if (operator) {
            setOperator(null)
        // if we don't have a secondTerm or an operator, modify firstTerm
        } else if (firstTerm) {
            // repeat logic from above to prevent firstTerm from having a number removed and being left with only a minus sign
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
        // if we have a secondTerm, modify secondTerm
        if (secondTerm) {
            setSecondTerm(String(secondTerm*-1))
        // if we don't have a secondTerm, modify firstTerm
        } else if (firstTerm && operator === null) {
            setFirstTerm(String(firstTerm*-1))
        }
    }

    function handlePercentage() {
        // if we have a secondTerm, modify secondTerm
        if (secondTerm) {
            setSecondTerm(String(secondTerm/100))
        // if we don't have a secondTerm, modify firstTerm
        } else if (firstTerm) {
            setFirstTerm(String(firstTerm/100))
        }
    }

    function handleDecimal() {
        // if we have a secondTerm, modify secondTerm
        if (secondTerm) {
            // if secondTerm doesn't already contain a decimal, and the secondTermlength is less than 19, add decimal
            if (!/\./.test(secondTerm) && secondTerm.length < 19) {
                setSecondTerm((secondTerm + '.'));
            }
        // if we don't have a secondTerm, modify firstTerm
        } else if (firstTerm) {
            // if firstTerm doesn't already contain a decimal, and the secondTermlength is less than 19, add decimal
            if (!/\./.test(firstTerm) && firstTerm.length < 19) {
                setFirstTerm(firstTerm + '.')
            }
        }
    }

    function handleAnswer() {
        //  if we have a value, an operator and a first term, modify secondTerm
        if (value && operator && firstTerm) {
            setSecondTerm(value)
        //  if we have a value and firstTerm is null, modify firstTerm
        } else if (value && !firstTerm) {
            setFirstTerm(value)
        }
    }

    function calculate() {
        // if we have a firstTerm, operator, secondTerm, the last character in the firstTerm and the secondTerm aren't a decimal, solve 
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
            // set justCalculated true to trigger useEffect to modify history
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