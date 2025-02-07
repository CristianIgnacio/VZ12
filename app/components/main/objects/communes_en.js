var communes = {
  all: [
    {id: '*', title: 'All'}
  ],
  options: [
    {id: '*', title: 'All'}
  ],
  model: '*',
  config: {
    valueField: 'id',
    labelField: 'title',
    delimiter: '|',
    sortField: [{field: 'id', direction: 'asc'}],
    searchField: ['title'],
    placeholder: 'Search...',
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