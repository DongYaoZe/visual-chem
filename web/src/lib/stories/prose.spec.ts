import { describe, expect, it } from 'vitest';
import { parseInline, parseProse } from './prose';

describe('parseInline', () => {
	it('passes plain text through as one segment', () => {
		expect(parseInline('hello world')).toEqual([{ type: 'text', value: 'hello world' }]);
	});

	it('splits bold and math spans out of surrounding text', () => {
		expect(parseInline('a **b** c $x^2$ d')).toEqual([
			{ type: 'text', value: 'a ' },
			{ type: 'strong', value: 'b' },
			{ type: 'text', value: ' c ' },
			{ type: 'math', value: 'x^2' },
			{ type: 'text', value: ' d' }
		]);
	});

	it('handles adjacent spans and spans at the edges', () => {
		expect(parseInline('**a**$b$')).toEqual([
			{ type: 'strong', value: 'a' },
			{ type: 'math', value: 'b' }
		]);
	});
});

describe('parseProse', () => {
	it('splits blank-line separated paragraphs', () => {
		const blocks = parseProse('one\n\ntwo');
		expect(blocks).toHaveLength(2);
		expect(blocks[0].kind).toBe('p');
		expect(blocks[1].kind).toBe('p');
	});

	it('recognizes display-math blocks', () => {
		const blocks = parseProse('before\n\n$$S = k \\ln W$$\n\nafter');
		expect(blocks[1]).toEqual({ kind: 'math', formula: 'S = k \\ln W' });
	});

	it('recognizes multi-line dash lists with inline markup', () => {
		const blocks = parseProse('- **bold** item\n- plain $x$ item');
		expect(blocks).toHaveLength(1);
		const list = blocks[0];
		expect(list.kind).toBe('list');
		if (list.kind === 'list') {
			expect(list.items).toHaveLength(2);
			expect(list.items[0][0]).toEqual({ type: 'strong', value: 'bold' });
		}
	});

	it('treats a single dash line as a paragraph, not a list', () => {
		expect(parseProse('- lonely line')[0].kind).toBe('p');
	});
});
