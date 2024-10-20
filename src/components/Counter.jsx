import React, { useState } from "react";

const Counter = function() {
    const [count, setCount] = useState(0)

    function increment() {
        setCount(count + 1)
    }

    function dencrement() {
        setCount(count - 1)
    }

    return(
        <div>
            <h1>{count}</h1>
            <button onClick={increment}>Increment</button>
            <button onClick={dencrement}>Decrement</button>
        </div>
    )
}

export default Counter;