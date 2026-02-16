import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { Extension, Node } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';

export const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      colspan: {
        default: 1,
        parseHTML: (element: HTMLElement) => {
          const colspan = element.getAttribute('colspan');
          return colspan ? parseInt(colspan, 10) : 1;
        },
        renderHTML: (attributes: any) => {
          if (attributes.colspan === 1) {
            return {};
          }
          return { colspan: attributes.colspan };
        }
      },
      rowspan: {
        default: 1,
        parseHTML: (element: HTMLElement) => {
          const rowspan = element.getAttribute('rowspan');
          return rowspan ? parseInt(rowspan, 10) : 1;
        },
        renderHTML: (attributes: any) => {
          if (attributes.rowspan === 1) {
            return {};
          }
          return { rowspan: attributes.rowspan };
        }
      },
      colwidth: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const colwidth = element.getAttribute('colwidth');
          return colwidth ? [parseInt(colwidth, 10)] : null;
        },
        renderHTML: (attributes: any) => {
          if (!attributes.colwidth) {
            return {};
          }
          return { colwidth: attributes.colwidth.join(',') };
        }
      },
      // Custom attributes
      style: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('style'),
        renderHTML: (attributes: any) => {
          if (!attributes.style) {
            return {};
          }
          return { style: attributes.style };
        }
      },
      bgcolor: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('bgcolor'),
        renderHTML: (attributes: any) => {
          if (!attributes.bgcolor) {
            return {};
          }
          return { bgcolor: attributes.bgcolor };
        }
      },
      align: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('align'),
        renderHTML: (attributes: any) => {
          if (!attributes.align) {
            return {};
          }
          return { align: attributes.align };
        }
      }
    };
  }
});

export const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      // Get default attributes from TableHeader
      colspan: {
        default: 1,
        parseHTML: (element: HTMLElement) => {
          const colspan = element.getAttribute('colspan');
          return colspan ? parseInt(colspan, 10) : 1;
        },
        renderHTML: (attributes: any) => {
          if (attributes.colspan === 1) {
            return {};
          }
          return { colspan: attributes.colspan };
        }
      },
      rowspan: {
        default: 1,
        parseHTML: (element: HTMLElement) => {
          const rowspan = element.getAttribute('rowspan');
          return rowspan ? parseInt(rowspan, 10) : 1;
        },
        renderHTML: (attributes: any) => {
          if (attributes.rowspan === 1) {
            return {};
          }
          return { rowspan: attributes.rowspan };
        }
      },
      colwidth: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const colwidth = element.getAttribute('colwidth');
          return colwidth ? [parseInt(colwidth, 10)] : null;
        },
        renderHTML: (attributes: any) => {
          if (!attributes.colwidth) {
            return {};
          }
          return { colwidth: attributes.colwidth.join(',') };
        }
      },
      // Custom attributes
      style: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('style'),
        renderHTML: (attributes: any) => {
          if (!attributes.style) {
            return {};
          }
          return { style: attributes.style };
        }
      },
      bgcolor: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('bgcolor'),
        renderHTML: (attributes: any) => {
          if (!attributes.bgcolor) {
            return {};
          }
          return { bgcolor: attributes.bgcolor };
        }
      },
      align: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('align'),
        renderHTML: (attributes: any) => {
          if (!attributes.align) {
            return {};
          }
          return { align: attributes.align };
        }
      }
    };
  }
});

export const GlobalStyleExtension = Extension.create({
  name: 'globalStyle',

  addGlobalAttributes() {
    return [
      {
        types: [
          'heading',
          'paragraph',
          'image',
          'listItem',
          'bulletList',
          'orderedList',
          'div',
          'span',
          'blockquote',
          'codeBlock'
        ],
        attributes: {
          style: {
            default: null,
            parseHTML: (element: HTMLElement) => element.getAttribute('style'),
            renderHTML: (attributes: any) => {
              if (!attributes.style) return {};
              return { style: attributes.style };
            }
          },
          class: {
            default: null,
            parseHTML: (element: HTMLElement) => element.getAttribute('class'),
            renderHTML: (attributes: any) => {
              if (!attributes.class) return {};
              return { class: attributes.class };
            }
          },
          align: {
            default: null,
            parseHTML: (element: HTMLElement) => element.getAttribute('align'),
            renderHTML: (attributes: any) => {
              if (!attributes.align) return {};
              return { align: attributes.align };
            }
          },
          width: {
            default: null,
            parseHTML: (element: HTMLElement) => element.getAttribute('width'),
            renderHTML: (attributes: any) => {
              if (!attributes.width) return {};
              return { width: attributes.width };
            }
          },
          height: {
            default: null,
            parseHTML: (element: HTMLElement) => element.getAttribute('height'),
            renderHTML: (attributes: any) => {
              if (!attributes.height) return {};
              return { height: attributes.height };
            }
          }
        }
      }
    ];
  }
});

export const DivExtension = Node.create({
  name: 'div',
  group: 'block',
  content: 'block*',
  parseHTML() {
    return [{ tag: 'div' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', HTMLAttributes, 0];
  },
  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('style'),
        renderHTML: (attributes: any) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        }
      },
      class: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('class'),
        renderHTML: (attributes: any) => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        }
      },
      align: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('align'),
        renderHTML: (attributes: any) => {
          if (!attributes.align) return {};
          return { align: attributes.align };
        }
      }
    };
  }
});

export const EmailImageExtension = Image.extend({
  addAttributes() {
    return {
      // Default Image attributes
      src: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('src'),
        renderHTML: (attributes: any) => {
          if (!attributes.src) return {};
          return { src: attributes.src };
        }
      },
      alt: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('alt'),
        renderHTML: (attributes: any) => {
          if (!attributes.alt) return {};
          return { alt: attributes.alt };
        }
      },
      title: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('title'),
        renderHTML: (attributes: any) => {
          if (!attributes.title) return {};
          return { title: attributes.title };
        }
      },
      // Custom attributes
      style: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('style'),
        renderHTML: (attributes: any) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        }
      },
      width: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('width'),
        renderHTML: (attributes: any) => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        }
      },
      height: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('height'),
        renderHTML: (attributes: any) => {
          if (!attributes.height) return {};
          return { height: attributes.height };
        }
      },
      align: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('align'),
        renderHTML: (attributes: any) => {
          if (!attributes.align) return {};
          return { align: attributes.align };
        }
      },
      border: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('border'),
        renderHTML: (attributes: any) => {
          if (!attributes.border) return {};
          return { border: attributes.border };
        }
      }
    };
  }
});

export const EmailTable = Table.extend({
  addAttributes() {
    return {
      align: {
        default: 'center',
        parseHTML: (element: HTMLElement) =>
          element.getAttribute('align') || 'center',
        renderHTML: (attributes: any) => ({
          align: attributes.align || 'center'
        })
      },
      style: {
        default: 'margin: 0 auto; width: 80%;',
        parseHTML: (element: HTMLElement) =>
          element.getAttribute('style') || 'margin: 0 auto; width: 80%;',
        renderHTML: (attributes: any) => ({
          style: attributes.style || 'margin: 0 auto; width: 80%;'
        })
      }
    };
  }
});

export const CustomTableRow = TableRow.extend({
  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('style'),
        renderHTML: (attributes: any) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        }
      },
      bgcolor: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('bgcolor'),
        renderHTML: (attributes: any) => {
          if (!attributes.bgcolor) return {};
          return { bgcolor: attributes.bgcolor };
        }
      },
      align: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('align'),
        renderHTML: (attributes: any) => {
          if (!attributes.align) return {};
          return { align: attributes.align };
        }
      }
    };
  }
});
