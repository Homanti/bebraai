import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { Root, Code } from 'mdast';

export const remarkStripFilename: Plugin<[], Root> = () => {
    return (tree) => {
        visit(tree, 'code', (node: Code) => {
            const lines = node.value.split('\n');
            const lastLine = lines[lines.length - 1];

            const match = lastLine.match(/^```filename="(.+?)"$/);
            if (match) {
                lines.pop();
                node.value = lines.join('\n').trimEnd();
                node.meta = `filename="${match[1]}"`;
            }
        });
    };
};