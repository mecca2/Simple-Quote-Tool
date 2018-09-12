//import pdf from 'jspdf';

const vm = new Vue({
  el: '.vue-app',
  data: {
    results: [],
    hourly_rate: 50,
    standard_item: 0, 
    single_item: {
      name: '',
      low_hours: '',
      high_hours: '', 
      active: false, 
      category: 'Development', 
      has_monthly: 0 ,
      monthly : ''
    },
    customer:{
      company: '',
      first_name: '', 
      last_name: '', 
      email: ''
    },
    total_low_hours: 0,
    total_high_hours: 0,
    error: false,
    error_message: '',
    non_required_fields : [
      'active', 'monthly', 'has_monthly'
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
    }, 
    calculatedCategories : function(){
      var tempArr = {}
      this.results.forEach(function(element) {
        if(typeof(tempArr[element.category]) == "undefined"){
          tempArr[element.category] = {
            low_hours: Number(element.low_hours),
            high_hours: Number(element.high_hours),
            monthly : Number(element.monthly)
          } 
        }else{
          tempArr[element.category].low_hours += Number(element.low_hours);
          tempArr[element.category].high_hours += Number(element.high_hours);
          tempArr[element.category].monthly += Number(element.monthly);
        }
      });
      for (var key in tempArr){
        tempArr[key].mid_hours = (tempArr[key].high_hours + tempArr[key].low_hours) / 2;
        tempArr[key].precentage_of_total = tempArr[key].mid_hours / this.calculateMidHours; 
      }
      return tempArr
    }, 
    calculateIfMonthlyApplies: function(){
      var temp = false; 
      this.results.forEach(function(element) {
        if(Number(element.has_monthly) == 1){
          temp = true; 
        }
      });
      if(temp){
        return true;
      }else{
        return false; 
      }
      
    },
    calculateMonthlyCosts: function(){
      var totalMonthly = 0 
      this.results.forEach(function(element) {
        if(element.has_monthly == 1){
          totalMonthly += Number(element.monthly); 
        }
      });
      return totalMonthly; 
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
        if(this.single_item.low_hours >= this.single_item.high_hours){
          this.error = true;
          this.error_message = 'Low hours must be lower than high hours.'; 
        }else{
          this.results.push(this.single_item);
          this.single_item = Object.assign({}, this.item)
        }
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
    }, 
    createPDF: function(){
      var pdf = new jsPDF('p', 'pt', 'letter');
      source = $('.quote-container')[0];

      specialElementHandlers = {
          // element with id of "bypass" - jQuery style selector
          '#bypassme': function(element, renderer) {
              // true = "handled elsewhere, bypass text extraction"
              return true
          }
      };
      margins = {
          top: 10,
          bottom: 10,
          left: 20,
          width: 800
      };

      pdf.fromHTML(
              source, // HTML string or DOM elem ref.
              margins.left, // x coord
              margins.top, {// y coord
                  'width': margins.width, // max width of content on PDF
                  'elementHandlers': specialElementHandlers
              },
      function(dispose) {
          // dispose: object with X, Y of the last line add to the PDF 
          //          this allow the insertion of new lines after html
          pdf.save('Test.pdf');
      }
      , margins);
    }

  },
  watch: {
    results: {
      handler() {
        localStorage.setItem('results', JSON.stringify(this.results));
      },
      deep: true,
    }
  }, 
  filters: {
    toPercent(value){
      return (value * 100).toFixed(2) + '%';
    },
    toUSD(value){
      return '$' + value.toLocaleString(undefined, {maximumFractionDigits:2, minimumFractionDigits: 2});
    }
  }
});


Vue.config.devtools = true;