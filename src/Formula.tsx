import katex from 'katex';
export function Formula({ tex, block = false }: { tex: string; block?: boolean }) {
  return <span className={block ? 'formula block-formula' : 'formula'} dangerouslySetInnerHTML={{ __html: katex.renderToString(tex, { throwOnError: false, displayMode: block, output: 'htmlAndMathml' }) }} />;
}
