var communes = {
  all: [
    {id: '*', title: 'Todas'}
  ],
  options: [
    {id: '*', title: 'Todas'}
  ],
  model: '*',
  config: {
    valueField: 'id',
    labelField: 'title',
    delimiter: '|',
    sortField: [{field: 'id', direction: 'asc'}],
    searchField: ['title'],
    placeholder: 'Buscar...',
    onDropdownOpen: function() {
      this.clear();
    },
    onDropdownClose: function() {
      if(this.getValue() == '') {
        this.setValue('*');
      }
    },
    maxItems: 1
  }
};

module.exports = communes;