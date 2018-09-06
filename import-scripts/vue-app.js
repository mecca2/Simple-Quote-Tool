const vm = new Vue({
  el: '.vue-app',
  data: {
    results: [],
    hourly_rate: 50,
    single_item: {
      name: '',
      low_hours: '',
      high_hours: '', 
      active: false, 
      category: 'Development'
    },
    total_low_hours: 0,
    total_high_hours: 0,
    error: false,
    error_message: '',
    non_required_fields : [
      'active'
    ], 
    categories: [
      'Development', 
      'Design', 
      'Consultation', 
      'Project Management'
    ]
  },
  mounted() {
    this.item = Object.assign({}, this.single_item);
    if (localStorage.getItem('results')) {
      this.results = JSON.parse(localStorage.getItem('results'));
    }
  },
  computed: {
    calculateLowHours: function() {
      var total = 0;
      this.results.forEach(function(element) {
        total += Number(element.low_hours);
      });
      this.total_low_hours = total;
      return total;
    },
    calculateHighHours: function() {
      var total = 0;
      this.results.forEach(function(element) {
        total += Number(element.high_hours);
      });
      this.total_high_hours = total;
      return total;
    },
    calculateMidHours: function() {
      return (this.total_high_hours + this.total_low_hours) / 2;
    },
    calculateCost: function() {
      return this.calculateMidHours * this.hourly_rate;
    }

  },
  methods: {
    addItem: function() {
      this.error = false;
      var missing_fields = [];
      for (var key in this.single_item) {
        if (this.single_item[key] == '' && this.non_required_fields.indexOf(key) == -1  ) {
          this.error = true;
          missing_fields.push(key);
        }
      }
      if (this.error) {
        this.error_message = 'The following fields are required: ' + missing_fields.toString();
      } else {
        this.results.push(this.single_item);
        this.single_item = Object.assign({}, this.item)
      }

    },
    mouseOver: function(item) {
      item.active = true; 
    }, 
    mouseLeave: function(item) {
      item.active = false; 
    }, 
    deleteItem: function(key){
      this.results.splice(key,1); 

    }, 
    editItem: function(key){
      this.single_item = this.results[key]; 
      this.deleteItem(key); 
    }

  },
  watch: {
    results: {
      handler() {
        localStorage.setItem('results', JSON.stringify(this.results));
      },
      deep: true,
    }
  }
});


Vue.config.devtools = true;