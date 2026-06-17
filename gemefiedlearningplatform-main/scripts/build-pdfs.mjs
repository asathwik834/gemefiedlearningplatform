import { mdToPdf } from 'md-to-pdf';
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const docsDir = path.join(root, 'docs');
const outDir = path.join(root, 'pdfs');

if (!fs.existsSync(docsDir)) {
  console.error(`Docs directory not found at ${docsDir}`);
  process.exit(1);
}
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const cssPath = path.join(docsDir, 'style.css');
const files = fs.readdirSync(docsDir).filter(f => f.toLowerCase().endsWith('.md'));

const run = async () => {
  if (files.length === 0) {
    console.warn('No markdown files found in docs/.');
    return;
  }
  for (const file of files) {
    const inPath = path.join(docsDir, file);
    const base = path.basename(file, path.extname(file));
    const outPath = path.join(outDir, `${base}.pdf`);
    console.log(`Rendering ${file} -> ${outPath}`);
    try {
      const pdf = await mdToPdf({ path: inPath }, {
        dest: outPath,
        stylesheet: fs.existsSync(cssPath) ? [cssPath] : [],
        pdf_options: {
          format: 'A4',
          margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
          printBackground: true,
          displayHeaderFooter: true,
          footerTemplate: '<div style="font-size:8px; width:100%; text-align:center; color:#666;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
          headerTemplate: '<div></div>'
        }
      });
      if (pdf?.content) {
        console.log(`✓ Created: ${outPath}`);
      }
    } catch (err) {
      console.error(`Failed to render ${file}:`, err);
      process.exitCode = 1;
    }
  }
};

run();
