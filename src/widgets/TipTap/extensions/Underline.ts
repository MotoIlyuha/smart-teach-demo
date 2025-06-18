import {Mark} from '@tiptap/core';

const Underline = Mark.create({
  name: 'underline',
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  parseHTML() {
    return [
      { tag: 'u' },
      {
        style: 'text-decoration',
        consuming: false,
        getAttrs: (value) =>
          (value as string).includes('underline') ? null : false,
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['u', { ...this.options.HTMLAttributes, ...HTMLAttributes }, 0];
  },
  addCommands() {
    return {
      toggleUnderline: () => ({ commands }) => commands.toggleMark(this.name),
    };
  },
  addKeyboardShortcuts() {
    return {
      'Mod-u': () => this.editor.commands.toggleUnderline(),
    };
  },
});

export default Underline;
