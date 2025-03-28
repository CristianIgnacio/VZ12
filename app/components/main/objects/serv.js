var serv = {
  options: [
    {id: '0', title: 'Todos'},
    {id: '1', title: 'Autoservicio'},
    {id: '2', title: 'Asistido'}
  ],
  model: '0',
  config: {
    valueField: 'id',
    labelField: 'title',
    delimiter: '|',
    onInitialize: function(selectize) {
    },
    onChange: function() {
    },
    maxItems: 1
  }
};

module.exports = serv;