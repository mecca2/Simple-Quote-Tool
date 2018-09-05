

const vm = new Vue({
  el: '.vue-app',
  data: {
    results: [], 
    hourly_rate: 50, 
    single_item: {
      name: '', 
      low_hours: '', 
      high_hours: ''
    }, 
    total_low_hours: 0, 
    total_high_hours: 0 
  },
  mounted() {
   this.item = Object.assign({}, this.single_item); 
  }, 
  computed: {
    calculateLowHours: function(){
      var total = 0 ; 
      this.results.forEach(function(element){
        total += Number(element.low_hours); 
      }); 
      this.total_low_hours = total; 
      return total; 
    },
    calculateHighHours: function(){
      var total = 0 ; 
      this.results.forEach(function(element){
        total += Number(element.high_hours); 
      }); 
      this.total_high_hours = total; 
      return total; 
    },
    calculateMidHours: function(){
      return (this.total_high_hours + this.total_low_hours) / 2; 
    }, 
    calculateCost: function(){
      return this.calculateMidHours * this.hourly_rate; 
    }

  }, 
  methods : {
    addItem : function(){
     // console.log(this.single_item); 
      this.results.push(this.single_item);
     // console.log(this.results); 
      this.single_item = Object.assign({}, this.item)
    }
  }
});


Vue.config.devtools = true;
