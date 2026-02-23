import React, {useState} from 'react';

function App() {
    const [text, setText] = useState('');
    const [stack, setStack] = useState([]);
    const [inputChar, setInputChar] = useState('');

const addChar = (char) => {
    setStack([...stack, { op: 'add', char }]);
    setText(text + char);
}

const deleteChar = () => {
    if (text.length === 0) return;
    const char = text[text.length - 1];
    setStack([...stack, { op: 'delete', char }]);
    setText(text.slice(0, -1));
}

const undo = () => {
    if (stack.length === 0) return;
    const lastOp = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    if (lastOp.op === 'add') {
        setText(text.slice(0, -1));
    } else if (lastOp.op === 'delete') {
        setText(text + lastOp.char);
    }
}

    return (
        <div>
            <h1>Simple Text Editor with Undo</h1>
            <textarea value={text} readOnly />
            <input type="text" 
                value={inputChar}
                onChange={(e) => setInputChar(e.target.value)}
                maxLength={1}
                placeholder="Type a character"
            />
            <button onClick={() => addChar(inputChar)}>Add</button>
            <button onClick={deleteChar}>Delete</button>
            <button onClick={undo}>Undo</button>
            <div>
                <strong> Current Text: {text}</strong>
                <p>Type in the input box to add characters to the text area. Click "Delete" to remove the last character, and "Undo" to reverse the last operation.</p>
            </div>
        </div>
    );
}

export default App;