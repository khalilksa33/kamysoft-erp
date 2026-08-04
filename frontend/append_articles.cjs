const fs = require('fs');

const enNew = `,
    {
        slug: 'inventory-management',
        image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
        category: 'Inventory',
        title: 'Smart Inventory Management for Retail',
        desc: 'Optimize your stock levels and reduce holding costs.',
        content: '### Smart Inventory\\nDetailed inventory guide.'
    },
    {
        slug: 'crm-strategies',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
        category: 'Customer Relations',
        title: 'Building Customer Loyalty with CRM',
        desc: 'Leverage data to enhance customer experience.',
        content: '### CRM Strategies\\nDetailed CRM guide.'
    },
    {
        slug: 'financial-reporting',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
        category: 'Finance',
        title: 'Advanced Financial Reporting',
        desc: 'Gain insights into your business performance.',
        content: '### Financial Reporting\\nDetailed reporting guide.'
    }
`;

const arNew = `,
    {
        slug: 'inventory-management',
        image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
        category: 'المخزون',
        title: 'إدارة المخزون الذكية للتجزئة',
        desc: 'تحسين مستويات المخزون وتقليل تكاليف الاحتفاظ به.',
        content: 'دليل تفصيلي لإدارة المخزون.'
    },
    {
        slug: 'crm-strategies',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
        category: 'علاقات العملاء',
        title: 'بناء ولاء العملاء مع إدارة علاقات العملاء',
        desc: 'الاستفادة من البيانات لتعزيز تجربة العملاء.',
        content: 'دليل تفصيلي لعلاقات العملاء.'
    },
    {
        slug: 'financial-reporting',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
        category: 'المالية',
        title: 'التقارير المالية المتقدمة',
        desc: 'احصل على رؤى حول أداء عملك.',
        content: 'دليل تفصيلي للتقارير.'
    }
`;

let content = fs.readFileSync('src/data/blogArticles.js', 'utf8');

content = content.replace(/\}\n\];/g, (match, offset, string) => {
    return offset < string.length / 2 ? '}' + enNew + '];' : '}' + arNew + '];';
});

fs.writeFileSync('src/data/blogArticles.js', content);
