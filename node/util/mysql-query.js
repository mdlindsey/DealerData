'use strict';

// not used in this project yet, but left for future implementations of object-based query construction
module.exports = class {
  constructor() {
    this.input = {
      table: null,
      select: [],
      join: [],
      where: [],
      orderBy: [],
      limit: {
        min: null,
        max: null,
      },
    };
    this.query = null;
  }
  table(table) {
    this.input.table = table;
    return this;
  }
  select(field, label = null) {
    this.input.select.push({
      field: field,
      label: label
    });
    return this;
  }
  where(field, value, comparison = '=') {
    this.input.where.push({
      field: field,
      value: value,
      comparison: comparison
    });
    return this;
  }
  orderBy(field, method='ASC') {
    this.input.orderBy.push({
      field: field,
      method: method
    });
    return this;
  }
  limit(max, min=0) {
    this.input.limit.min = min;
    this.input.limit.max = max;
    return this;
  }
  compile() {
    this.query = ' SELECT ';
    let selections = [];
    for(let selection of this.input.select)
      selections.push(selection.field + (selection.label !== null ? ' AS ' + selection.label : ''));
    this.query += selections.join(', ');

    this.query += ' FROM ' + this.input.table;

    if ( this.input.where.length ) {
      this.query += ' WHERE ';
      let wheres = [];
      for(let where of this.input.where)
        wheres.push(where.field + ' ' + (where.comparison !== null ? where.comparison : '=') + ' ' + where.value);
      this.query += wheres.join(' AND ');
    }

    if ( this.input.orderBy.length ) {
      this.input.orderBy.map(order => {
        this.query += ' ORDER BY ' + order.field + ' ' + order.method + ' ';
      });
    }

    if ( this.input.limit.max !== null )
      this.query += ' LIMIT ' + ( this.input.limit.min === null ? 0 : this.input.limit.min) + ' , ' + this.input.limit.max + ' ';

    return this;
  }
}
