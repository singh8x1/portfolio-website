const fs = require('fs');
let code = fs.readFileSync('src/components/WesternDragon.tsx', 'utf8');

code = code.replace(/=== 'chinese'/g, "=== 'eagle'");
code = code.replace(/!== 'chinese'/g, "!== 'eagle'");
code = code.replace(/=== 'indian'/g, "=== 'serpent'");
code = code.replace(/!== 'indian'/g, "!== 'serpent'");
code = code.replace(/=== 'western'/g, "=== 'mantaray'");
code = code.replace(/!== 'western'/g, "!== 'mantaray'");
code = code.replace(/'western' \| 'chinese'/g, "'mantaray' | 'eagle'");
code = code.replace(/Golden Griffin/g, "Golden Eagle");
code = code.replace(/Indian Nāga/g, "Emerald Serpent");
code = code.replace(/Western Wyvern/g, "Cosmic Mantaray");

fs.writeFileSync('src/components/WesternDragon.tsx', code);
console.log('Replaced.');
