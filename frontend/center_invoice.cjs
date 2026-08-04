const fs = require('fs');
let lines = fs.readFileSync('src/App.jsx', 'utf8').split('\n');

const startIdx = lines.findIndex(l => l.includes('<div id="invoicePrintArea"'));
if (startIdx !== -1) {
    // Inject opening wrapper before this line
    lines.splice(startIdx, 0, "                                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '20px' }}>");
    
    // Now find the end of the return statement for this div
    // It should be followed by `);` and then `})()}`
    const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes(');') && lines[i+1] && lines[i+1].includes('})()}'));
    
    if (endIdx !== -1) {
        // We want to put the closing div of the wrapper before `);`
        // Wait, `);` is the end of the return statement for the IIFE.
        // The return statement is returning JSX.
        // If we wrap the outer element, the return statement is:
        /*
        return (
            <div style={{...wrapper...}}>
                <div id="invoicePrintArea"...>
                    ...
                </div>
            </div>
        );
        */
        // Let's find the closing `</div>` that belongs to `invoicePrintArea`.
        // We know it is immediately before `);`
        // Let's verify line endIdx - 1
        console.log("End line - 1:", lines[endIdx - 1]);
        if (lines[endIdx - 1].includes('</div>')) {
            lines.splice(endIdx, 0, "                                </div>"); // close the wrapper div
            fs.writeFileSync('src/App.jsx', lines.join('\n'));
            console.log("Success wrapping invoicePrintArea");
        } else {
            console.log("Could not find closing div. Found:", lines[endIdx-1]);
        }
    } else {
        console.log("Could not find end index");
    }
} else {
    console.log("Could not find start index");
}
