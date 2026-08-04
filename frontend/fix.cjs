const fs = require('fs');
let content = fs.readFileSync('src/LandingPage.jsx', 'utf8');

const target = `        footerText: "© 2026 26i للحلول التقنية العالمية. جميع الحقوق محفوظة."
    }
,
        blogArticles: arArticles
    };`;

const replacement = `        footerText: "© 2026 26i للحلول التقنية العالمية. جميع الحقوق محفوظة.",
        blogArticles: arArticles
    }
};`;

// Try CRLF first
let targetCRLF = `        footerText: "© 2026 26i للحلول التقنية العالمية. جميع الحقوق محفوظة."\r\n    }\r\n,\r\n        blogArticles: arArticles\r\n    };`;
let replacementCRLF = `        footerText: "© 2026 26i للحلول التقنية العالمية. جميع الحقوق محفوظة.",\r\n        blogArticles: arArticles\r\n    }\r\n};`;

if (content.includes(targetCRLF)) {
    content = content.replace(targetCRLF, replacementCRLF);
} else {
    content = content.replace(target, replacement);
}

fs.writeFileSync('src/LandingPage.jsx', content);
console.log("Success");
