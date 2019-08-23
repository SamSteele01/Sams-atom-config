'use babel';

import InsertMetaProvider from '../lib/providers/insert-meta-provider';
import SQLMetaProvider from '../lib/providers/sql-meta-provider';

describe('InsertMetaProvider', () => {
  describe('Get columns', () => {
  let editor = {
    dataAtomColumns: [{
        name: 'test_col',
        tableName: 'tbl',
        type: 'varchar'
      },
      {
        name: 'other_col',
        tableName: 'tbl',
        type: 'bool'
      }]
    };
    it('filters by table name including the ALL suggestion when no previous columns exist', () => {
        let cols = InsertMetaProvider.getTableColumnNames(editor, 'tbl', []);
        expect(cols).toContain({text: 'test_col', rightLabelHTML: '<span class="data-atom autocomplete autocomplete-col"></span>Column', leftLabel: 'varchar'});
        expect(cols.length).toEqual(3);
    });
    it('filters by table name and only includes columns that are not existing already', () => {
        let cols = InsertMetaProvider.getTableColumnNames(editor, 'tbl', ['test_col']);
        expect(cols).toContain({text: 'other_col', rightLabelHTML: '<span class="data-atom autocomplete autocomplete-col"></span>Column', leftLabel: 'bool'});
        expect(cols.length).toEqual(1);
    });
  })
});

describe('SQLMetaProvider', () => {
  describe('Get table names', () => {
    it('filters by prefix', () => {
      let editor = {
        dataAtomTables: [
          {
            name: 'other_table',
            schemaName: 'something',
            type: 'Table'
          },
          {
            name: 'test_table_2',
            schemaName: 'something',
            type: 'Table'
          },
          {
            name: 'test_table',
            schemaName: 'something_else',
            type: 'Table'
          },
      ]};
      let tables = SQLMetaProvider.getTableNames(editor, 'test', 'something');
      // fuzzy search is done by autocomplete+ so we return a full list
      expect(tables[0].text).toEqual('other_table');
      expect(tables[1].text).toEqual('test_table_2');
      expect(tables.length).toEqual(2);
    });
  });

  describe('Get column names', () => {
    it('filters by prefix', () => {
      let editor = {
        dataAtomColumns: [
          {
            name: 'test_col',
            tableName: 'tbl',
            type: 'varchar'
          },
          {
            name: 'other_col',
            tableName: 'tbl',
            type: 'bool'
          },
          {
            name: 'other_col',
            tableName: 'tbl2',
            type: 'bool'
          }
        ]
      };
      let cols = SQLMetaProvider.getColumnNames(editor, 'test', 'tbl');
      expect(cols).toContain({text: 'test_col', rightLabelHTML: '<span class="data-atom autocomplete autocomplete-col"></span>Column', leftLabel: 'varchar'});
      expect(cols.length).toEqual(2); // fizzy search is done by autocomplete+
    });
  });
})
