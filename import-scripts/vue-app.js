

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
    total_high_hours: 0, 
    error: false,
    error_message:''
  },
  mounted() {
   this.item = Object.assign({}, this.single_item); 
   if (localStorage.getItem('results')){
    this.results = JSON.parse(localStorage.getItem('results'));
   }
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
     this.error = false; 
     var missing_fields = []; 
     for(var key in this.single_item){
      if(this.single_item[key] == ''){
        this.error = true; 
        missing_fields.push(key); 
      }
     }
     if(this.error){
      this.error_message = 'The following fields are required: ' + missing_fields.toString(); 
     }else{
      this.results.push(this.single_item);
      this.single_item = Object.assign({}, this.item)
     }
      
    }
  }, 
  watch: {
    results: {
      handler(){
        localStorage.setItem('results', JSON.stringify(this.results));
      },
      deep: true,
    }
  }
});


Vue.config.devtools = true;
