const fs = require('fs');

// Read the old file containing the endpoints we want to extract
const apiOld = fs.readFileSync('routes/api_from_15cac33.js', 'utf16le'); // Oh wait, I checked earlier, it was utf16le? 
// No, I dumped it with `Get-Content`, wait, `git show` in PS outputs utf16le.
// I will read it using a more robust way.
